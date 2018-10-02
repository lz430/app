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
