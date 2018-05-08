<?php

namespace DeliverMyRide\Carleton;

class QuoteParameters
{
    private $taxRate;
    private $acquisitionFee;
    private $docFee;
    private $cashDown;
    private $rebate;
    private $licenseFee;
    private $cvrFee;
    private $moneyFactor;
    private $cashAdvance;
    private $residualPercentage;
    private $msrp;
    private $term;
    private $contractDate;
    private $annualMileage;

    private function __construct(\DateTime $contractDate)
    {
        $this->contractDate = $contractDate;
    }

    public static function create(\DateTime $contractDate = null)
    {
        return new static($contractDate ?? new \DateTime());
    }

    public function withTaxRate($taxRate)
    {
        $instance = clone($this);
        $instance->taxRate = $taxRate;

        return $instance;
    }

    public function withAcquisitionFee($acquisitionFee)
    {
        $instance = clone($this);
        $instance->acquisitionFee = $acquisitionFee;

        return $instance;
    }

    public function withDocFee($docFee)
    {
        $instance = clone($this);
        $instance->docFee = $docFee;

        return $instance;
    }

    public function withCashDown($cashDown)
    {
        $instance = clone($this);
        $instance->cashDown = $cashDown;

        return $instance;
    }

    public function withRebate($rebate)
    {
        $instance = clone($this);
        $instance->rebate = $rebate;

        return $instance;
    }

    public function withLicenseFee($licenseFee)
    {
        $instance = clone($this);
        $instance->licenseFee = $licenseFee;

        return $instance;
    }

    public function withCvrFee($cvrFee)
    {
        $instance = clone($this);
        $instance->cvrFee = $cvrFee;

        return $instance;
    }

    public function withMoneyFactor($moneyFactor)
    {
        $instance = clone($this);
        $instance->moneyFactor = $moneyFactor;

        return $instance;
    }

    public function withCashAdvance($cashAdvance)
    {
        $instance = clone($this);
        $instance->cashAdvance = $cashAdvance;

        return $instance;
    }

    public function withResidualPercentage($residualPercentage)
    {
        $instance = clone($this);
        $instance->residualPercentage = $residualPercentage;

        return $instance;
    }

    public function withMsrp($msrp)
    {
        $instance = clone($this);
        $instance->msrp = $msrp;

        return $instance;
    }

    public function withTerm($term)
    {
        $instance = clone($this);
        $instance->term = $term;

        return $instance;
    }

    public function withAnnualMileage($annualMileage)
    {
        $instance = clone($this);
        $instance->annualMileage = $annualMileage;

        return $instance;
    }
    
    public function toArray()
    {
        return [
            'tax_rate' => $this->taxRate,
            'acquisition_fee' => $this->acquisitionFee,
            'doc_fee' => $this->docFee,
            'cash_down' => 0 - $this->cashDown,
            'rebate' => 0 - $this->rebate,
            'license_fee' => $this->licenseFee,
            'cvr_fee' => $this->cvrFee,
            'money_factor' => $this->moneyFactor,
            'cash_advance' => $this->cashAdvance,
            'residual_percentage' => $this->residualPercentage,
            'msrp' => $this->msrp,
            'term' => $this->term,
            'contract_date' => $this->contractDate->format('Y-m-d'),
        ];
    }

    public function transformTemplate($template)
    {
        $replacements = [
            '%TAX_RATE%' => $this->taxRate,
            '%ACQUISITION_FEE%' => $this->acquisitionFee,
            '%DOC_FEE%' => $this->docFee,
            '%CASH_DOWN%' => 0 - $this->cashDown,
            '%REBATE%' => 0 - $this->rebate,
            '%LICENSE_FEE%' => $this->licenseFee,
            '%CVR_FEE%' => $this->cvrFee,
            '%MONEY_FACTOR%' => $this->moneyFactor,
            '%CASH_ADVANCE%' => $this->cashAdvance,
            '%RESIDUAL_PERCENTAGE%' => $this->residualPercentage,
            '%MSRP%' => $this->msrp,
            '%TERM%' => $this->term,
            '%CONTRACT_DATE%' => $this->contractDate->format('Y-m-d'),
        ];

        return strtr($template, $replacements);
    }

    public function getCashDown()
    {
        return $this->cashDown;
    }

    public function getTerm()
    {
        return $this->term;
    }

    public function getAnnualMileage()
    {
        return $this->annualMileage;
    }
}