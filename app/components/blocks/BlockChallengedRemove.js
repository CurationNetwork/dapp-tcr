import React from 'react';

import Block from '../common/Block';
import TableRow from '../common/TableRow';
import TableHeader from '../common/TableHeader';
import CellDappName from '../common/CellDappName';
import CellDappStatus from '../common/CellDappStatus';
import CellActions from '../common/CellActions';

import imgMock from './0xuniverse.jpg';

class BlockChallengedRemove extends React.Component {
  render() {
    return (<Block name="Challenged for removal" icon="minus-square">
      <TableRow type="header">
        <TableHeader type="challenged"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" stage="commit" passedPercent={64}/>
        <CellActions type="commit"/>
      </TableRow>
    </Block>);
  }
}

export default BlockChallengedRemove;
