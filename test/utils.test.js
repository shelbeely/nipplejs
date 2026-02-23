import {
    distance,
    angle,
    findCoord,
    radians,
    degrees,
    isPressed,
    extend,
    safeExtend,
    clamp,
    map,
    getTransitionStyle,
    getVendorStyle,
    configStylePropertyObject,
    applyPosition,
    bindEvt,
    unbindEvt,
} from '../src/utils';

describe('distance', () => {
    test('calculates distance between two points', () => {
        expect(distance({x: 0, y: 0}, {x: 3, y: 4})).toBe(5);
    });

    test('returns 0 for same point', () => {
        expect(distance({x: 5, y: 5}, {x: 5, y: 5})).toBe(0);
    });
});

describe('angle', () => {
    test('calculates angle between two points in degrees', () => {
        const a = angle({x: 0, y: 0}, {x: 1, y: 0});
        expect(a).toBeCloseTo(0);
    });

    test('calculates 90 degrees angle', () => {
        const a = angle({x: 0, y: 0}, {x: 0, y: 1});
        expect(a).toBeCloseTo(90);
    });
});

describe('radians', () => {
    test('converts 180 degrees to PI radians', () => {
        expect(radians(180)).toBeCloseTo(Math.PI);
    });

    test('converts 0 degrees to 0 radians', () => {
        expect(radians(0)).toBe(0);
    });

    test('converts 90 degrees to PI/2 radians', () => {
        expect(radians(90)).toBeCloseTo(Math.PI / 2);
    });
});

describe('degrees', () => {
    test('converts PI radians to 180 degrees', () => {
        expect(degrees(Math.PI)).toBeCloseTo(180);
    });

    test('converts 0 radians to 0 degrees', () => {
        expect(degrees(0)).toBe(0);
    });

    test('radians and degrees are inverse functions', () => {
        expect(degrees(radians(45))).toBeCloseTo(45);
    });
});

describe('findCoord', () => {
    test('finds coordinate at distance 0 returns original point', () => {
        const result = findCoord({x: 5, y: 5}, 0, 0);
        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(5);
    });

    test('finds coordinate to the right (angle 0)', () => {
        const result = findCoord({x: 0, y: 0}, 10, 0);
        expect(result.x).toBeCloseTo(-10);
        expect(result.y).toBeCloseTo(0);
    });
});

describe('isPressed', () => {
    test('returns true when buttons is non-zero', () => {
        expect(isPressed({buttons: 1})).toBe(true);
    });

    test('returns false when buttons is 0', () => {
        expect(isPressed({buttons: 0})).toBe(false);
    });

    test('falls back to pressure when buttons is NaN', () => {
        expect(isPressed({buttons: NaN, pressure: 0.5})).toBe(true);
        expect(isPressed({buttons: NaN, pressure: 0})).toBe(false);
    });
});

describe('clamp', () => {
    test('returns position when within bounds', () => {
        const result = clamp({x: 5, y: 5}, {x: 5, y: 5}, 10);
        expect(result).toEqual({x: 5, y: 5});
    });

    test('clamps x to the right boundary', () => {
        const result = clamp({x: 20, y: 5}, {x: 5, y: 5}, 10);
        expect(result.x).toBe(15);
    });

    test('clamps x to the left boundary', () => {
        const result = clamp({x: -10, y: 5}, {x: 5, y: 5}, 10);
        expect(result.x).toBe(-5);
    });

    test('clamps y to the bottom boundary', () => {
        const result = clamp({x: 5, y: 20}, {x: 5, y: 5}, 10);
        expect(result.y).toBe(15);
    });
});

describe('extend', () => {
    test('copies properties from objB to objA', () => {
        const a = {x: 1};
        const b = {y: 2};
        extend(a, b);
        expect(a).toEqual({x: 1, y: 2});
    });

    test('overwrites existing properties', () => {
        const a = {x: 1};
        const b = {x: 5};
        extend(a, b);
        expect(a.x).toBe(5);
    });
});

describe('safeExtend', () => {
    test('only overwrites keys present in objA', () => {
        const result = safeExtend({x: 1, y: 2}, {x: 10, z: 99});
        expect(result).toEqual({x: 10, y: 2});
    });

    test('does not add new keys from objB', () => {
        const result = safeExtend({x: 1}, {x: 5, y: 9});
        expect(result).toEqual({x: 5});
    });
});

describe('map', () => {
    test('calls fn for each element of an array', () => {
        const results = [];
        map([1, 2, 3], (v) => results.push(v));
        expect(results).toEqual([1, 2, 3]);
    });

    test('calls fn for a single non-array item', () => {
        const results = [];
        map({}, (v) => results.push(v));
        expect(results).toHaveLength(1);
    });
});

describe('configStylePropertyObject', () => {
    test('creates object with vendor prefixes', () => {
        const obj = configStylePropertyObject('transition');
        expect(obj).toHaveProperty('transition');
        expect(obj).toHaveProperty('webkitTransition');
        expect(obj).toHaveProperty('MozTransition');
        expect(obj).toHaveProperty('oTransition');
    });
});

describe('getVendorStyle', () => {
    test('sets the same value for all vendor properties', () => {
        const obj = getVendorStyle('borderRadius', '50%');
        for (const key of Object.keys(obj)) {
            expect(obj[key]).toBe('50%');
        }
    });
});

describe('getTransitionStyle', () => {
    test('sets single string value with time', () => {
        const obj = getTransitionStyle('transition', 'opacity', '250ms');
        for (const key of Object.keys(obj)) {
            expect(obj[key]).toBe('opacity 250ms');
        }
    });

    test('sets array of values with time', () => {
        const obj = getTransitionStyle('transition', ['opacity', 'transform'], '250ms');
        for (const key of Object.keys(obj)) {
            expect(obj[key]).toBe('opacity 250ms, transform 250ms');
        }
    });
});

describe('applyPosition', () => {
    test('applies css position properties when top/right/bottom/left provided', () => {
        const el = document.createElement('div');
        applyPosition(el, {top: '10px', left: '20px'});
        expect(el.style.top).toBe('10px');
        expect(el.style.left).toBe('20px');
    });

    test('applies x/y as left/top in pixels', () => {
        const el = document.createElement('div');
        applyPosition(el, {x: 50, y: 100});
        expect(el.style.left).toBe('50px');
        expect(el.style.top).toBe('100px');
    });
});

describe('bindEvt / unbindEvt', () => {
    test('binds and unbinds event listeners', () => {
        const el = document.createElement('div');
        const handler = jest.fn();
        bindEvt(el, 'click', handler);
        el.dispatchEvent(new Event('click'));
        expect(handler).toHaveBeenCalledTimes(1);
        unbindEvt(el, 'click', handler);
        el.dispatchEvent(new Event('click'));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test('binds multiple events from space-separated string', () => {
        const el = document.createElement('div');
        const handler = jest.fn();
        bindEvt(el, 'mousedown mouseup', handler);
        el.dispatchEvent(new Event('mousedown'));
        el.dispatchEvent(new Event('mouseup'));
        expect(handler).toHaveBeenCalledTimes(2);
    });
});
