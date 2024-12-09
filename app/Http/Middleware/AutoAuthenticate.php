<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AutoAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        // Vérifiez que vous êtes en environnement de développement ou de test
        if (app()->environment(['local', 'testing']) && !Auth::check()) {
            // Authentifier l'utilisateur par défaut
            $user = User::where('email', 'test@example.com')->first();
            if ($user) {
                Auth::login($user);
            }
        }

        return $next($request);
    }
}
