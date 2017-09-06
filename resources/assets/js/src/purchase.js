import R from "ramda";

const purchase = {
  start: (deal, selectedTab, downPayment, selectedRebates, termDuration) => {
    let form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/apply-or-purchase");

    let csrf = document.createElement("input");
    csrf.setAttribute("name", "_token");
    csrf.setAttribute("value", window.Laravel.csrfToken);
    form.appendChild(csrf);

    let type = document.createElement("input");
    type.setAttribute("name", "type");
    type.setAttribute("value", selectedTab);
    form.appendChild(type);

    if (selectedTab !== "cash") {
      let amount_financed = document.createElement("input");
      amount_financed.setAttribute("name", "amount_financed");
      amount_financed.setAttribute(
        "value",
        (deal.price -
          downPayment -
          R.sum(R.map(R.prop("value"), selectedRebates))).toString()
      );
      form.appendChild(amount_financed);

      let term = document.createElement("input");
      term.setAttribute("name", "term");
      term.setAttribute("value", termDuration);
      form.appendChild(term);

      let down_payment = document.createElement("input");
      down_payment.setAttribute("name", "down_payment");
      down_payment.setAttribute("value", downPayment);
      form.appendChild(down_payment);
    }

    let deal_id = document.createElement("input");
    deal_id.setAttribute("name", "deal_id");
    deal_id.setAttribute("value", deal.id);
    form.appendChild(deal_id);

    selectedRebates.forEach((rebate, index) => {
      let rebateName = document.createElement("input");
      rebateName.setAttribute("name", `rebates[${index}][rebate]`);
      rebateName.setAttribute("value", rebate.rebate);
      form.appendChild(rebateName);

      let rebateValue = document.createElement("input");
      rebateValue.setAttribute("name", `rebates[${index}][value]`);
      rebateValue.setAttribute("value", rebate.value);
      form.appendChild(rebateValue);
    });

    let msrp = document.createElement("input");
    msrp.setAttribute("name", "msrp");
    msrp.setAttribute("value", deal.msrp);
    form.appendChild(msrp);

    let dmr_price = document.createElement("input");
    dmr_price.setAttribute("name", "dmr_price");
    dmr_price.setAttribute(
      "value",
      (deal.price - R.sum(R.map(R.prop("value"), selectedRebates))).toString()
    );
    form.appendChild(dmr_price);

    document.body.appendChild(form);
    form.submit();
  }
};

export default purchase;
