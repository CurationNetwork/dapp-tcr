import React from 'react';
import Ajv from 'ajv';
import { inject, observer } from 'mobx-react';

import TableRow from './TableRow';
import TableHeader from './TableHeader';
import CellDappName from './cell-dapp-name/CellDappName';
import CellDappStatus from './cell-dapp-status/CellDappStatus';
import CellActions from './cell-dapp-actions/CellActions';
import { dappSchema } from '../../helpers/get-schema';

@inject('stores')
@observer
export default class Table extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { slice, itemsData } = this.props;
    const ajv = new Ajv();

    return (<>
      <TableRow type="header">
        <TableHeader type={slice}/>
      </TableRow>

      {itemsData.map((item, i) => {
        const { id, canBeUpdated, state, isChallenged, ipfsData } = item;
        const isValid = ajv.validate(dappSchema, ipfsData);
        const { logo, name, shortDescription } = isValid
          ? item.ipfsData.metadata
          : { name: 'Invalid DApp schema' };

        let stageEndTime = null;
        if (slice === 'applications' && item.appEndDate) {
          stageEndTime = item.appEndDate;
        }

        return (
          <TableRow key={i + id}>
            <CellDappName
              id={id}
              logo={logo}
              name={name}
              desc={shortDescription}
              valid={isValid}
              canBeUpdated={canBeUpdated}
            />
            <CellDappStatus
              state={state}
              isChallenged={isChallenged}
              stageEndTime={stageEndTime}
            />
            <CellActions item={item} name={name} />
          </TableRow>
        );
      })}
    </>);
  }
}
