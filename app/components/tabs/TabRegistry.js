import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from '../blocks/0xuniverse.jpg';

class TabRegistry extends React.Component {
  render() {
    return (<>
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
    </>);
  }
}

export default TabRegistry;
