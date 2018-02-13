<?php

namespace Tests\Feature;

use App\User;
use App\Deal;
use App\Purchase;
use Tests\TestCase;
use App\JATO\Version;
use Illuminate\Mail\Mailable;
use DeliverMyRide\VAuto\Importer;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationSubmittedDMR;
use Illuminate\Support\Facades\Config;
use App\Mail\ApplicationSubmittedUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;


class ImporterTest extends TestCase
{
    use WithoutMiddleware;
    use RefreshDatabase;

    /** @test */
    public function it_correctly_handles_reused_and_changed_UIDs()
    {
        // This test takes 22seconds so I'm not going to have it run every time until I'm able to extract out JATO.
        $this->markTestSkipped();
        
        Config::set('services.vauto.uploads_path', 'tests/Data');
        
        $importer = app(Importer::class);
        $importer->import();

        Version::first()->update(['jato_vehicle_id' => 123123]);

        $importer = app(Importer::class);
        $importer->import();

        $this->assertCount(2, Deal::all());
        $this->assertNotEquals(Version::first()->jato_vehicle_id, 123123);
    }
}
