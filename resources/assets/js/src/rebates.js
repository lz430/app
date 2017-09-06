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

        return R.filter(
            selectedRebate =>
                R.contains(
                    selectedRebate.id,
                    R.map(
                        R.prop('id'),
                        R.filter(rebate => {
                            return R.contains(type, rebate.types);
                        }, dealRebates[deal.id])
                    )
                ),
            selectedRebates
        );
    },
};

export default rebates;
