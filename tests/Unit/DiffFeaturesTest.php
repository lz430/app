<?php

namespace Tests\Unit;

use App\Deal;
use App\JatoFeature;
use App\Purchase;
use App\Transformers\DealTransformer;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiffFeaturesTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_diffs_features_and_vautu_features_in_deal_transformer()
    {
        $deal = factory(Deal::class)->create();

        $deal->vauto_features = 'Equipment Group 301A|3.51 Axle Ratio|Wheels: 18" Sparkle Silver-Painted Aluminum|Heated Leather-Trimmed Buckets w/60/40 Rear Seat|Radio: AM/FM Single CD/MP3|Panoramic Vista Roof|Auto High Beams|Bi-Xenon High-Intensity Discharge Headlamps|Heated Steering Wheel|Lane-Keeping System|Enhanced Active Park Assist System|SYNC 3 Communications & Entertainment System|Titanium Technology Package|Rain-Sensing Wipers|4-Wheel Disc Brakes|Air Conditioning|Electronic Stability Control|Front Bucket Seats|Front Center Armrest|Leather Shift Knob|Rear Parking Sensors|Spoiler|Tachometer|ABS brakes|Adjustable head restraints: driver and passenger w/tilt|Automatic temperature control|Brake assist|Bumpers: body-color|CD player|Delay-off headlights|Driver door bin|Driver vanity mirror|Dual front impact airbags|Dual front side impact airbags|Emergency communication system|Four wheel independent suspension|Front anti-roll bar|Front dual zone A/C|Front fog lights|Front reading lights|Fully automatic headlights|Garage door transmitter|Heated door mirrors|Heated front seats|Illuminated entry|Knee airbag|Low tire pressure warning|MP3 decoder|Memory seat|Occupant sensing airbag|Outside temperature display|Overhead airbag|Overhead console|Panic alarm|Passenger door bin|Passenger vanity mirror|Power door mirrors|Power driver seat|Power passenger seat|Power steering|Power windows|Radio data system|Rear anti-roll bar|Rear reading lights|Rear seat center armrest|Rear window defroster|Rear window wiper|Remote keyless entry|Roof rack: rails only|Security system|Speed control|Speed-sensing steering|Split folding rear seat|Steering wheel mounted audio controls|Telescoping steering wheel|Tilt steering wheel|Traction control|Trip computer|Turn signal indicator mirrors|Variably intermittent wipers|Auto-dimming Rear-View mirror|10 Speakers|Blind Spot Sensor|Compass|AM/FM radio: SiriusXM|Exterior Parking Camera Rear';

        $feature = factory(JatoFeature::class)->create([
            'feature' => 'ABS brakes',
            'content' => 'Standard',
            'group' => 'safety',
        ]);

        $deal->jatoFeatures()->save($feature);

        $dealTransformer = new DealTransformer;

        $this->assertEquals(
            /** This is the pipe delimited string without "ABS brakes" */
            array_values(explode('|', 'Equipment Group 301A|3.51 Axle Ratio|Wheels: 18" Sparkle Silver-Painted Aluminum|Heated Leather-Trimmed Buckets w/60/40 Rear Seat|Radio: AM/FM Single CD/MP3|Panoramic Vista Roof|Auto High Beams|Bi-Xenon High-Intensity Discharge Headlamps|Heated Steering Wheel|Lane-Keeping System|Enhanced Active Park Assist System|SYNC 3 Communications & Entertainment System|Titanium Technology Package|Rain-Sensing Wipers|4-Wheel Disc Brakes|Air Conditioning|Electronic Stability Control|Front Bucket Seats|Front Center Armrest|Leather Shift Knob|Rear Parking Sensors|Spoiler|Tachometer|Adjustable head restraints: driver and passenger w/tilt|Automatic temperature control|Brake assist|Bumpers: body-color|CD player|Delay-off headlights|Driver door bin|Driver vanity mirror|Dual front impact airbags|Dual front side impact airbags|Emergency communication system|Four wheel independent suspension|Front anti-roll bar|Front dual zone A/C|Front fog lights|Front reading lights|Fully automatic headlights|Garage door transmitter|Heated door mirrors|Heated front seats|Illuminated entry|Knee airbag|Low tire pressure warning|MP3 decoder|Memory seat|Occupant sensing airbag|Outside temperature display|Overhead airbag|Overhead console|Panic alarm|Passenger door bin|Passenger vanity mirror|Power door mirrors|Power driver seat|Power passenger seat|Power steering|Power windows|Radio data system|Rear anti-roll bar|Rear reading lights|Rear seat center armrest|Rear window defroster|Rear window wiper|Remote keyless entry|Roof rack: rails only|Security system|Speed control|Speed-sensing steering|Split folding rear seat|Steering wheel mounted audio controls|Telescoping steering wheel|Tilt steering wheel|Traction control|Trip computer|Turn signal indicator mirrors|Variably intermittent wipers|Auto-dimming Rear-View mirror|10 Speakers|Blind Spot Sensor|Compass|AM/FM radio: SiriusXM|Exterior Parking Camera Rear')),
            array_values($dealTransformer->transform($deal)['vauto_features'])
        );
    }
}
