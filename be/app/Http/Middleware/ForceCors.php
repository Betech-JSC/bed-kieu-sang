<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCors
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->is('api/*')) {
            return $next($request);
        }

        $headers = $this->headersFor($request);

        if ($request->isMethod('OPTIONS')) {
            return response('', 204)->withHeaders($headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }

    private function headersFor(Request $request): array
    {
        $origin = $request->headers->get('Origin');
        $allowedOrigin = $this->allowedOrigin($origin);

        return [
            'Access-Control-Allow-Origin' => $allowedOrigin,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => $request->headers->get('Access-Control-Request-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin'),
            'Access-Control-Max-Age' => '86400',
            'Vary' => 'Origin',
        ];
    }

    private function allowedOrigin(?string $origin): string
    {
        if (! $origin) {
            return config('app.url', '*');
        }

        $allowedOrigins = array_filter([
            config('app.url'),
            ...config('cors.allowed_origins', []),
            'https://xongnhatayue.vn',
            'https://bed-kieu-sang.vercel.app',
            'https://cms.xongnhatayue.vn',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://sandbox.pay2s.vn',
        ]);

        if (in_array($origin, $allowedOrigins, true)) {
            return $origin;
        }

        if (preg_match('#^https?://([a-z0-9-]+\.)?xongnhatayue\.vn$#i', $origin)) {
            return $origin;
        }

        if (preg_match('#^https://[a-z0-9-]+\.vercel\.app$#i', $origin)) {
            return $origin;
        }

        return 'https://xongnhatayue.vn';
    }
}
