<?php

namespace Tests\Unit\JATO;

use DeliverMyRide\JATO\IncentiveImporter;
use Tests\TestCase;

class IncentiveImporterTest extends TestCase
{
    /** @test */
    public function it_ignores_zero_dollar_incentives()
    {
        $importer = app(IncentiveImporter::class);
        $this->assertFalse($importer->validIncentive(['cash' => 0, 'restrictions' => 'Great!']));
    }

    /** @test */
    public function it_ignores_truecar_incentives()
    {
        $importer = app(IncentiveImporter::class);
        $this->assertFalse($importer->validIncentive(['cash' => 1, 'restrictions' => 'Something something Truecar Something']));
        $this->assertFalse($importer->validIncentive(['cash' => 1, 'restrictions' => 'Truecar stuff']));
        $this->assertFalse($importer->validIncentive(['cash' => 1, 'restrictions' => 'Stuff Truecar']));
        $this->assertFalse($importer->validIncentive(['cash' => 1, 'restrictions' => 'Truecar']));
    }

    /** @test */
    public function it_passes_non_matching_incentives()
    {
        $importer = app(IncentiveImporter::class);
        $this->assertTrue($importer->validIncentive(['cash' => 12345, 'restrictions' => 'Great!']));
    }
}
