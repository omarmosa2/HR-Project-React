<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, don't redirect - return null to send 401 response
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // For web requests, redirect to login (if login route exists)
        return route('login');
    }
}
