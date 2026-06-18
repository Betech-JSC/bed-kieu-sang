<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
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
        $query = User::with('roleModel.permissions')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('role_id')) {
            $query->where('role_id', $request->integer('role_id'));
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => Role::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => $request->only(['search', 'role_id'])
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Users/Form', [
            'roles' => Role::with('permissions')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $this->applyRole($validated);

        $user = User::create($validated);

        ActivityLogger::log('CREATE', 'users', "Created staff account '{$user->name}' with role '{$user->role}'", null, $user->makeHidden('password')->toArray());

        return redirect()->route('admin.users.index')->with('success', 'Nhân viên đã được tạo thành công.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Users/Form', [
            'user' => $user->load('roleModel.permissions'),
            'roles' => Role::with('permissions')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
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

        $this->applyRole($validated);

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

    private function applyRole(array &$validated): void
    {
        $role = Role::with('permissions')->findOrFail($validated['role_id']);
        $validated['role'] = $role->slug;
        $validated['permissions'] = $role->permissions->pluck('key')->all();
    }
}
