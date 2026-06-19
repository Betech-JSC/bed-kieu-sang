<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $table = 'media';
    protected $fillable = ['disk', 'path', 'original_name', 'mime_type', 'size', 'alt_text', 'uploaded_by'];
    protected $appends = ['url'];

    protected function url(): Attribute
    {
        return Attribute::get(fn () => '/storage/' . $this->path);
    }
}
