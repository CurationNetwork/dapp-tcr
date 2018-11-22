import React from 'react';
import Ajv from 'ajv';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';
import { dappSchema } from '../../helpers/get-schema';

class Tab extends React.Component {
  render() {
    const { slice, data } = this.props;
    const ajv = new Ajv();

    return (<>
      <TableRow type="header">
        <TableHeader type={slice}/>
      </TableRow>
      {data.map((item, idx) => {
        const valid = ajv.validate(dappSchema, item.ipfsData);
        const { id, canBeUpdated, state, isChallenged } = item;
        const { logo, name, shortDescription } = valid ? item.ipfsData.metadata : {};

        // { type, passedPercent, item } = this.props;
        // item.challengeStatus; item.state item.isChallenged

        return (
          <TableRow key={idx}>
            <CellDappName
              id={id}
              logo={logo}
              name={name}
              desc={shortDescription}
              valid={valid}
              canBeUpdated={canBeUpdated}
            />
            <CellDappStatus
              state={state}
              isChallenged={isChallenged}
            />
            <CellActions type="registry" item={item} subtype={item.state}/>
          </TableRow>
        );
      })}
    </>);
  }
}

export default Tab;
