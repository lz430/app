<?php

namespace App\Services\Quote\Factories;

class FakeQuote
{
    private $data = [
        'meta' => [
            'paymentType' => 'lease',
            'zipcode' => '48116',
            'area' => 'detroit',
            'dealId' => 34897,
            'primaryRole' => 'default',
            'conditionalRoles' => [],
            'key' => '34897-lease-detroit--d',
            'error' => false,
            'down' => '1500',
            'tradeValue' => '0',
            'tradeOwed' => '0',
        ],
        'rebates' => [
            'everyone' => [
                'total' => 500,
                'programs' => [
                    '453356' => [
                        'value' => 500,
                        'scenario' => [
                            'CashDestination' => 'Add to Cash',
                            'DealScenarioType' => 'Manufacturer - Lease Special',
                            'Cash' => '500.00',
                            'ManufacturerTierName' => 'Tier 1',
                            'TierNo' => '0',
                        ],
                        'program' => [
                            'Facing' => 'Consumer',
                            'FacingID' => '2',
                            'FinancialInstitution' => 'Open',
                            'FinancialInstitutionID' => '11',
                            'OriginalProgramID' => '442761',
                            'Preselected' => 'no',
                            'ProgramContent' => 'Sales Event Cash available  toward the purchase or lease of select Hyundai vehicles.  Sales Event Cash is good on all Retail transactions (HMF APR/LEASE, HMF Standard Rate, or Bank/Cash Deals) and can be combined with all available Retail incentive offers (RBC/VOC/COC/Etc.). See Program Rules for complete details.',
                            'ProgramDescription' => 'Sales Event Cash',
                            'ProgramID' => '453356',
                            'ProgramIdent' => '2018171',
                            'ProgramName' => 'Sales Event Cash',
                            'ProgramNumber' => '2018171',
                            'ProgramStartDate' => '2018-12-04',
                            'ProgramStopDate' => '2019-01-02',
                            'ProgramType' => 'Cash',
                            'RequiresManCredit' => '0',
                            'TotalCashFlag' => 'yes',
                            'UserDefinedCash' => '0',
                            'VehicleStartDate' => '2018-12-04',
                            'VehicleStopDate' => '2019-01-02',
                        ],
                    ],
                ],
            ],
            'lease' => [
                'total' => 4900,
                'programs' => [
                    '453186' => [
                        'value' => 4900,
                        'scenario' => [
                            'DealScenarioType' => 'Manufacturer - Lease Special',
                            'terms' => [
                                [
                                    'QualifyingTermEnd' => '36',
                                    'QualifyingTermStart' => '36',
                                    'CCR' => '4900.00',
                                    'Factor' => '0.00226',
                                    'FirstPaymentWaived' => 'FALSE',
                                    'ManufacturerTierName' => 'Tier 1',
                                    'MaxCarryArgument' => 'Undefined',
                                    'MaxCarryArgumentID' => '1',
                                    'MaxCarryPercentage' => '110',
                                    'NoSecurityDeposit' => 'FALSE',
                                    'ResidualBump' => '0',
                                    'TierNo' => '0',
                                ],
                                [
                                    'QualifyingTermEnd' => '48',
                                    'QualifyingTermStart' => '37',
                                    'CCR' => '4400.00',
                                    'Factor' => '0.00234',
                                    'FirstPaymentWaived' => 'FALSE',
                                    'ManufacturerTierName' => 'Tier 1',
                                    'MaxCarryArgument' => 'Undefined',
                                    'MaxCarryArgumentID' => '1',
                                    'MaxCarryPercentage' => '110',
                                    'NoSecurityDeposit' => 'FALSE',
                                    'ResidualBump' => '0',
                                    'TierNo' => '0',
                                ],
                            ],
                        ],
                        'program' => [
                            'AcquisitionFeeAdj' => '650',
                            'AcquisitionFeeType' => 'Not Used',
                            'Facing' => 'Consumer',
                            'FacingID' => '2',
                            'FinancialInstitution' => 'Hyundai Motor Finance',
                            'FinancialInstitutionID' => '16',
                            'OriginalProgramID' => '143103',
                            'Preselected' => 'no',
                            'ProgramContent' => 'Special Lease Rates for qualified buyers based on credit tier.  Select dealers only.  All HMF leases are eligible for 0.00040 Rate Participation or $150 flat.  Excluding dealers=> Chicago, Minneapolis, Cleveland, Columbus, Boston, New York, Philly, Pittsburgh, Dallas, Providence, Hartford, Miami, Orlando, W Palm Beach, Ft Myers, LA, Las Vegas, and San Francisco ADIs.',
                            'ProgramDescription' => '2018 Tucson Special Lease - National Excluding Select Dealers',
                            'ProgramID' => '453186',
                            'ProgramIdent' => 'H202',
                            'ProgramName' => '2018 Tucson Special Lease - National Excluding Select Dealers',
                            'ProgramNumber' => 'H202',
                            'ProgramStartDate' => '2018-12-04',
                            'ProgramStopDate' => '2019-01-02',
                            'ProgramType' => 'Lease',
                            'RequiresManCredit' => '0',
                            'TotalCashFlag' => 'no',
                            'VehicleStartDate' => '2018-12-04',
                            'VehicleStopDate' => '2019-01-02',
                        ],
                    ],
                ],
            ],
            'total' => 5400,
        ],
        'rates' => [
            [
                'rate' => null,
                'residualPercent' => '53',
                'termLength' => '36',
                'residuals' => [
                    [
                        'annualMileage' => 10000,
                        'residualPercent' => '53',
                    ],
                    [
                        'annualMileage' => 12000,
                        'residualPercent' => '52',
                    ],
                    [
                        'annualMileage' => 15000,
                        'residualPercent' => '50',
                    ],
                ],
                'moneyFactor' => '0.00226',
            ],
            [
                'rate' => null,
                'residualPercent' => '44',
                'termLength' => '48',
                'residuals' => [
                    [
                        'annualMileage' => 10000,
                        'residualPercent' => '44',
                    ],
                    [
                        'annualMileage' => 12000,
                        'residualPercent' => '43',
                    ],
                    [
                        'annualMileage' => 15000,
                        'residualPercent' => '41',
                    ],
                ],
                'moneyFactor' => '0.00234',
            ],
        ],
        'selections' => [
            'conditionalRoles' => [
                '453216' => [
                    'id' => '453216',
                    'role' => 'military',
                    'title' => 'Active Military/Veteran',
                    'description' => 'Active Duty, Reservist/National Guard, Retired, or a Veteran of the U.<br />.<br />Military Military Personnel - OR THEIR SPOUSE- may receive cash towards purchase or lease of select 2017-2018 Hyundai vehicles.<br />   OK with other offers.<br />   One coupon per vehicle.<br />  N/A Fleet vehicles',
                    'startDate' => '2018-01-04',
                    'stopDate' => '2019-01-02',
                    'value' => 500,
                    'isApplied' => false,
                    'isSelected' => false,
                    'help' => 'Thank you for your service.',
                ],
                '453544' => [
                    'id' => '453544',
                    'role' => 'college',
                    'title' => 'College Student/Recent Grad',
                    'description' => 'Customers graduating in the next six months, or you graduated within the past two years, may receive $400 rebate towards purchase.<br />MUST FINANCE WITH HMF  Customer must be a graduate of a four-year university, accredited two-year college, or a nursing school.<br />Must have graduated from a U.<br />.<br />university within the past two years or be on track to graduate within the next six months.<br />The offer includes graduates and graduate candidates attending accredited masters or doctorate programs.<br />  OK with other Rebates   Visit your participating Hyundai dealer for all the details.',
                    'startDate' => '2018-11-01',
                    'stopDate' => '2019-01-02',
                    'value' => 400,
                    'isApplied' => false,
                    'isSelected' => false,
                    'help' => null,
                ],
            ],
        ],
        'payments' => [
            '36' => [
                '10000' => [
                    'monthlyUseTax' => 6.88,
                    'monthlyPreTaxPayment' => 114.74,
                    'monthlyPayment' => 121.62,
                    'cashDownCCR' => 1500,
                    'totalAmountAtDriveOff' => 783.66,
                ],
                '12000' => [
                    'monthlyUseTax' => 7.29,
                    'monthlyPreTaxPayment' => 121.48,
                    'monthlyPayment' => 128.77,
                    'cashDownCCR' => 1500,
                    'totalAmountAtDriveOff' => 790.81,
                ],
                '15000' => [
                    'monthlyUseTax' => 8.1,
                    'monthlyPreTaxPayment' => 134.95,
                    'monthlyPayment' => 143.05,
                    'cashDownCCR' => 1500,
                    'totalAmountAtDriveOff' => 805.09,
                ],
            ],
            '48' => [
                '10000' => [
                    'monthlyUseTax' => 8.95,
                    'monthlyPreTaxPayment' => 149.14,
                    'monthlyPayment' => 158.09,
                    'cashDownCCR' => 1500,
                    'totalAmountAtDriveOff' => 820.13,
                ],
                '12000' => [
                    'monthlyUseTax' => 9.24,
                    'monthlyPreTaxPayment' => 154.02,
                    'monthlyPayment' => 163.26,
                    'cashDownCCR' => 1500,
                    'totalAmountAtDriveOff' => 825.3,
                ],
                '15000' => [
                    'monthlyUseTax' => 9.83,
                    'monthlyPreTaxPayment' => 163.79,
                    'monthlyPayment' => 173.62,
                    'cashDownCCR' => 1500,
                    'totalAmountAtDriveOff' => 835.66,
                ],
            ],
        ],
    ];

    public function get()
    {
        return  (object) $this->data;
    }
}
