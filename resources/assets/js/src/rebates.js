import R from 'ramda';

const rebates = {
    getAvailableTargetsForDeal: (
        dealTargets,
        deal
    ) => {
        if (!(deal && dealTargets && dealTargets.hasOwnProperty(deal.id))) {
            return null;
        }

        return dealTargets[deal.id];
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
                R.map(R.prop('targetId'), selectedTargets).includes(
                    possibleTargetForDeal.targetId
                )
            );
        }, possibleTargetsForDeal);
    }
};

export default rebates;
