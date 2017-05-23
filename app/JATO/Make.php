<?php

namespace App\JATO;

use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    public const LOGOS = [
        'acura' => self::BASE_PATH . 'acura.jpg',
        'audi' => self::BASE_PATH . 'audi.jpg',
        'bmw' => self::BASE_PATH . 'bmw.jpg',
        'buick' => self::BASE_PATH . 'buick.jpg',
        'cadillac' => self::BASE_PATH . 'cadillac.jpg',
        'chevrolet' => self::BASE_PATH . 'chevrolet.jpg',
        'chrysler' => self::BASE_PATH . 'chrysler.jpg',
        'dodge' => self::BASE_PATH . 'dodge.jpg',
        'ford' => self::BASE_PATH . 'ford.jpg',
        'honda' => self::BASE_PATH . 'honda.jpg',
        'hyundai' => self::BASE_PATH . 'hyundai.jpg',
        'infiniti' => self::BASE_PATH . 'infiniti.jpg',
        'jaguar' => self::BASE_PATH . 'jaguar.jpg',
        'jeep' => self::BASE_PATH . 'jeep.jpg',
        'kia' => self::BASE_PATH . 'kia.jpg',
        'lexus' => self::BASE_PATH . 'lexus.jpg',
        'lincoln' => self::BASE_PATH . 'lincoln.jpg',
        'maserati' => self::BASE_PATH . 'maserati.jpg',
        'mercedes-benz' => self::BASE_PATH . 'mercedes-benz.jpg',
        'mitsubishi' => self::BASE_PATH . 'maserati.jpg',
        'nissan' => self::BASE_PATH . 'nissan.jpg',
        'porsche' => self::BASE_PATH . 'porsche.jpg',
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
}
