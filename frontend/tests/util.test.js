/* global test */
/* global expect */

import { getClosestNumberInRange } from '../util/util';

test('it_can_get_the_closest_number_in_a_range', () => {
    expect(getClosestNumberInRange(36, [27, 39])).toEqual(39);
    expect(getClosestNumberInRange(11, [2, 4, 6, 9])).toEqual(9);
    expect(getClosestNumberInRange(1, [2, 4, 6, 9])).toEqual(2);
    expect(getClosestNumberInRange(3, [2, 4, 6, 9])).toEqual(2);
    expect(getClosestNumberInRange(3, [9, 6, 4, 2])).toEqual(2);
});
