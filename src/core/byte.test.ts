import {flipBitsToZero, flipBitsToOne} from './byte';

describe('byte', () => {
    it('can zero out bits', () => {
        expect(flipBitsToZero(255, 1)).toBe(254);
        expect(flipBitsToZero(212, 6)).toBe(192);
        expect(flipBitsToZero(123, 8)).toBe(0);
        expect(flipBitsToZero(23, 0)).toBe(23);
    });

    it('can flip bits to one', () => {
       expect(flipBitsToOne(122,4)).toBe(127); 
       expect(flipBitsToOne(0,8)).toBe(255);
       expect(flipBitsToOne(0,3)).toBe(7); 
       expect(flipBitsToOne(0,2)).toBe(3);
       expect(flipBitsToOne(0,1)).toBe(1);
    });
});