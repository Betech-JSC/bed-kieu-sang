<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->groupBy('group');
        return Inertia::render('Settings/Index', ['settings' => $settings]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable',
            'settings.*.value_en' => 'nullable',
        ]);

        foreach ($validated['settings'] as $settingData) {
            $setting = Setting::where('key', $settingData['key'])->first();
            if ($setting) {
                $oldValue = $setting->toArray();
                $updateData = ['value' => $settingData['value'] ?? null];
                if (array_key_exists('value_en', $settingData)) {
                    $updateData['value_en'] = $settingData['value_en'];
                }
                $setting->update($updateData);
                
                if ($oldValue['value'] !== $setting->value || ($oldValue['value_en'] ?? null) !== $setting->value_en) {
                    ActivityLogger::log('UPDATE', 'settings', "Updated setting '{$setting->key}'", $oldValue, $setting->fresh()->toArray());
                }
            }
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
