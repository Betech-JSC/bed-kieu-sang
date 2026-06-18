<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\SeoRedirectController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
});

Route::middleware('guest')->group(function () {
    Route::get('admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
    Route::post('admin/login', [AuthController::class, 'login']);
});

Route::get('/login', function () {
    return redirect()->route('admin.login');
})->name('login');

Route::middleware('auth')->group(function () {
    Route::post('admin/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::redirect('/admin', '/admin/dashboard');

Route::middleware(['auth'])->get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->name('dashboard');


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/guide', fn () => Inertia::render('Guide/Index'))->name('guide');
    
    // Products
    Route::resource('products', ProductController::class)->only(['index']);
    Route::resource('products', ProductController::class)->only(['create', 'store', 'edit', 'update', 'destroy'])->middleware('permission:manage_products');

    // Categories
    Route::resource('categories', CategoryController::class)->only(['index']);
    Route::resource('categories', CategoryController::class)->only(['create', 'store', 'edit', 'update', 'destroy'])->middleware('permission:manage_categories');

    // Blogs
    Route::resource('blogs', BlogPostController::class)->only(['index']);
    Route::resource('blogs', BlogPostController::class)->only(['create', 'store', 'edit', 'update', 'destroy'])->middleware('permission:manage_blogs');

    // Pages
    Route::resource('pages', PageController::class)->only(['index']);
    Route::resource('pages', PageController::class)->only(['create', 'store', 'edit', 'update', 'destroy'])->middleware('permission:manage_pages');

    // Banners
    Route::resource('banners', BannerController::class)->only(['index']);
    Route::resource('banners', BannerController::class)->only(['create', 'store', 'edit', 'update', 'destroy'])->middleware('permission:manage_settings');
    
    // Testimonials
    Route::get('testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
    Route::patch('testimonials/{testimonial}/status', [TestimonialController::class, 'updateStatus'])->name('testimonials.status')->middleware('permission:manage_products');
    
    // Contacts
    Route::resource('contacts', ContactController::class)->only(['index', 'show']);
    Route::resource('contacts', ContactController::class)->only(['destroy'])->middleware('permission:manage_settings');

    // Orders
    Route::resource('orders', OrderController::class)->only(['index', 'show']);
    Route::resource('orders', OrderController::class)->only(['update'])->middleware('permission:manage_products');

    // SEO Redirects
    Route::resource('seo-redirects', SeoRedirectController::class)->only(['index']);
    Route::resource('seo-redirects', SeoRedirectController::class)->only(['create', 'store', 'edit', 'update', 'destroy'])->middleware('permission:manage_settings');
    
    // Settings
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingController::class, 'update'])->name('settings.update')->middleware('permission:manage_settings');

    // Users
    Route::resource('users', UserController::class)->middleware('permission:manage_users');

    // Activity Logs
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index')->middleware('permission:view_activity_logs');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
