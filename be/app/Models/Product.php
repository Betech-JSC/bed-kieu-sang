<?php

namespace App\Models;

use App\Models\Concerns\HasPublicImageUrl;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasPublicImageUrl;

    protected $fillable = [
        'category_id', 'slug', 'name', 'price', 'original_price', 
        'rating', 'channel_one_sales', 'channel_two_sales', 'virtual_sales',
        'real_sales', 'description', 'image_path', 'benefits', 'badge',
        'is_best_seller', 'status',
        'seo_title', 'seo_desc'
    ];

    protected $appends = ['total_sales'];

    protected $casts = [
        'benefits' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'channel_one_sales' => 'integer',
        'channel_two_sales' => 'integer',
        'virtual_sales' => 'integer',
        'real_sales' => 'integer',
        'is_best_seller' => 'boolean',
    ];

    public function getTotalSalesAttribute(): int
    {
        return (int) $this->channel_one_sales
            + (int) $this->channel_two_sales
            + (int) $this->virtual_sales
            + (int) $this->real_sales;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ProductQuestion::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    public function activeVariants(): HasMany
    {
        return $this->variants()->where('status', 'active');
    }
}
