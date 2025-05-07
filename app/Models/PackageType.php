<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PackageType extends Model
{
    use HasFactory;

    protected $table = 'package_types';
    protected $fillable = ['name', 'description'];

    public function categories()
    {
        return $this->hasMany(PackageCategory::class);
    }
}
