import toCamelCase from './toCamelCase';

describe('toCamelCase', () => {
  it('should convert string to camelCase', () => {
    expect(toCamelCase('foo_bar')).toEqual('fooBar');
    expect(toCamelCase('foo-bar')).toEqual('fooBar');
    expect(toCamelCase('FooBar')).toEqual('fooBar');
    expect(toCamelCase('foo bar')).toEqual('fooBar');
  });

  it('should convert object to camelCase', () => {
    const obj = {
      foo_bar1: 'Not Touched',
      'foo-bar2': 'Not Touched',
      FooBar3: 'Not Touched',
      'foo bar 4': 'Not Touched',
    };
    expect(toCamelCase(obj)).toEqual({
      fooBar1: 'Not Touched',
      fooBar2: 'Not Touched',
      fooBar3: 'Not Touched',
      fooBar4: 'Not Touched',
    });
  });

  it('should convert array of objects to camelCase', () => {
    const obj = {
      foo_bar1: 'Not Touched',
      'foo-bar2': 'Not Touched',
      FooBar3: 'Not Touched',
      'foo bar 4': 'Not Touched',
    };

    const result = {
      fooBar1: 'Not Touched',
      fooBar2: 'Not Touched',
      fooBar3: 'Not Touched',
      fooBar4: 'Not Touched',
    };
    expect(toCamelCase([obj, obj, obj, obj])).toEqual([result, result, result, result]);
  });
});
