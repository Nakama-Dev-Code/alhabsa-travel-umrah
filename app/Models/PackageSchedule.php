<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PackageSchedule extends Model
{
    use HasFactory;

    protected $table = 'package_schedules';
    protected $fillable = ['package_id', 'hotel_madinah_id', 'hotel_makkah_id', 'airport_id', 'airline_id', 'departure_date', 'price', 'seat_available'];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function hotelMadinah()
    {
        return $this->belongsTo(Hotel::class, 'hotel_madinah_id');
    }

    public function hotelMakkah()
    {
        return $this->belongsTo(Hotel::class, 'hotel_makkah_id');
    }

    public function airport()
    {
        return $this->belongsTo(Airport::class);
    }

    public function airline()
    {
        return $this->belongsTo(Airline::class);
    }
}
