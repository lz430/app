<?php

namespace Tests\Unit;

use App\Deal;
use App\Transformers\DealTransformer;
use Tests\TestCase;

class EmployeeVsSupplierPricesTest extends TestCase
{
    /** @test */
    public function it_correctly_sets_employee_and_supplier_price_for_domestic()
    {
        $deal = factory(Deal::class)->make([
            'make' => 'dodge',
            'price' => 10000,
        ]);

        $dealTransformer = new DealTransformer;

        $transformedDeal = $dealTransformer->transform($deal);

        $this->assertEquals(
            10000,
            $transformedDeal['employee_price']
        );

        $this->assertEquals(
            10400,
            $transformedDeal['supplier_price']
        );
    }

    /** @test */
    public function it_correctly_sets_employee_and_supplier_price_for_international()
    {
        $deal = factory(Deal::class)->make([
            'make' => 'non-domestic',
            'price' => 10000,
        ]);

        $dealTransformer = new DealTransformer;

        $transformedDeal = $dealTransformer->transform($deal);

        $this->assertEquals(
            10000,
            $transformedDeal['employee_price']
        );

        $this->assertEquals(
            10000,
            $transformedDeal['supplier_price']
        );
    }
}
