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
        $this->assertFalse($importer->validIncentive(['value' => 0, 'rebate' => 'Great!']));
    }

    /** @test */
    public function it_ignores_truecar_incentives()
    {
        $importer = app(IncentiveImporter::class);
        $this->assertFalse($importer->validIncentive(['value' => 1, 'rebate' => 'Something something Truecar Something']));
        $this->assertFalse($importer->validIncentive(['value' => 1, 'rebate' => 'Truecar stuff']));
        $this->assertFalse($importer->validIncentive(['value' => 1, 'rebate' => 'Stuff Truecar']));
        $this->assertFalse($importer->validIncentive(['value' => 1, 'rebate' => 'Truecar']));
    }

    /** @test */
    public function it_passes_non_matching_incentives()
    {
        $importer = app(IncentiveImporter::class);
        $this->assertTrue($importer->validIncentive(['value' => 12345, 'rebate' => 'Great!']));
    }
}
