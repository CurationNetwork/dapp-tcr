import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from '../blocks/0xuniverse.jpg';

class TabApplications extends React.Component {
  render() {
    return (<>
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
        <CellDappStatus type="updated" passedPercent={59}/>
        <CellActions type="challenge"/>
      </TableRow>
    </>);
  }
}

export default TabApplications;
