<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasPublicImageUrl
{
    protected function imagePath(): Attribute
    {
        return Attribute::make(
            get: function (?string $value): ?string {
                if (!$value || preg_match('#^(https?:)?//#', $value)) {
                    return $value;
                }

                return url('/'.ltrim($value, '/'));
            },
            set: function (?string $value): ?string {
                $appUrl = rtrim((string) config('app.url'), '/');
                if ($value && $appUrl && str_starts_with($value, $appUrl.'/')) {
                    return '/'.ltrim((string) parse_url($value, PHP_URL_PATH), '/');
                }

                return $value;
            },
        );
    }
}
