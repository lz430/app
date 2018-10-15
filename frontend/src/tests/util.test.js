import { getClosestNumberInRange } from '../src/util';

test('it_can_get_the_closest_number_in_a_range', () => {
    expect(getClosestNumberInRange(6, [2, 4, 6, 9])).toEqual(6);
    expect(getClosestNumberInRange(11, [2, 4, 6, 9])).toEqual(9);
    expect(getClosestNumberInRange(1, [2, 4, 6, 9])).toEqual(2);
    expect(getClosestNumberInRange(3, [2, 4, 6, 9])).toEqual(2);
    expect(getClosestNumberInRange(3, [9, 6, 4, 2])).toEqual(2);
});
