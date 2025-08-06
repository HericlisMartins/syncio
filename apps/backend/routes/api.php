<?php

use App\Http\Controllers\Api\PayloadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Payload management routes
Route::prefix('payloads')->group(function () {
    // Store payload 1 or 2
    Route::post('/{payloadNumber}', [PayloadController::class, 'store'])
        ->where('payloadNumber', '[12]')
        ->name('payloads.store');

    // Get stored payload by number
    Route::get('/{payloadNumber}', [PayloadController::class, 'show'])
        ->where('payloadNumber', '[12]')
        ->name('payloads.show');
});

// Comparison route
Route::post('/compare', [PayloadController::class, 'compare'])
    ->name('payloads.compare');

// Shopify product update webhook route
Route::get('/webhooks/shopify/product-update', [PayloadController::class, 'shopifyProductUpdate'])
    ->name('webhooks.shopify.product-update');

// Health check route
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is healthy',
        'timestamp' => now()->toISOString(),
    ]);
})->name('api.health');
