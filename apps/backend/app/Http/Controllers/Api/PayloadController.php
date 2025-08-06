<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PayloadComparisonService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PayloadController extends Controller
{
    public function __construct(
        private PayloadComparisonService $comparisonService
    ) {}

    /**
     * Store a payload (1 or 2)
     */
    public function store(Request $request, string $payloadNumber): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'payload' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payload data',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $payloadId = Str::uuid();
            $receivedAt = Carbon::now();

            // Store payload in cache with TTL of 1 hour
            $payloadData = [
                'id' => $payloadId,
                'payload' => $request->input('payload'),
                'received_at' => $receivedAt->toISOString(),
                'payload_number' => $payloadNumber,
            ];

            Cache::put("payload_{$payloadNumber}", $payloadData, 3600);
            Cache::put("payload_id_{$payloadId}", $payloadData, 3600);

            return response()->json([
                'success' => true,
                'data' => $payloadData,
                'message' => "Payload {$payloadNumber} stored successfully",
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to store payload: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Compare two payloads
     */
    public function compare(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'payload1_id' => 'required|string',
            'payload2_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid comparison request',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $payload1 = Cache::get("payload_id_{$request->payload1_id}");
            $payload2 = Cache::get("payload_id_{$request->payload2_id}");

            if (! $payload1 || ! $payload2) {
                return response()->json([
                    'success' => false,
                    'message' => 'One or both payloads not found',
                ], 404);
            }

            $comparisonResult = $this->comparisonService->compare(
                $payload1['payload'],
                $payload2['payload']
            );

            return response()->json([
                'success' => true,
                'data' => $comparisonResult,
                'message' => 'Comparison completed successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Comparison failed: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get stored payload by number
     */
    public function show(string $payloadNumber): JsonResponse
    {
        try {
            $payload = Cache::get("payload_{$payloadNumber}");

            if (! $payload) {
                return response()->json([
                    'success' => false,
                    'message' => "Payload {$payloadNumber} not found",
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $payload,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payload: '.$e->getMessage(),
            ], 500);
        }
    }


    /**
     * Handle Shopify product update webhook
     */
    public function shopifyProductUpdate(Request $request): JsonResponse
    {
        // Log the incoming request for debugging
        Log::info('Shopify Product Update Webhook Received', [
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        try {
            // Get Shopify webhook signature
            $shopifySignature = $request->header('X-Shopify-Hmac-Sha256');
            
            // Check if we have a Shopify API secret configured
            $shopifySecret = config('services.shopify.api_secret');
            
            // Only validate signature if both signature and secret are present
            if ($shopifySignature && $shopifySecret) {
                $calculatedSignature = base64_encode(hash_hmac('sha256', $request->getContent(), $shopifySecret, true));
                
                if (!hash_equals($shopifySignature, $calculatedSignature)) {
                    Log::warning('Invalid Shopify webhook signature', [
                        'provided' => $shopifySignature,
                        'calculated' => $calculatedSignature,
                    ]);
                    
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid Shopify webhook signature',
                    ], 403);
                }
            } else {
                Log::info('Shopify webhook signature validation skipped', [
                    'has_signature' => !empty($shopifySignature),
                    'has_secret' => !empty($shopifySecret),
                ]);
            }

            // Process the product update payload
            $productData = $request->input('product', $request->all());

            Log::info('Shopify product update processed', [
                'product_id' => $productData['id'] ?? 'unknown',
                'product_title' => $productData['title'] ?? 'unknown',
            ]);

            // Here you would typically update your database or perform other actions

            return response()->json([
                'success' => true,
                'message' => 'Shopify product update processed successfully',
                'data' => $productData,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process Shopify product update', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process Shopify product update: '.$e->getMessage(),
            ], 500);
        }
    }
}