<?php

namespace App\Providers;

use App\Services\PayloadComparisonService;
use Illuminate\Support\ServiceProvider;

class PayloadComparisonServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(PayloadComparisonService::class, function ($app) {
            return new PayloadComparisonService;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
