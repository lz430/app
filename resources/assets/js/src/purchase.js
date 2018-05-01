import R from 'ramda';
import formulas from 'src/formulas';
import util from 'src/util';

const purchase = {
    start: (
        deal,
        selectedTab,
        downPayment,
        dealBestOfferTotalValue,
        dealBestOffer,
        termDuration,
        employeeBrand
    ) => {
        let form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', '/apply-or-purchase');

        let csrf = document.createElement('input');
        csrf.setAttribute('name', '_token');
        csrf.setAttribute('value', window.Laravel.csrfToken);
        form.appendChild(csrf);

        let type = document.createElement('input');
        type.setAttribute('name', 'type');
        type.setAttribute('value', selectedTab);
        form.appendChild(type);

        if (selectedTab === 'finance') {
            let amount_financed = document.createElement('input');
            amount_financed.setAttribute('name', 'amount_financed');
            amount_financed.setAttribute(
                'value',
                formulas
                    .calculateTotalCashFinance(
                        util.getEmployeeOrSupplierPrice(deal, employeeBrand),
                        deal.doc_fee,
                        downPayment,
                        dealBestOfferTotalValue
                    )
                    .toString()
            );
            form.appendChild(amount_financed);

            let term = document.createElement('input');
            term.setAttribute('name', 'term');
            term.setAttribute('value', termDuration);
            form.appendChild(term);

            let down_payment = document.createElement('input');
            down_payment.setAttribute('name', 'down_payment');
            down_payment.setAttribute('value', downPayment);
            form.appendChild(down_payment);
        } else if (selectedTab === 'lease') {
            let term = document.createElement('input');
            term.setAttribute('name', 'term');
            term.setAttribute('value', termDuration);
            form.appendChild(term);
        }

        let deal_id = document.createElement('input');
        deal_id.setAttribute('name', 'deal_id');
        deal_id.setAttribute('value', deal.id);
        form.appendChild(deal_id);
    
        /* dealBestOffer.programs.forEach((program, index) => {
            let rebateName = document.createElement('input');
            rebateName.setAttribute('name', `rebates[${index}][title]`);
            rebateName.setAttribute('value', program.title);
            form.appendChild(rebateName);

            let rebateValue = document.createElement('input');
            rebateValue.setAttribute('name', `rebates[${index}][value]`);
            rebateValue.setAttribute('value', program.value);
            form.appendChild(rebateValue);
        }); */
    
        let msrp = document.createElement('input');
        msrp.setAttribute('name', 'msrp');
        msrp.setAttribute('value', deal.msrp);
        form.appendChild(msrp);

        let dmr_price = document.createElement('input');
        dmr_price.setAttribute('name', 'dmr_price');
        dmr_price.setAttribute(
            'value',
            (util.getEmployeeOrSupplierPrice(deal, employeeBrand) - dealBestOfferTotalValue).toString()
        );
        form.appendChild(dmr_price);

        document.body.appendChild(form);
        form.submit();
    },
};

export default purchase;
