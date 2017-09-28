import R from 'ramda';

const rebates = {
    getAvailableRebatesForDealAndType: (
        dealRebates,
        selectedRebates,
        type,
        deal
    ) => {
        if (!(deal && dealRebates && dealRebates.hasOwnProperty(deal.id))) {
            return null;
        }

        return R.filter(rebate => {
            return R.contains(type, rebate.types);
        }, dealRebates[deal.id]);
    },
    getSelectedRebatesForDealAndType: (
        dealRebates,
        selectedRebates,
        type,
        deal
    ) => {
        if (!(deal && dealRebates && dealRebates.hasOwnProperty(deal.id))) {
            return [];
        }

        const possibleRebatesForDeal = dealRebates[deal.id];

        return R.filter(possibleRebateForDeal => {
            return R.map(R.prop('id'), selectedRebates).includes(
                possibleRebateForDeal.id
            );
        }, possibleRebatesForDeal);
    },
};

export default rebates;
