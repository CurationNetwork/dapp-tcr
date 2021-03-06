import React from 'react';

import Block from './Block';
import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

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
