import util from '../src/util';

test('it_can_get_the_closest_number_in_a_range', () => {
    expect(util.getClosestNumberInRange(6, [2, 4, 6, 9])).toEqual(6);
    expect(util.getClosestNumberInRange(11, [2, 4, 6, 9])).toEqual(9);
    expect(util.getClosestNumberInRange(1, [2, 4, 6, 9])).toEqual(2);
    expect(util.getClosestNumberInRange(3, [2, 4, 6, 9])).toEqual(2);
    expect(util.getClosestNumberInRange(3, [9, 6, 4, 2])).toEqual(2);
});
