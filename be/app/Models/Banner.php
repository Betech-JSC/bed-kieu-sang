<?php

namespace App\Models;

use App\Models\Concerns\HasPublicImageUrl;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasPublicImageUrl;

    protected $fillable = [
        'title', 'subtitle', 'image_path', 'link_url', 'page_key', 'position', 'order_index', 'status'
    ];
}
