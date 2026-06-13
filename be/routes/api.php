<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\PublicProductController;
use App\Http\Controllers\Api\V1\PublicBlogController;
use App\Http\Controllers\Api\V1\PublicPageController;
use App\Http\Controllers\Api\V1\PublicOrderController;
use App\Http\Controllers\Api\V1\PublicContactController;
use App\Http\Controllers\Api\V1\PublicSettingController;

Route::prefix('v1')->group(function () {
    Route::get('/products', [PublicProductController::class, 'index']);
    Route::get('/products/{slug}', [PublicProductController::class, 'show']);
    Route::get('/blogs', [PublicBlogController::class, 'index']);
    Route::get('/blogs/{slug}', [PublicBlogController::class, 'show']);
    Route::get('/pages/{slug}', [PublicPageController::class, 'show']);
    Route::get('/settings', [PublicSettingController::class, 'index']);
    
    // Storefront client form submissions
    Route::post('/contacts', [PublicContactController::class, 'store']);
    Route::post('/orders', [PublicOrderController::class, 'store']);
});
