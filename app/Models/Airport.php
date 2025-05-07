<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Airport extends Model
{
    use HasFactory;

    protected $table = 'airports';
    protected $fillable = ['name', 'code', 'location', 'description', 'link_website'];
}
