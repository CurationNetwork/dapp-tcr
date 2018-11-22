import React from 'react';

import TableRow from '../../tables/TableRow';
import TableHeader from '../../tables/TableHeader';
import CellDappName from '../../tables/CellDappName';
import CellDappStatus from '../../tables/CellDappStatus';
import CellActions from '../../tables/CellActions';

import imgMock from '../../blocks/0xuniverse.jpg';

class TabApplications extends React.Component {
  render() {

    return (<>
      <TableRow type="header">
        <TableHeader type="submitted"/>
      </TableRow>
      {this.props.data
      .filter(item => (item.state === 'APPLICATION' || item.state === 'EDIT'))
      .map((item, idx) => {
        const valid = (item.ipfsData && item.ipfsData.metadata && item.ipfsData.metadata.name);

        return (
          <TableRow key={idx}>
            <CellDappName
              icon={imgMock}
              name={valid ? item.ipfsData.metadata.name : 'Not valid schema'}
              desc={valid ? item.ipfsData.metadata.short_description : ''}
              item={item}
            />
            <CellDappStatus type="registry" item={item}/>
            <CellActions type="registry" item={item} subtype={item.state}/>
          </TableRow>
        );
      })}
    </>);
  }
}

export default TabApplications;
