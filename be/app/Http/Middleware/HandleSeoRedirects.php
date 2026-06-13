<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\SeoRedirect;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleSeoRedirects
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->getRequestUri(); // Obtains full request path with query string, e.g. /cu-san-pham-xong

        $redirect = SeoRedirect::where('old_url', $path)
            ->where('status', 'active')
            ->first();

        if ($redirect) {
            return redirect($redirect->new_url, $redirect->http_code);
        }

        return $next($request);
    }
}
