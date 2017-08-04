<?php

namespace Tests\Unit;

use App\Deal;
use App\Purchase;
use Carbon\Carbon;
use Tests\TestCase;

class DealsFilterTest extends TestCase
{
    /** @test */
    public function it_filters_deals_that_are_currently_being_held()
    {
        $deal = factory(Deal::class)->create();
        
        factory(Purchase::class)->create([
        'type' => 'cash',
        'deal_id' => $deal->id,
        'dmr_price' => 30000,
        'msrp' => 28000,
        'completed_at' => Carbon::now(),
    ]);
        
        $this->assertEquals(0, Deal::forSale()->count());
    
        factory(Deal::class, 3)->create();
    
        $this->assertEquals(3, Deal::forSale()->count());
    }
}
