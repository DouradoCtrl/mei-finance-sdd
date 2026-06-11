<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponse;

class EnsureUserIsActive
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->active) {
            $user->currentAccessToken()?->delete();
            return $this->errorResponse('Sua conta está desativada. Entre em contato com o suporte.', 403);
        }

        return $next($request);
    }
}
