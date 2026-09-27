<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug', 'slug_en', 'title', 'title_en', 'content', 'content_en', 'meta_title', 'meta_description', 'meta_keywords', 'status',
        'seo_title', 'seo_desc'
    ];

    public function resolveRouteBinding($value, $field = null)
    {
        if ($field === 'slug') {
            return $this->where('slug', $value)
                ->orWhere('slug_en', $value)
                ->first();
        }

        return parent::resolveRouteBinding($value, $field);
    }
}
