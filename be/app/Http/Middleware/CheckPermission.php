<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('admin.login');
        }

        // Super Admin bypasses all permission checks
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        // Check if user has the specific permission in their JSON permissions array
        $permissions = is_array($user->permissions) ? $user->permissions : json_decode($user->permissions ?? '[]', true);

        if (!in_array($permission, $permissions)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này.'], 403);
            }
            return redirect()->route('admin.dashboard')->with('error', 'Bạn không có quyền truy cập chức năng này.');
        }

        return $next($request);
    }
}
