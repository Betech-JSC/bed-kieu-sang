<?php

namespace App\Models;

use App\Models\Concerns\HasPublicImageUrl;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    use HasPublicImageUrl;

    protected $fillable = [
        'category_id', 'slug', 'title', 'excerpt', 'content', 
        'title_en', 'slug_en', 'excerpt_en', 'content_en',
        'image_path', 'read_time', 'status', 'published_at',
        'seo_title', 'seo_desc', 'recommended_product_ids'
    ];

    protected $casts = [
        'content' => 'array',
        'content_en' => 'array',
        'published_at' => 'datetime',
        'recommended_product_ids' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

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
