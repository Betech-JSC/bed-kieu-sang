<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')->withCount('variants')->latest();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return Inertia::render('Products/Index', [
            'products' => $query->paginate(15)->withQueryString(),
            'categories' => Category::where('type', 'product')->get(),
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Form', [
            'categories' => Category::where('type', 'product')->get(),
            'variantConfiguration' => ['has_variants' => false, 'variants' => []],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $this->validateVariants($validated);
        $product = DB::transaction(function () use ($request, $validated) {
            $product = Product::create($this->productData($request, $validated));
            $this->syncVariants($request, $product, $validated);

            return $product->fresh();
        });
        ActivityLogger::log('CREATE', 'products', "Created product '{$product->name}'", null, $product->toArray());

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load('variants');

        return Inertia::render('Products/Form', [
            'product' => $product,
            'categories' => Category::where('type', 'product')->get(),
            'variantConfiguration' => $this->variantConfiguration($product),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate($this->rules($product));
        $this->validateVariants($validated);
        $oldValue = $product->toArray();
        DB::transaction(function () use ($request, $validated, $product) {
            $product->update($this->productData($request, $validated));
            $this->syncVariants($request, $product, $validated);
        });
        ActivityLogger::log('UPDATE', 'products', "Updated product '{$product->name}'", $oldValue, $product->fresh()->toArray());

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $oldValue = $product->toArray();
        $product->delete();
        ActivityLogger::log('DELETE', 'products', "Deleted product '{$oldValue['name']}'", $oldValue, null);

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    private function rules(?Product $product = null): array
    {
        $productId = $product?->id;

        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug'.($productId ? ','.$productId : ''),
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'image_path' => ($product ? 'nullable' : 'required_without:image|nullable').'|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string|max:255',
            'badge' => 'nullable|string|max:50',
            'channel_one_sales' => 'nullable|integer|min:0',
            'channel_two_sales' => 'nullable|integer|min:0',
            'virtual_sales' => 'nullable|integer|min:0',
            'real_sales' => 'nullable|integer|min:0',
            'is_best_seller' => 'nullable|boolean',
            'status' => 'required|in:active,inactive',
            'seo_title' => 'nullable|string|max:255',
            'seo_desc' => 'nullable|string',
            'has_variants' => 'nullable|boolean',
            'variants' => 'nullable|array|max:500',
            'variants.*.name' => 'required|string|max:150',
            'variants.*.sku' => [
                'required', 'string', 'max:100', 'distinct',
                function (string $attribute, mixed $value, \Closure $fail) use ($productId) {
                    $exists = ProductVariant::where('sku', $value)
                        ->when($productId, fn ($query) => $query->where('product_id', '!=', $productId))
                        ->exists();
                    if ($exists) {
                        $fail('SKU này đã được sử dụng cho một sản phẩm khác.');
                    }
                },
            ],
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.original_price' => 'nullable|numeric|min:0',
            'variants.*.image_path' => 'nullable|string',
            'variants.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.status' => 'required|in:active,inactive',
        ];
    }

    private function validateVariants(array $validated): void
    {
        if (!($validated['has_variants'] ?? false)) {
            return;
        }
        $variants = $validated['variants'] ?? [];
        $errors = [];
        if ($variants === []) {
            $errors['variants'] = 'Hãy tạo ít nhất một phân loại sản phẩm.';
        }
        $names = [];
        $hasActive = false;
        foreach ($variants as $index => $variant) {
            $key = mb_strtolower(trim($variant['name']));
            if (isset($names[$key])) {
                $errors["variants.$index.name"] = 'Tên phân loại không được trùng nhau.';
            }
            $names[$key] = true;
            $hasActive = $hasActive || $variant['status'] === 'active';
        }
        if (!$hasActive && $variants !== []) {
            $errors['variants'] = 'Cần ít nhất một phân loại đang bán.';
        }
        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }

    private function productData(Request $request, array $validated): array
    {
        $data = collect($validated)->except(['image', 'has_variants', 'variants'])->all();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = Storage::disk('public')->url($path);
        }
        $data['benefits'] = $data['benefits'] ?? [];
        $data['is_best_seller'] = $request->boolean('is_best_seller');

        return $data;
    }

    private function syncVariants(Request $request, Product $product, array $validated): void
    {
        $product->variants()->delete();
        if (!($validated['has_variants'] ?? false)) {
            return;
        }
        foreach ($validated['variants'] as $index => $variantData) {
            $imagePath = $variantData['image_path'] ?? null;
            if ($request->hasFile("variants.$index.image")) {
                $path = $request->file("variants.$index.image")->store('product-variants', 'public');
                $imagePath = Storage::disk('public')->url($path);
            }
            $product->variants()->create([
                'name' => trim($variantData['name']),
                'sku' => trim($variantData['sku']),
                'price' => $variantData['price'],
                'original_price' => ($variantData['original_price'] ?? null) ?: null,
                'image_path' => $imagePath,
                'stock' => $variantData['stock'],
                'status' => $variantData['status'],
                'position' => $index,
            ]);
        }
        $active = $product->variants()->where('status', 'active');
        $product->update([
            'price' => (clone $active)->min('price'),
            'original_price' => (clone $active)->whereNotNull('original_price')->min('original_price'),
        ]);
    }

    private function variantConfiguration(Product $product): array
    {
        $variants = $product->variants->map(fn ($variant) => [
            'name' => $variant->name,
            'sku' => $variant->sku,
            'price' => $variant->price,
            'original_price' => $variant->original_price,
            'image_path' => $variant->image_path,
            'stock' => $variant->stock,
            'status' => $variant->status,
        ])->values();

        return ['has_variants' => $variants->isNotEmpty(), 'variants' => $variants];
    }
}
