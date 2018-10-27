import React from 'react';

import Block from '../common/Block';
import TableRow from '../common/TableRow';
import TableHeader from '../common/TableHeader';
import CellDappName from '../common/CellDappName';
import CellDappStatus from '../common/CellDappStatus';
import CellActions from '../common/CellActions';

import './BlockSubmitted.scss';
import imgMock from './0xuniverse.jpg';

class BlockSubmitted extends React.Component {
  render() {
    return (<Block name="Submitted dapps" icon="plus-square">
      <TableRow type="header">
        <TableHeader type="submitted"/>
      </TableRow>

      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="submitted" passedPercent={35}/>
        <CellActions type="challenge"/>
      </TableRow>

      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" stage="commit" passedPercent={70}/>
        <CellActions type="challenge"/>
      </TableRow>
    </Block>);
  }
}

export default BlockSubmitted;
