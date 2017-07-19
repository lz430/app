import { selectRebate, toggleRebate } from '../src/rebates';
import R from 'ramda';

test('it_can_select_rebates_accurately', () => {
    const compatibilities = [
        [131400, 131388, 128013],
        [131400, 131387, 128013],
        [131400, 131387, 128013],
        [131400, 131387, 128013],
        [131397, 131360, 104356],
        [131400, 130056],
    ];

    let [selectedRebates, compatibleRebateIds] = selectRebate(
        131400,
        [],
        R.uniq(R.flatten(compatibilities)),
        compatibilities
    );

    expect([131400]).toEqual(selectedRebates.sort());

    expect([128013, 130056, 131387, 131388, 131400]).toEqual(
        compatibleRebateIds.sort()
    );

    /** Let's select another one */
    [selectedRebates, compatibleRebateIds] = selectRebate(
        128013,
        selectedRebates,
        compatibleRebateIds,
        compatibilities
    );

    expect([128013, 131400]).toEqual(selectedRebates.sort());

    expect([128013, 131387, 131388, 131400]).toEqual(
        compatibleRebateIds.sort()
    );

    /** And the final one in a compatible group */
    [selectedRebates, compatibleRebateIds] = selectRebate(
        131387,
        selectedRebates,
        compatibleRebateIds,
        compatibilities
    );

    expect([128013, 131387, 131400]).toEqual(selectedRebates.sort());

    expect([128013, 131387, 131400]).toEqual(compatibleRebateIds.sort());

    /** And finally make sure it is idempotent */
    [selectedRebates, compatibleRebateIds] = selectRebate(
        131387,
        selectedRebates,
        compatibleRebateIds,
        compatibilities
    );

    expect([128013, 131387, 131400]).toEqual(selectedRebates.sort());

    expect([128013, 131387, 131400]).toEqual(compatibleRebateIds.sort());
});

test('it_can_select_single_rebate_that_is_not_compatible_with_others', () => {
    const compatibilities = [[131400, 131388, 128013]];

    const [selectedRebates, compatibleRebateIds] = selectRebate(
        111111,
        [],
        R.flatten(compatibilities),
        compatibilities
    );

    expect([111111]).toEqual(selectedRebates);

    expect([111111]).toEqual(compatibleRebateIds.sort());
});

test('it_can_toggle_rebates', () => {
    const compatibilities = [[131400, 131388, 128013]];

    let [selectedRebates, compatibleRebateIds] = toggleRebate(
        131400,
        [],
        R.flatten(compatibilities),
        compatibilities
    );

    expect(selectedRebates).toEqual([131400]);

    expect(compatibleRebateIds.sort()).toEqual([131400, 131388, 128013].sort());

    /** Now let's toggle it off **/
    [selectedRebates, compatibleRebateIds] = toggleRebate(
        131400,
        [131400],
        R.flatten(compatibilities),
        compatibilities
    );

    expect(selectedRebates).toEqual([]);

    expect(compatibleRebateIds.sort()).toEqual([131400, 131388, 128013].sort());
});
