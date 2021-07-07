import React from 'react';
import { bool, shape } from 'prop-types';

import connectToDatoCms from '@root/hoc/connectToDatoCms';

import './Main.scss';

const Main = ({ client, devMode, plugin }) => {
  if (devMode) {
    console.debug({ client, plugin }); // eslint-disable-line no-console
  }
  return <div className="container">Your Plugin goes here</div>;
};

Main.propTypes = {
  client: shape({}).isRequired,
  plugin: shape({}).isRequired,
  devMode: bool.isRequired,
};

Main.defaultProps = {
  devMode: false,
};

export { Main };
export default connectToDatoCms((plugin) => ({
  devMode: JSON.parse(plugin.parameters.global.developmentMode),
}))(Main);
