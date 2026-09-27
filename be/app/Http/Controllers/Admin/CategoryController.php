<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Category::latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('name_en', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $categories = $query->paginate(15)->withQueryString();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'type'])
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Categories/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'slug_en' => 'nullable|string|max:255',
            'type' => 'required|in:product,blog',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if (!empty($validated['name_en']) && empty($validated['slug_en'])) {
            $validated['slug_en'] = Str::slug($validated['name_en']);
        }

        // Double check uniqueness of slug
        $slugCount = Category::where('slug', $validated['slug'])->count();
        if ($slugCount > 0) {
            $validated['slug'] = $validated['slug'] . '-' . time();
        }

        $category = Category::create($validated);

        ActivityLogger::log('CREATE', 'categories', "Created category '{$category['name']}' of type '{$category['type']}'", null, $category->toArray());

        return redirect()->route('admin.categories.index')->with('success', 'Danh mục đã được tạo thành công.');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Categories/Form', [
            'category' => $category
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug,' . $category->id,
            'slug_en' => 'nullable|string|max:255',
            'type' => 'required|in:product,blog',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if (!empty($validated['name_en']) && empty($validated['slug_en'])) {
            $validated['slug_en'] = Str::slug($validated['name_en']);
        }

        $oldValue = $category->toArray();
        $category->update($validated);

        ActivityLogger::log('UPDATE', 'categories', "Updated category '{$category['name']}'", $oldValue, $category->fresh()->toArray());

        return redirect()->route('admin.categories.index')->with('success', 'Danh mục đã được cập nhật thành công.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Prevent deletion if category is in use
        if ($category->type === 'product' && $category->products()->count() > 0) {
            return redirect()->route('admin.categories.index')->with('error', 'Không thể xóa danh mục này vì có sản phẩm đang sử dụng.');
        }

        if ($category->type === 'blog' && $category->blogPosts()->count() > 0) {
            return redirect()->route('admin.categories.index')->with('error', 'Không thể xóa danh mục này vì có bài viết đang sử dụng.');
        }

        $oldValue = $category->toArray();
        $category->delete();

        ActivityLogger::log('DELETE', 'categories', "Deleted category '{$oldValue['name']}'", $oldValue, null);

        return redirect()->route('admin.categories.index')->with('success', 'Danh mục đã được xóa thành công.');
    }
}
