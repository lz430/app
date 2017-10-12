<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Make extends Model
{
    public const DOMESTIC = [
        'chrysler',
        'dodge',
        'jeep',
        'ram',
        'ford',
        'lincoln',
        'chevrolet',
        'cadillac',
        'buick',
        'gmc',
    ];

    public const MAKE_WHITELIST = [
        'acura',
        'alfa romeo',
        'aston martin',
        'audi',
        'bmw',
        'buick',
        'cadillac',
        'chevrolet',
        'chrysler',
        'dodge',
        'fiat',
        'ford',
        'genesis',
        'gmc',
        'honda',
        'hyundai',
        'infiniti',
        'jaguar',
        'jeep',
        'kia',
        'land rover',
        'lexus',
        'lincoln',
        'mercedes-benz',
        'mini',
        'mitsubishi',
        'nissan',
        'porsche',
        'ram',
        'subaru',
        'toyota',
        'volkswagon',
        'volvo',
    ];

    public const LOGOS = [
        'acura' => self::BASE_PATH . 'acura.jpg',
        'alfa-romeo' => self::BASE_PATH . 'alfa-romeo.png',
        'aston-martin' => self::BASE_PATH . 'aston-martin.jpg',
        'audi' => self::BASE_PATH . 'audi.jpg',
        'bmw' => self::BASE_PATH . 'bmw.jpg',
        'buick' => self::BASE_PATH . 'buick.jpg',
        'cadillac' => self::BASE_PATH . 'cadillac.jpg',
        'chevrolet' => self::BASE_PATH . 'chevrolet.jpg',
        'chrysler' => self::BASE_PATH . 'chrysler.jpg',
        'dodge' => self::BASE_PATH . 'dodge.jpg',
        'fiat' => self::BASE_PATH . 'fiat.jpg',
        'ford' => self::BASE_PATH . 'ford.jpg',
        'genesis' => self::BASE_PATH . 'genesis.png',
        'gmc' => self::BASE_PATH . 'gmc.jpg',
        'honda' => self::BASE_PATH . 'honda.jpg',
        'hyundai' => self::BASE_PATH . 'hyundai.jpg',
        'infiniti' => self::BASE_PATH . 'infiniti.jpg',
        'jaguar' => self::BASE_PATH . 'jaguar.jpg',
        'jeep' => self::BASE_PATH . 'jeep.jpg',
        'kia' => self::BASE_PATH . 'kia.jpg',
        'land-rover' => self::BASE_PATH . 'land-rover.png',
        'lexus' => self::BASE_PATH . 'lexus.jpg',
        'lincoln' => self::BASE_PATH . 'lincoln.jpg',
        'maserati' => self::BASE_PATH . 'mitsubishi.jpg',
        'mercedes-benz' => self::BASE_PATH . 'mercedes-benz.jpg',
        'mini' => self::BASE_PATH . 'mini.jpg',
        'mitsubishi' => self::BASE_PATH . 'maserati.jpg',
        'nissan' => self::BASE_PATH . 'nissan.jpg',
        'porsche' => self::BASE_PATH . 'porsche.jpg',
        'ram' => self::BASE_PATH . 'ram.png',
        'scion' => self::BASE_PATH . 'scion.jpg',
        'subaru' => self::BASE_PATH . 'subaru.jpg',
        'toyota' => self::BASE_PATH . 'toyota.jpg',
        'volkswagon' => self::BASE_PATH . 'volkswagon.jpg',
        'volvo' => self::BASE_PATH . 'volvo.jpg',
    ];

    private const BASE_PATH = '/images/makes/';

    protected $fillable = [
        'name',
        'url_name',
        'is_current',
    ];

    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function models()
    {
        return $this->hasMany(VehicleModel::class, 'make_id');
    }

    public function versions()
    {
        return $this->hasManyThrough(Version::class, VehicleModel::class, 'make_id', 'model_id', 'id');
    }

    public function scopeWhitelisted()
    {
        return self::whereIn(
            DB::raw('lower(name)'),
            array_map('strtolower', self::MAKE_WHITELIST)
        );
    }
}
