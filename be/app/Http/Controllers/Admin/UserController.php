<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->paginate(15)->withQueryString();

        // Standard available permissions in the system
        $availablePermissions = [
            'manage_products' => 'Quản lý Sản phẩm',
            'manage_blogs' => 'Quản lý Bài viết',
            'manage_categories' => 'Quản lý Danh mục',
            'manage_pages' => 'Quản lý Trang tĩnh',
            'manage_settings' => 'Cấu hình hệ thống',
            'manage_users' => 'Quản lý Nhân viên & Phân quyền',
            'view_activity_logs' => 'Xem Nhật ký hoạt động',
        ];

        return Inertia::render('Users/Index', [
            'users' => $users,
            'availablePermissions' => $availablePermissions,
            'filters' => $request->only(['search', 'role'])
        ]);
    }

    public function create(): Response
    {
        $availablePermissions = [
            'manage_products' => 'Quản lý Sản phẩm',
            'manage_blogs' => 'Quản lý Bài viết',
            'manage_categories' => 'Quản lý Danh mục',
            'manage_pages' => 'Quản lý Trang tĩnh',
            'manage_settings' => 'Cấu hình hệ thống',
            'manage_users' => 'Quản lý Nhân viên & Phân quyền',
            'view_activity_logs' => 'Xem Nhật ký hoạt động',
        ];

        return Inertia::render('Users/Form', [
            'availablePermissions' => $availablePermissions
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:super_admin,editor,viewer',
            'permissions' => 'nullable|array',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['permissions'] = $validated['role'] === 'super_admin' 
            ? ['manage_products', 'manage_blogs', 'manage_categories', 'manage_pages', 'manage_settings', 'manage_users', 'view_activity_logs']
            : ($validated['permissions'] ?? []);

        $user = User::create($validated);

        ActivityLogger::log('CREATE', 'users', "Created staff account '{$user->name}' with role '{$user->role}'", null, $user->makeHidden('password')->toArray());

        return redirect()->route('admin.users.index')->with('success', 'Nhân viên đã được tạo thành công.');
    }

    public function edit(User $user): Response
    {
        $availablePermissions = [
            'manage_products' => 'Quản lý Sản phẩm',
            'manage_blogs' => 'Quản lý Bài viết',
            'manage_categories' => 'Quản lý Danh mục',
            'manage_pages' => 'Quản lý Trang tĩnh',
            'manage_settings' => 'Cấu hình hệ thống',
            'manage_users' => 'Quản lý Nhân viên & Phân quyền',
            'view_activity_logs' => 'Xem Nhật ký hoạt động',
        ];

        return Inertia::render('Users/Form', [
            'user' => $user,
            'availablePermissions' => $availablePermissions
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:super_admin,editor,viewer',
            'permissions' => 'nullable|array',
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Super admins automatically get all permissions
        $validated['permissions'] = $validated['role'] === 'super_admin' 
            ? ['manage_products', 'manage_blogs', 'manage_categories', 'manage_pages', 'manage_settings', 'manage_users', 'view_activity_logs']
            : ($validated['permissions'] ?? []);

        // Prevent self-demotion or disabling of own super admin role to protect systems
        if (auth()->id() === $user->id && $user->role === 'super_admin' && $validated['role'] !== 'super_admin') {
            return redirect()->route('admin.users.index')->with('error', 'Bạn không thể tự hạ quyền Super Admin của chính mình.');
        }

        $oldValue = $user->makeHidden('password')->toArray();
        $user->update($validated);

        ActivityLogger::log('UPDATE', 'users', "Updated staff account '{$user->name}'", $oldValue, $user->makeHidden('password')->toArray());

        return redirect()->route('admin.users.index')->with('success', 'Nhân viên đã được cập nhật thành công.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Prevent self deletion
        if (auth()->id() === $user->id) {
            return redirect()->route('admin.users.index')->with('error', 'Bạn không thể tự xóa tài khoản của chính mình.');
        }

        $oldValue = $user->makeHidden('password')->toArray();
        $user->delete();

        ActivityLogger::log('DELETE', 'users', "Deleted staff account '{$oldValue['name']}'", $oldValue, null);

        return redirect()->route('admin.users.index')->with('success', 'Nhân viên đã được xóa thành công.');
    }
}
