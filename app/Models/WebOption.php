<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebOption extends Model
{
    use HasFactory;

    protected $table = 'web_options';
    protected $fillable = ['name', 'value', 'path_file'];
}
