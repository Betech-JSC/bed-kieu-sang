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
        'image_path', 'read_time', 'status', 'published_at',
        'seo_title', 'seo_desc', 'recommended_product_ids'
    ];

    protected $casts = [
        'content' => 'array',
        'published_at' => 'datetime',
        'recommended_product_ids' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
