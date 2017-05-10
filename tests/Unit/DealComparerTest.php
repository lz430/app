<?php

namespace Tests\Unit;

use App\JATO\Version;
use App\VersionDeal;
use DeliverMyRide\DealComparer;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class DealComparerTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * @test
     * @expectedException \InvalidArgumentException
     */
    public function throws_on_invalid_parameter()
    {
        new DealComparer(['non existent']);
    }

    /**
     * @test
     * @expectedException \InvalidArgumentException
     */
    public function throws_on_invalid_parameter_value()
    {
        new DealComparer(['year']);
    }

    /** @test */
    public function does_not_throw_on_valid_parameter_and_value()
    {
        new DealComparer(['year' => 100]);
    }

    /** @test */
    public function does_not_throw_empty_params()
    {
        new DealComparer();
    }

    /** @test */
    public function gets_100_percent_on_matching_year()
    {
        $dealComparer = new DealComparer(['year' => 100]);

        $this->assertEquals(
            100,
            $dealComparer->getPercentMatch(
                factory(Version::class)->make(['year' => 2017]),
                factory(VersionDeal::class)->make(['year' => 2017])
            )
        );
    }
}
