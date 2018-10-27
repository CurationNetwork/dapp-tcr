import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from '../blocks/0xuniverse.jpg';

class TabChallenges extends React.Component {
  render() {
    return (<>
      <TableRow type="header">
        <TableHeader type="submitted"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" subtype="application" stage="commit" passedPercent={64}/>
        <CellActions type="commit"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" subtype="update" stage="commit" passedPercent={64}/>
        <CellActions type="commit"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" subtype="removal" stage="commit" passedPercent={64}/>
        <CellActions type="commit"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" subtype="application" stage="reveal" passedPercent={87}/>
        <CellActions type="reveal"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" subtype="application" stage="in-registry"/>
        <CellActions type="get-reward"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" subtype="application" stage="rejected"/>
        <CellActions type="loose"/>
      </TableRow>
    </>);
  }
}

export default TabChallenges;
