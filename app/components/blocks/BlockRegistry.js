import React from 'react';

import Block from '../common/Block';
import TableRow from '../common/TableRow';
import TableHeader from '../common/TableHeader';
import CellDappName from '../common/CellDappName';
import CellDappStatus from '../common/CellDappStatus';
import CellActions from '../common/CellActions';

import imgMock from './0xuniverse.jpg';

class BlockRegistry extends React.Component {
  render() {
    return (<Block name="Dapps in Registry" type="registry">
    <TableRow type="header">
      <TableHeader type="registry"/>
    </TableRow>
    <TableRow>
      <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
      <CellDappStatus type="registry"/>
      <CellActions type="registry"/>
    </TableRow>
    <TableRow>
      <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
      <CellDappStatus type="registry" challenges={['update']}/>
      <CellActions type="registry" challenges={['update']}/>
    </TableRow>
    <TableRow>
      <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
      <CellDappStatus type="registry" challenges={['remove']}/>
      <CellActions type="registry" challenges={['remove']}/>
    </TableRow>
    <TableRow>
      <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
      <CellDappStatus type="registry" challenges={['update', 'remove']}/>
      <CellActions type="registry" challenges={['update', 'remove']}/>
    </TableRow>
  </Block>);
  }
}

export default BlockRegistry;
