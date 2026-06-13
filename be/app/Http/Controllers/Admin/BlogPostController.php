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
    public function index(): Response
    {
        $posts = BlogPost::with('category')->latest()->paginate(15);
        return Inertia::render('Blog/Index', ['posts' => $posts]);
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
            'image_path' => 'required|string',
            'read_time' => 'required|string|max:50',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

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
            'image_path' => 'required|string',
            'read_time' => 'required|string|max:50',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

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
