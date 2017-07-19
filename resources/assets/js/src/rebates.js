import R from 'ramda';
import util from '../src/util';

const selectRebate = (
    rebate_id,
    selected_rebate_ids,
    available_rebate_ids,
    compatibilities
) => {
    // if it is already in selectedRebateIds do nothing
    if (R.contains(rebate_id, selected_rebate_ids)) {
        return [selected_rebate_ids, available_rebate_ids];
    }

    const withThisRebateIds = R.concat(selected_rebate_ids, [rebate_id]);

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
        return [R.append(rebate_id, selected_rebate_ids), nextCompatibilities];
    } else {
        // Not in any compatibility lists
        if (withThisRebateIds.length === 1) {
            return [[rebate_id], [rebate_id]];
        }
    }

    // do nothing
    return [selected_rebate_ids, available_rebate_ids];
};

const toggleRebate = (
    rebate_id,
    selected_rebate_ids,
    available_rebate_ids,
    compatibilities
) => {
    const next_selected_rebate_ids = util.toggleItem(
        selected_rebate_ids,
        rebate_id
    );

    if (next_selected_rebate_ids.length === 0) {
        return [next_selected_rebate_ids, available_rebate_ids];
    } else {
        const [selected_rebate_ids, compatible_rebate_ids] = R.reduce(
            (carry, selected_rebate_id) => {
                const [
                    carry_selected_rebate_ids,
                    carry_compatible_rebate_ids,
                ] = carry;

                return selectRebate(
                    selected_rebate_id,
                    carry_selected_rebate_ids,
                    carry_compatible_rebate_ids,
                    compatibilities
                );
            },
            [[], available_rebate_ids],
            next_selected_rebate_ids
        );

        return [selected_rebate_ids, compatible_rebate_ids];
    }
};

export { selectRebate, toggleRebate };
