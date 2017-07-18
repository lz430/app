import R from 'ramda';

const selectRebate = (
    rebate_id,
    selectedRebateIds,
    compatibilities,
    compatibleRebateIds
) => {
    // if it is already in selectedRebateIds do nothing
    if (R.contains(rebate_id, selectedRebateIds)) {
        return [selectedRebateIds, compatibleRebateIds];
    }

    const withThisRebateIds = R.concat(selectedRebateIds, [rebate_id]);

    let nextCompatibilities = [];
    R.forEach(compatibleRebateIdsGroup => {
        // if with this rebate id is still a subset of a compatibility group, add everything in that group
        if (
            R.difference(withThisRebateIds, compatibleRebateIdsGroup).length ===
            0
        ) {
            // return new selected rebates and new compatibilityList
            nextCompatibilities = R.uniq(
                R.concat(nextCompatibilities, compatibleRebateIdsGroup)
            );
        }
    }, compatibilities);

    if (nextCompatibilities.length > 0) {
        return [R.append(rebate_id, selectedRebateIds), nextCompatibilities];
    } else {
        // Not in any compatibility lists
        if (withThisRebateIds.length === 1) {
            return [[rebate_id], [rebate_id]];
        }
    }

    // do nothing
    return [selectedRebateIds, compatibleRebateIds];
};

export { selectRebate };
