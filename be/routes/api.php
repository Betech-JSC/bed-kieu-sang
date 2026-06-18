<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\PublicProductController;
use App\Http\Controllers\Api\V1\PublicBlogController;
use App\Http\Controllers\Api\V1\PublicPageController;
use App\Http\Controllers\Api\V1\PublicOrderController;
use App\Http\Controllers\Api\V1\PublicContactController;
use App\Http\Controllers\Api\V1\PublicSettingController;
use App\Http\Controllers\Api\V1\PublicBannerController;
use App\Http\Controllers\Api\V1\PublicTestimonialController;
use App\Http\Controllers\Api\V1\PublicFaqController;
use App\Http\Controllers\Api\V1\PublicProductQuestionController;

Route::prefix('v1')->group(function () {
    Route::get('/products', [PublicProductController::class, 'index']);
    Route::get('/products/{slug}', [PublicProductController::class, 'show']);
    Route::get('/blogs', [PublicBlogController::class, 'index']);
    Route::get('/blogs/{slug}', [PublicBlogController::class, 'show']);
    Route::get('/pages/{slug}', [PublicPageController::class, 'show']);
    Route::get('/settings', [PublicSettingController::class, 'index']);
    Route::get('/banners', [PublicBannerController::class, 'index']);
    Route::get('/testimonials', [PublicTestimonialController::class, 'index']);
    Route::get('/faqs', [PublicFaqController::class, 'index']);
    Route::get('/products/{product:slug}/questions', [PublicProductQuestionController::class, 'index']);
    Route::get('/categories', [PublicProductController::class, 'categories']);
    
    // Storefront client form submissions
    Route::post('/contacts', [PublicContactController::class, 'store']);
    Route::post('/orders', [PublicOrderController::class, 'store']);
    Route::post('/products/{product:slug}/questions', [PublicProductQuestionController::class, 'store'])->middleware('throttle:5,1');
});

Route::post('/contacts', [PublicContactController::class, 'store']);
Route::post('/orders', [PublicOrderController::class, 'store']);
