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
    public function index(): Response
    {
        $products = Product::with('category')->latest()->paginate(15);
        return Inertia::render('Products/Index', ['products' => $products]);
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
            'image_path' => 'required|string',
            'benefits' => 'required|array',
            'badge' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive',
        ]);

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
            'image_path' => 'required|string',
            'benefits' => 'required|array',
            'badge' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive',
        ]);

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
