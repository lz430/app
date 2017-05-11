<?php

namespace Tests\Unit;

use App\JATO\Version;
use DeliverMyRide\JATO\Client;
use DeliverMyRide\Vauto\Importer;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Testing\Concerns\InteractsWithDatabase;
use Illuminate\Support\Facades\App;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Mockery;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Tests\TestCase;

class LoadDealsFromVautoTest extends TestCase
{
    use DatabaseMigrations;
    use InteractsWithDatabase;

    /** @test */
    public function loads_data_properly()
    {
        $stubCSV = <<<file
"DealerId","Stock #","VIN","New/Used","Year","Make","Model","Model Code","Body","Transmission","Series","Series Detail","Door Count","Odometer","Engine Cylinder Ct","Engine Displacement","Drivetrain Desc","Colour","Interior Color","Price","MSRP","Inventory Date","Certified","Description","Features","City MPG","Highway MPG","Photo Count","Photos","Photos Last Modified Date","Dealer Name","Engine","Fuel","Age"
"MP4164","AH2839","ZACCJBBB2HPF21828","N","2017","Jeep","Renegade","BUJM74","4D Sport Utility","9-Speed 948TE Automatic","Latitude","","4","","4","2.40","4WD","Glacier Metallic","Black","22555","27565","04/26/2017","","$5,010 off MSRP! Factory MSRP: $27,565 29/21 Highway/City MPG Priced below KBB Fair Purchase Price! 2017 Jeep Renegade LatitudeReviews:  * Lots of character with a classic Jeep look; agile handling when going around turns; plenty of easy-to-use technology features; best-in-class off-road capability with Trailhawk model. Source: Edmunds Must qualify for Chrysler employee discount. All rebates back to dealer. Plus tax,title,license fees. Price includes: $2,500 - 2017 GL Retail Consumer Cash 42CH1. Exp. 05/31/2017, $500 - Great Lakes 2017 Bonus Cash GLCHA. Exp. 05/31/2017  ","Quick Order Package 27J|4.438 Axle Ratio|3.734 Axle Ratio|18"" x 7.0"" Aluminum Wheels|Cloth Low-Back Bucket Seats|Normal Duty Suspension|Radio: Uconnect 3 w/5"" Display|Cold Weather Group|Manufacturer's Statement of Origin|Passive Entry Remote Start Package|All-Season Floor Mats|Passive Entry/Keyless Go|Heated Front Seats|Windshield Wiper De-Icer|Heated Steering Wheel|PTC Auxiliary Interior Heater|AM/FM radio: SiriusXM|4-Wheel Disc Brakes|6 Speakers|Air Conditioning|Electronic Stability Control|Front Bucket Seats|Front Center Armrest|Spoiler|Tachometer|Voltmeter|ABS brakes|Alloy wheels|Anti-whiplash front head restraints|Brake assist|Delay-off headlights|Driver door bin|Driver vanity mirror|Dual front impact airbags|Dual front side impact airbags|Four wheel independent suspension|Front anti-roll bar|Front fog lights|Front reading lights|Fully automatic headlights|Heated door mirrors|Illuminated entry|Knee airbag|Leather steering wheel|Low tire pressure warning|Occupant sensing airbag|Outside temperature display|Overhead airbag|Overhead console|Panic alarm|Passenger door bin|Passenger vanity mirror|Power door mirrors|Power steering|Power windows|Radio data system|Rear anti-roll bar|Rear window defroster|Rear window wiper|Remote keyless entry|Roof rack: rails only|Speed control|Split folding rear seat|Steering wheel mounted audio controls|Telescoping steering wheel|Tilt steering wheel|Traction control|Trip computer|Variably intermittent wipers|Front beverage holders|Compass","21","29","23","http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-1.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-2.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-3.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-4.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-5.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-6.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-7.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-8.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-9.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-10.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-11.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-12.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-13.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-14.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-15.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-16.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-17.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-18.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-19.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-20.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-21.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-22.jpg|http://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-23.jpg","4/27/2017 7:19:50 AM","Suburban Chrysler Jeep Dodge of Troy","2.4L I4 MultiAir","Gasoline","12"
file;

        $filePath = tempnam(sys_get_temp_dir(), 'test');

        file_put_contents($filePath, $stubCSV);

        $filesystem = Mockery::mock(Filesystem::class, [
            'files' => [
                $filePath,
            ]
        ]);

        $client = Mockery::mock(
            Client::class,
            json_decode(file_get_contents(__DIR__ . '/stubs/decodedVin.json'), true)
        );

        /** Create versions to match against */
        factory(Version::class)->create([
            'id' => 1,
            'jato_uid' => 7697241,
            'year' => 2015,
        ]);

        factory(Version::class)->create([
            'id' => 2,
            'jato_uid' => 7697241,
            'year' => 2016,
        ]);

        factory(Version::class)->create([
            'id' => 3,
            'jato_uid' => 7697241,
            'year' => 2017,
        ]);

        App::instance(Importer::class, new Importer($filesystem, $client));

        $this->app->make(Kernel::class)->handle(
            new ArrayInput(['command' => 'vauto:load']),
            new BufferedOutput()
        );

        /** Loads Deals */
        $this->assertDatabaseHas('version_deals', [
            'version_id' => 1,
            'vin' => 'ZACCJBBB2HPF21828',
        ]);

        $this->assertDatabaseHas('version_deals', [
            'version_id' => 2,
            'vin' => 'ZACCJBBB2HPF21828',
        ]);

        $this->assertDatabaseHas('version_deals', [
            'version_id' => 3,
            'vin' => 'ZACCJBBB2HPF21828',
        ]);

        /** Loads Photos (as https) */
        $this->assertDatabaseHas('version_deal_photos', [
            'url' => 'https://vehiclephotos.vauto.com/53/fe/66/83-3b4f-4da9-9f01-1734905d230b/image-1.jpg',
        ]);

        /** Loads Options */
        $this->assertDatabaseHas('version_deal_options', [
            'option' => '18" x 7.0" Aluminum Wheels',
        ]);
    }
}
