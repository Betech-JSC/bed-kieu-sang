<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoRedirect extends Model
{
    protected $fillable = [
        'old_url', 'new_url', 'http_code', 'status'
    ];
}
