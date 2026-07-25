<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->institution_id) {
            $request->merge(['institution_id' => $user->institution_id]);
            $request->setUserResolver(function () use ($user) {
                return $user;
            });
        }

        return $next($request);
    }
}

