import formulas from '../src/formulas';

test('it_calculates_monthly_finance_payment_via_basic_formula', () => {
    const price = 10000;
    const downPayment = 1000;
    /** months **/
    const term = 12;
    const residualPercent = 61;

    expect(
        formulas.calculateFinancedMonthlyPayments(
            price,
            downPayment,
            term,
            residualPercent
        )
    ).toEqual(766);
});

test('calculates_monthly_lease_payment_via_jato_formula', () => {
    const price = 33150;
    /** months */
    const term = 24;
    const downPayment = 3414;
    const deliveryCost = 995;
    const residualPercent = 61;

    expect(
        formulas.calculateLeasedMonthlyPayments(
            price,
            downPayment,
            deliveryCost,
            term,
            residualPercent
        )
    ).toEqual(formulas.calculateTotalLeaseMonthlyPayment(582));
});

test('calculates_total_cash_finance_price_via_formula', () => {
    const price = 40000;
    const docFee = 210;
    const dealBestOfferTotalValuw = 3500;
    const downPayment = 0;

    expect(
        formulas.calculateTotalCashFinance(
            price,
            docFee,
            downPayment,
            dealBestOfferTotalValuw
        )
    ).toEqual(39122.6);
});

test('calculates_total_lease_price_via_formula', () => {
    const price = 40000;
    const docFee = 210;
    const totalRebates = 4250;

    expect(formulas.calculateTotalLease(price, docFee, totalRebates)).toEqual(
        40477.6
    );
});

test('calculates_lease_payment_via_formula', () => {
    const monthlyPayment = 300;

    expect(formulas.calculateTotalLeaseMonthlyPayment(monthlyPayment)).toEqual(
        318
    );
});

test('calculates_cash_finance_sales_tax', () => {
    const price = 40000;
    const docFee = 210;

    expect(formulas.calculateSalesTaxCashFinance(price, docFee)).toEqual(
        2412.6
    );
});

test('calculates_lease_due_at_signing', () => {
    const totalRebates = 250;
    const downPayment = 4000;
    const docFee = 210;

    expect(
        formulas.calculateLeaseTaxesDueAtSigning(
            totalRebates,
            downPayment,
            docFee
        )
    ).toEqual(267.6);
});
