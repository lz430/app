import R from 'ramda';

const rebates = {
    getAvailableTargetsForDealAndType: (
        dealTargets,
        type,
        deal
    ) => {
        // @todo later filter out finance only to finance, etc.
        return dealTargets[deal.id];

        // if (!(deal && dealTargets && dealTargets.hasOwnProperty(deal.id))) {
        //     return null;
        // }

        // return R.filter(rebate => {
        //     return R.contains(type, rebate.types);
        // }, dealTargets[deal.id]);
    }
};

export default rebates;
