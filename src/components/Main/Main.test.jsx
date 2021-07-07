import React from 'react';
import { shallow } from 'enzyme';

import { Main } from './Main';

describe('Main', () => {
  it('should render application not in dev mode', () => {
    const consoleMock = jest.fn();
    const storeConsole = console.debug;
    console.debug = consoleMock;
    const wrapper = shallow(<Main client={{}} plugin={{}} devMode={false} />);
    expect(wrapper).not.toBeNull();
    expect(consoleMock).not.toHaveBeenCalled();
    console.debug = storeConsole;
  });

  it('should render application in dev mode', () => {
    const consoleMock = jest.fn();
    const storeConsole = console.debug;
    console.debug = consoleMock;
    const wrapper = shallow(<Main client={{}} plugin={{}} devMode={true} />);
    expect(wrapper).not.toBeNull();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenCalledWith({ client: {}, plugin: {} });
    console.debug = storeConsole;
  });
});
