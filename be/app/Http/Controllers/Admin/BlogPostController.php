<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Category;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BlogPostController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BlogPost::with('category')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('excerpt', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $posts = $query->paginate(15)->withQueryString();
        $categories = Category::where('type', 'blog')->get();

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('type', 'blog')->get();
        return Inertia::render('Blog/Form', ['categories' => $categories]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:blog_posts,slug',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|array',
            'image_path' => 'required_without:image|nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'read_time' => 'required|string|max:50',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
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
        if ($validated['status'] === 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);

        ActivityLogger::log('CREATE', 'blog_posts', "Created blog post '{$post->title}'", null, $post->toArray());

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $blog): Response
    {
        $categories = Category::where('type', 'blog')->get();
        return Inertia::render('Blog/Form', [
            'post' => $blog,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, BlogPost $blog): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:blog_posts,slug,' . $blog->id,
            'excerpt' => 'required|string|max:500',
            'content' => 'required|array',
            'image_path' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'read_time' => 'required|string|max:50',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
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
        if ($validated['status'] === 'published' && !$blog->published_at && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $oldValue = $blog->toArray();
        $blog->update($validated);

        ActivityLogger::log('UPDATE', 'blog_posts', "Updated blog post '{$blog->title}'", $oldValue, $blog->toArray());

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        $oldValue = $blog->toArray();
        $blog->delete();

        ActivityLogger::log('DELETE', 'blog_posts', "Deleted blog post '{$oldValue['title']}'", $oldValue, null);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post deleted successfully.');
    }
}
