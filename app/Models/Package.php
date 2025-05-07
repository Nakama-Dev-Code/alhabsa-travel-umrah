<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Package extends Model
{
    use HasFactory;

    protected $table = 'packages';
    protected $fillable = ['package_category_id', 'title', 'description', 'image'];

    public function category()
    {
        return $this->belongsTo(PackageCategory::class, 'package_category_id');
    }

    public function schedules()
    {
        return $this->hasMany(PackageSchedule::class);
    }
}
