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
    },
    /** @todo: should this return non-visible targets like 'open offers'? */
    /**
     * Return the intersection of globally selected targets and the targets
     * available on this deal
     */
    getSelectedTargetsForDeal: (
        dealTargets,
        selectedTargets,
        deal
    ) => {
        if (!(deal && dealTargets && dealTargets.hasOwnProperty(deal.id))) {
            return [];
        }

        const possibleTargetsForDeal = dealTargets[deal.id];

        return R.filter(possibleTargetForDeal => {
            return (
                R.map(R.prop('id'), selectedTargets).includes(
                    possibleTargetForDeal.id
                )
            );
        }, possibleTargetsForDeal);
    }
};

export default rebates;
