import formulas from "../src/formulas";

test("it_calculates_monthly_finance_payment_via_basic_formula", () => {
  const price = 10000;
  const downPayment = 1000;
  /** months **/
  const term = 12;

  expect(
    Math.round(
      formulas.calculateFinancedMonthlyPayments(price, downPayment, term)
    )
  ).toEqual(766);
});

test("calculates_monthly_lease_payment_via_jato_formula", () => {
  const price = 33150;
  /** months */
  const term = 24;
  const downPayment = 3414;
  const deliveryCost = 995;

  expect(
    Math.round(
      formulas.calculateLeasedMonthlyPayments(
        price,
        downPayment,
        deliveryCost,
        term
      )
    )
  ).toEqual(582);
});
