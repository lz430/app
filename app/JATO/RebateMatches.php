<?php

namespace App\JATO;

class RebateMatches
{
    // All these match fully if the category (first level) and type (second level) match
    protected $cash = [
        'Retail Cash Programs' => [ // ID 1
            'Aged Inventory Bonus Cash',
            'Bonus Cash',
            'Cash Back',
            'Cash on term APR',
            'Cash on term Lease',
            'Cash on MSRP',
            'Cash to Lessee',
            'Down Payment Allowance',
            'Inventory Bonus Cash',
        ],
        'Other Retail Programs' => [ // ID 2
            'Cash Certificate Coupon',
            'Direct/Private offers',
            'Package Option Discount',
            'Payment/Fee Waiver',
            'Trade in Allowance'
        ],
        'Retail Financing' => [ // ID 7
            'Enhanced Rate w/ Cash or Fee Waiver',
            'Other Financing',
        ],
        'Retail Lease' => [ // ID 8
            'Enhanced Rate & Residual w/ Cash or Fee Waiver',
            'Enhanced Rate/Money Factor w/Cash or Fee Waiver',
        ]
    ];

    protected $finance = [
        'Retail Cash Programs' => [ // ID 1
            'Aged Inventory Bonus Cash',
            'Bonus Cash',
            'Cash Back',
            'Cash on term APR',
            'Cash on MSRP',
            'Down Payment Allowance',
            'Inventory Bonus Cash',
        ],
        'Other Retail Programs' => [ // ID 2
            'Cash Certificate Coupon',
            'Direct/Private offers',
            'Package Option Discount',
            'Payment/Fee Waiver',
            'Trade in Allowance'
        ],
        'Retail Financing' => [ // ID 7
            'Balloon Finance',
            'Enhanced Rate w/ Cash or Fee Waiver',
            'Enhanced Rate/APR',
            'Other Financing',
        ]
    ];

    protected $lease = [
        'Retail Cash Programs' => [ // ID 1
            'Aged Inventory Bonus Cash',
            'Bonus Cash',
            'Cash on term Lease',
            'Cash to Lessee',
            'Down Payment Allowance',
            'Inventory Bonus Cash',
        ],
        'Other Retail Programs' => [ // ID 2
            'Cash Certificate Coupon',
            'Direct/Private offers',
            'Package Option Discount',
            'Payment/Fee Waiver',
            'Trade in Allowance',
        ],
        'Retail Lease' => [ // ID 8
            'Enhanced Rate & Residual w/ Cash or Fee Waiver',
            'Enhanced Rate & Residual',
            'Enhanced Rate/Money Factor',
            'Enhanced Rate/Money Factor w/Cash or Fee Waiver',
        ]
    ];

    public function cash($incentive)
    {
        return $this->matches($incentive, $this->cash);
    }

    public function finance($incentive)
    {
        return $this->matches($incentive, $this->finance);
    }

    public function lease($incentive)
    {
        return $this->matches($incentive, $this->lease);
    }

    private function matches($incentive, $categories)
    {
        if ($this->autoShowCashRecipient($incentive)) {
            return true;
        }

        foreach ($categories as $category => $types) {
            if ($incentive['categoryName'] == $category) {
                if (in_array($incentive['typeName'] , $types)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected function autoShowCashRecipient($incentive)
    {
        return $incentive['categoryName'] == 'Retail Cash Programs' &&
            $incentive['typeName'] == 'Auto Show Cash' &&
            $incentive['targetName'] == 'Auto Show Cash Recipient';
    }
}
