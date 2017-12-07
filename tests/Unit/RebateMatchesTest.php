<?php

namespace Tests\Unit;

use App\JATO\RebateMatches;
use Tests\TestCase;

class RebateMatchesTest extends TestCase
{
    /** @test */
    public function non_existent_category_doesnt_error()
    {
        $incentive = ['categoryName' => 'Alphabet', 'typeName' => 'Soup'];

        $rebateMatches = new RebateMatches;

        $this->assertFalse($rebateMatches->cash($incentive));
    }

    /** @test */
    public function auto_show_always_matches()
    {
        $autoShow = ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Auto Show Cash', 'targetName' => 'Auto Show Cash Recipient'];

        $rebateMatches = new RebateMatches;

        $this->assertTrue($rebateMatches->cash($autoShow));
        $this->assertTrue($rebateMatches->finance($autoShow));
        $this->assertTrue($rebateMatches->lease($autoShow));
    }

    /** @test */
    public function non_auto_show_target_doesnt_matter()
    {
        $examples = [
            ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Cash on term Lease', 'targetName' => 'abc'],
            ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Cash on term Lease', 'targetName' => '12345'],
            ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Cash on term Lease', 'targetName' => null],
        ];

        $rebateMatches = new RebateMatches;

        foreach ($examples as $incentive) {
            $this->assertTrue($rebateMatches->cash($incentive));
        }
    }

    /** @test */
    public function types_dont_match_for_wrong_category()
    {
        $examples = [
            ['categoryName' => 'Retail Lease', 'typeName' => 'Cash on term Lease'],
            ['categoryName' => 'Retail Financing', 'typeName' => 'Payment/Fee Waiver'],
        ];

        $rebateMatches = new RebateMatches;

        foreach ($examples as $incentive) {
            $this->assertFalse($rebateMatches->cash($incentive));
        }
    }

    /** @test */
    public function sample_cash_incentives_match()
    {
        $examples = [
            ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Cash on term Lease'],
            ['categoryName' => 'Other Retail Programs', 'typeName' => 'Payment/Fee Waiver'],
            ['categoryName' => 'Retail Financing', 'typeName' => 'Enhanced Rate w/ Cash or Fee Waiver'],
            ['categoryName' => 'Retail Lease', 'typeName' => 'Enhanced Rate/Money Factor w/Cash or Fee Waiver'],
        ];

        $rebateMatches = new RebateMatches;

        foreach ($examples as $incentive) {
            $this->assertTrue($rebateMatches->cash($incentive));
        }
    }

    /** @test */
    public function sample_finance_incentives_match()
    {
        $examples = [
            ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Aged Inventory Bonus Cash'],
            ['categoryName' => 'Other Retail Programs', 'typeName' => 'Package Option Discount'],
            ['categoryName' => 'Retail Financing', 'typeName' => 'Enhanced Rate/APR'],
        ];

        $rebateMatches = new RebateMatches;

        foreach ($examples as $incentive) {
            $this->assertTrue($rebateMatches->finance($incentive));
        }
    }

    /** @test */
    public function sample_lease_incentives_match()
    {
        $examples = [
            ['categoryName' => 'Retail Cash Programs', 'typeName' => 'Down Payment Allowance'],
            ['categoryName' => 'Other Retail Programs', 'typeName' => 'Trade in Allowance'],
            ['categoryName' => 'Retail Lease', 'typeName' => 'Enhanced Rate/Money Factor w/Cash or Fee Waiver'],
        ];

        $rebateMatches = new RebateMatches;

        foreach ($examples as $incentive) {
            $this->assertTrue($rebateMatches->lease($incentive));
        }
    }
}
