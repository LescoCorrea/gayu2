<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class ArtisanMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    { 
        {

            if (Auth::guard('sanctum')->check()) {
                $artisan = Auth::guard('sanctum')->user();

                if ($artisan->hasRole('artisan')) {
                    return $next($request);
                } else {
                    //Log::warning('Artisan n\'a pas de rôle !!');
                    return response()->json(['error' => 'Non authorisée !!'], 403);
                }
            }
            //Log::info('Authentification échouée en tant qu\'artisan.');
            return response()->json(['error' => 'Non authorisée !!'], 401);
        }
    }
}
