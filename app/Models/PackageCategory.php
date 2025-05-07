<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PackageCategory extends Model
{
    use HasFactory;

    protected $table = 'package_categories';
    protected $fillable = ['package_type_id', 'name', 'slug', 'description'];

    public function type()
    {
        return $this->belongsTo(PackageType::class, 'package_type_id');
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }
}
