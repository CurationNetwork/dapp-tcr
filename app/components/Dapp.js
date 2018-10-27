import React from 'react';

import BlockSubmitted from './blocks/BlockSubmitted';
import BlockChallengedRemove from './blocks/BlockChallengedRemove';
import BlockChallengedUpdate from './blocks/BlockChallengedUpdate';
import BlockRegistry from './blocks/BlockRegistry';

import './Dapp.scss';

class Dapp extends React.Component {
  render() {
    return (<div className="dapp-container">
      <BlockSubmitted/>
      <BlockChallengedUpdate/>
      <BlockChallengedRemove/>
      {/* 
      <BlockRegistry/>
      */}
    </div>);
  }
}

export default Dapp;
