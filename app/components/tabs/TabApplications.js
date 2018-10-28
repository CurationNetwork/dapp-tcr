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
      {this.props.data.filter(item => item[0] in [1, 3]).map((item, idx) =>
        <TableRow key={idx}>
          <CellDappName icon={imgMock} name={item.ipfs_data.data.metadata.name} desc={item.ipfs_data.data.metadata.short_description}/>
          <CellDappStatus type="registry"/>
          <CellActions type="registry"/>
        </TableRow>
      )}
    </>);
  }
}

export default TabApplications;
