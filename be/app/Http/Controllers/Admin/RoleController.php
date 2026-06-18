<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Roles/Index', ['roles' => Role::withCount('users')->with('permissions')->get()]);
    }

    public function create(): Response { return $this->formResponse(); }
    public function edit(Role $role): Response { return $this->formResponse($role->load('permissions')); }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $role = Role::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name'], '_'),
            'description' => $validated['description'] ?? null,
        ]);
        $role->permissions()->sync($validated['permission_ids'] ?? []);
        ActivityLogger::log('CREATE', 'roles', "Created role '{$role->name}'");
        return redirect()->route('admin.roles.index')->with('success', 'Đã tạo vai trò.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $this->validated($request, $role);
        $role->update(['name' => $validated['name'], 'description' => $validated['description'] ?? null]);
        if ($role->slug !== 'super_admin') $role->permissions()->sync($validated['permission_ids'] ?? []);
        ActivityLogger::log('UPDATE', 'roles', "Updated role '{$role->name}'");
        return redirect()->route('admin.roles.index')->with('success', 'Đã cập nhật vai trò.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->is_system || $role->users()->exists()) return back()->with('error', 'Không thể xóa vai trò hệ thống hoặc vai trò đang được sử dụng.');
        $role->delete();
        return back()->with('success', 'Đã xóa vai trò.');
    }

    private function formResponse(?Role $role = null): Response
    {
        return Inertia::render('Roles/Form', [
            'role' => $role,
            'permissions' => Permission::orderBy('module')->orderBy('name')->get()->groupBy('module'),
        ]);
    }

    private function validated(Request $request, ?Role $role = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('roles', 'name')->ignore($role)],
            'description' => ['nullable', 'string', 'max:255'],
            'permission_ids' => ['array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);
    }
}
