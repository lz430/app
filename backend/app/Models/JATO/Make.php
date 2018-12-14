<?php

namespace App\Models\JATO;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\JATO\Make.
 *
 * @property int $id
 * @property string $name
 * @property string $url_name
 * @property int $is_current
 * @property int $manufacturer_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\JATO\Manufacturer $manufacturer
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\VehicleModel[] $models
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\JATO\Version[] $versions
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereIsCurrent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereManufacturerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\JATO\Make whereUrlName($value)
 * @mixin \Eloquent
 */
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

    public const LOGOS = [
        'Acura' => self::BASE_PATH.'acura.jpg',
        'Alfa Romeo' => self::BASE_PATH.'alfa-romeo.png',
        'aston-martin' => self::BASE_PATH.'aston-martin.jpg',
        'Audi' => self::BASE_PATH.'audi.jpg',
        'BMW' => self::BASE_PATH.'bmw.jpg',
        'Buick' => self::BASE_PATH.'buick.jpg',
        'Cadillac' => self::BASE_PATH.'cadillac.jpg',
        'Chevrolet' => self::BASE_PATH.'chevrolet.jpg',
        'Chrysler' => self::BASE_PATH.'chrysler.jpg',
        'Dodge' => self::BASE_PATH.'dodge.jpg',
        'Fiat' => self::BASE_PATH.'fiat.jpg',
        'Ford' => self::BASE_PATH.'ford.jpg',
        'Genesis' => self::BASE_PATH.'genesis.png',
        'GMC' => self::BASE_PATH.'gmc.jpg',
        'Honda' => self::BASE_PATH.'honda.jpg',
        'Hyundai' => self::BASE_PATH.'hyundai.jpg',
        'Infiniti' => self::BASE_PATH.'infiniti.jpg',
        'INFINITI' => self::BASE_PATH.'infiniti.jpg',
        'Jaguar' => self::BASE_PATH.'jaguar.jpg',
        'Jeep' => self::BASE_PATH.'jeep.jpg',
        'Kia' => self::BASE_PATH.'kia.jpg',
        'Land Rover' => self::BASE_PATH.'land-rover.png',
        'Lexus' => self::BASE_PATH.'lexus.jpg',
        'Lincoln' => self::BASE_PATH.'lincoln.jpg',
        'Mazda' => self::BASE_PATH.'mazda.jpg',
        'Maserati' => self::BASE_PATH.'maserati.jpg',
        'Mercedes-Benz' => self::BASE_PATH.'mercedes-benz.jpg',
        'Mini' => self::BASE_PATH.'mini.jpg',
        'Mitsubishi' => self::BASE_PATH.'mitsubishi.jpg',
        'Nissan' => self::BASE_PATH.'nissan.jpg',
        'Porsche' => self::BASE_PATH.'porsche.jpg',
        'Ram' => self::BASE_PATH.'ram.png',
        'Scion' => self::BASE_PATH.'scion.jpg',
        'Subaru' => self::BASE_PATH.'subaru.jpg',
        'Toyota' => self::BASE_PATH.'toyota.jpg',
        'Volkswagen' => self::BASE_PATH.'volkswagon.jpg',
        'Volvo' => self::BASE_PATH.'volvo.jpg',
    ];

    private const BASE_PATH = '/static/images/makes/';

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
