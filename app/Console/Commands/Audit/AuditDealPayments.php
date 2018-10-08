<?php

namespace App\Console\Commands\Audit;

use App\Models\Deal;
use App\Services\Quote\DealCalculatePayments;
use Illuminate\Console\Command;

class AuditDealPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:audit:payments {filter?  : option filter. deal:5 or make:Ford}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Audit deal payments';

    private $debug = [
        'lease' => [
            'correct' => 0,
            'invalid' => 0,
        ],
        'finance' => [
            'correct' => 0,
            'invalid' => 0,
        ],
        'cash' => [
            'correct' => 0,
            'invalid' => 0,
        ],
    ];


    /**
     * @param $rates
     * @return mixed|null
     */
    private function selectRate(array $rates)
    {
        $data = [];
        foreach ($rates as $item) {
            $data[$item['termLength']] = $item;
        }

        $term = get_closet_number(array_keys($data), 36);

        if ($term) {
            return $data[$term];
        }

        return false;
    }


    /**
     * @param $residuals
     * @return mixed|null
     */
    private function selectResiduals(array $residuals)
    {
        $data = [];
        foreach ($residuals as $item) {
            $data[$item['annualMileage']] = $item;
        }

        $term = get_closet_number(array_keys($data), 10000);

        if ($term) {
            return $data[$term];
        }

        return false;
    }

    public function collectPaymentData(Deal $deal)
    {
        $data = [
            'lease' => [
                'calculated' => $deal->payments->detroit->lease ? $deal->payments->detroit->lease : [],
                'quote' => [],
            ],
            'finance' => [
                'calculated' => $deal->payments->detroit->finance ? $deal->payments->detroit->finance : [],
                'quote' => [],
            ],
            'cash' => [
                'calculated' => $deal->payments->detroit->cash ? $deal->payments->detroit->cash : [],
                'quote' => [],
            ]
        ];

        foreach ($data as $strategy => $stratData) {
            $dealQuoter = resolve('App\Services\Quote\DealQuote');

            $quote = $dealQuoter->get(
                $deal,
                '48116',
                $strategy,
                ['default']
            );

            $quoteData = [];
            if (isset($quote['rebates']['everyone']['total'])) {
                $quoteData['rebate'] = (float)$quote['rebates']['everyone']['total'];
            }

            if (isset($quote['rates'])) {
                $rate = $this->selectRate($quote['rates']);

                if ($rate) {
                    if (isset($rate['rate'])) {
                        $quoteData['rate'] = (float)$rate['rate'];
                        $quoteData['rate_type'] = 'Rate';
                    } elseif (isset($rate['moneyFactor'])) {
                        $quoteData['rate'] = (float)$rate['moneyFactor'];
                        $quoteData['rate_type'] = 'Factor';
                    }
                    $quoteData['term'] = (int)$rate['termLength'];
                }
                if ($rate && $rate['residuals']) {
                    $residuals = $this->selectResiduals($rate['residuals']);
                    if ($residuals) {
                        $quoteData['residual'] = (int)$residuals['residualPercent'];
                        $quoteData['miles'] = (int)$residuals['annualMileage'];
                    }
                }
            }

            if (isset($quote['payments']) && isset($quoteData['miles']) && isset($quoteData['term'])) {
                foreach ($quote['payments'] as $payment) {
                    if ($payment['term'] === $quoteData['term'] && $payment['annual_mileage'] == $quoteData['miles']) {
                        $quoteData['payment'] = $payment['monthly_payment'];
                        $quoteData['down'] = $payment['total_amount_at_drive_off'];
                    }
                }
            }

            if ($strategy === 'cash') {
                $payments = DealCalculatePayments::cash($deal, 'default', $quoteData['rebate'] ? $quoteData['rebate'] : 0);
                $quoteData['payment'] = $payments->payment;
                $quoteData['down'] = $payments->down;
                $quoteData['rate'] = 0;
                $quoteData['term'] = 0;
            } else if ($strategy === 'finance') {
                $payments = DealCalculatePayments::finance($deal, 'default', 60, 4, $quoteData['rebate'] ? $quoteData['rebate'] : 0);
                $quoteData['payment'] = $payments->payment;
                $quoteData['down'] = $payments->down;
                $quoteData['rate'] = 4;
                $quoteData['term'] = 60;
            }

            $data[$strategy]['quote'] = (object)$quoteData;
        }
        return $data;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $attrs = [
            'down',
            'payment',
            'rate',
            'term',
            'miles',
            'rebate',
            'residual',
            'rate_type',
        ];

        $filter = $this->argument('filter');
        $query = Deal::query()->where('status', '=', 'available');
        if ($filter) {
            $filter = explode(":", $filter);
            if (count($filter) === 2 && in_array($filter[0], ['deal', 'make'])) {
                switch ($filter[0]) {
                    case 'deal':
                        $query = $query->where('id', '=', $filter[1]);
                        break;
                    case 'make':
                        $query = $query->whereHas('version', function ($query) use ($filter) {
                            $query->whereHas('model', function($query) use ($filter) {
                                $query->whereHas('make', function($query) use ($filter) {
                                    $query->where('name', '=', $filter[1]);
                                });
                            });
                        });
                        break;
                }
            }
        }


        $query->chunk(500, function ($deals) use ($attrs) {
            foreach ($deals as $deal) {
                if ($deal->status != 'available') {
                    continue;
                }

                $data = $this->collectPaymentData($deal);
                $results = [
                    'lease' => $data['lease']['calculated'] == $data['lease']['quote'],
                    'finance' => $data['finance']['calculated'] == $data['finance']['quote'],
                    'cash' => $data['cash']['calculated'] == $data['cash']['quote'],
                ];

                foreach ($results as $key => $result) {
                    if ($result) {
                        $this->debug[$key]['correct']++;
                    } else {
                        $this->debug[$key]['invalid']++;
                    }
                }

                $this->info($deal->title());
                $headers = [
                    'Attribute',
                    'Lease / Calculated',
                    'Lease / Quote',
                    '   ',
                    'Finance / Calculated',
                    'Finance / Quote',
                    '   ',
                    'Cash / Calculated',
                    'Cash / Quote',
                ];

                $rows = [];

                foreach ($attrs as $attr) {
                    $row = [
                        $attr,
                        isset($data['lease']['calculated']->{$attr}) ? $data['lease']['calculated']->{$attr} : '--',
                        isset($data['lease']['quote']->{$attr}) ? $data['lease']['quote']->{$attr} : '--',
                        '   ',
                        isset($data['finance']['calculated']->{$attr}) ? $data['finance']['calculated']->{$attr} : '--',
                        isset($data['finance']['quote']->{$attr}) ? $data['finance']['quote']->{$attr} : '--',
                        '   ',
                        isset($data['cash']['calculated']->{$attr}) ? $data['cash']['calculated']->{$attr} : '--',
                        isset($data['cash']['quote']->{$attr}) ? $data['cash']['quote']->{$attr} : '--',
                    ];

                    $rows[] = $row;
                }

                $rows[] = array_fill(0, 9, '   ');

                $rows[] = [
                    '   ',
                    $results['lease'] ? 'Correct' : 'Invalid',
                    '   ',
                    '   ',
                    $results['finance'] ? 'Correct' : 'Invalid',
                    '   ',
                    '   ',
                    $results['cash'] ? 'Correct' : 'Invalid',
                    '   ',
                ];
                $this->table($headers, $rows);
            }
        });

        print_r($this->debug);
    }
}
