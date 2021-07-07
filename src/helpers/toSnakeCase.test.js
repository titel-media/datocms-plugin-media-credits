import toSnakeCase from './toSnakeCase';

describe('toSnakeCase', () => {
  it('should convert string to snakeCase', () => {
    expect(toSnakeCase('foo_bar')).toEqual('foo_bar');
    expect(toSnakeCase('foo-bar')).toEqual('foo_bar');
    expect(toSnakeCase('FooBar')).toEqual('foo_bar');
    expect(toSnakeCase('foo bar')).toEqual('foo_bar');
  });

  it('should convert object to snakeCase', () => {
    const obj = {
      foo_bar1: 'Not Touched',
      'foo-bar2': 'Not Touched',
      FooBar3: 'Not Touched',
      'foo bar 4': 'Not Touched',
    };
    expect(toSnakeCase(obj)).toEqual({
      foo_bar_1: 'Not Touched',
      foo_bar_2: 'Not Touched',
      foo_bar_3: 'Not Touched',
      foo_bar_4: 'Not Touched',
    });
  });

  it('should convert array of objects to snakeCase', () => {
    const obj = {
      foo_bar1: 'Not Touched',
      'foo-bar2': 'Not Touched',
      FooBar3: 'Not Touched',
      'foo bar 4': 'Not Touched',
    };

    const result = {
      foo_bar_1: 'Not Touched',
      foo_bar_2: 'Not Touched',
      foo_bar_3: 'Not Touched',
      foo_bar_4: 'Not Touched',
    };
    expect(toSnakeCase([obj, obj, obj, obj])).toEqual([result, result, result, result]);
  });
});
