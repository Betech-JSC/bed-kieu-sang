<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')->latest();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->paginate(15)->withQueryString();
        $categories = Category::where('type', 'product')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('type', 'product')->get();
        return Inertia::render('Products/Form', ['categories' => $categories]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'image_path' => 'required_without:image|nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'benefits' => 'nullable|array',
            'badge' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive',
            'seo_title' => 'nullable|string|max:255',
            'seo_desc' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images'), $filename);
            $validated['image_path'] = '/images/' . $filename;
            
            // Copy to storefront
            $fePath = base_path('../web/public/images');
            if (file_exists($fePath)) {
                copy(public_path('images/' . $filename), $fePath . '/' . $filename);
            }
        }

        unset($validated['image']);
        $validated['benefits'] = $validated['benefits'] ?? [];
        $product = Product::create($validated);

        ActivityLogger::log('CREATE', 'products', "Created product '{$product->name}'", null, $product->toArray());

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $categories = Category::where('type', 'product')->get();
        return Inertia::render('Products/Form', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $product->id,
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'image_path' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'benefits' => 'nullable|array',
            'badge' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive',
            'seo_title' => 'nullable|string|max:255',
            'seo_desc' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images'), $filename);
            $validated['image_path'] = '/images/' . $filename;
            
            // Copy to storefront
            $fePath = base_path('../web/public/images');
            if (file_exists($fePath)) {
                copy(public_path('images/' . $filename), $fePath . '/' . $filename);
            }
        }

        unset($validated['image']);
        $validated['benefits'] = $validated['benefits'] ?? [];
        $oldValue = $product->toArray();
        $product->update($validated);

        ActivityLogger::log('UPDATE', 'products', "Updated product '{$product->name}'", $oldValue, $product->toArray());

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $oldValue = $product->toArray();
        $product->delete();

        ActivityLogger::log('DELETE', 'products', "Deleted product '{$oldValue['name']}'", $oldValue, null);

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
