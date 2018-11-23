import React from 'react';
import Ajv from 'ajv';
import { inject, observer } from 'mobx-react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/cell-dapp-status/CellDappStatus';
import CellActions from '../tables/CellActions';
import { dappSchema } from '../../helpers/get-schema';

@inject('stores')
@observer
class Tab extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { stores, slice, itemsData } = this.props;
    const ajv = new Ajv();
    const applyStageLen = stores.parametrizerStore.tcrParameters.get('applyStageLen');

    return (<>
      <TableRow type="header">
        <TableHeader type={slice}/>
      </TableRow>

      {itemsData.map((item, idx) => {
        const { ipfsData } = item;
        const isValid = ajv.validate(dappSchema, ipfsData);
        const { logo, name, shortDescription } = isValid
          ? item.ipfsData.metadata
          : {name: 'Invalid DApp schema'};
        const { id, canBeUpdated, state, isChallenged } = item;

        let stageEndTime = null;
        if (slice === 'applications' && item.appEndDate) {
          stageEndTime = item.appEndDate;
        }

        return (
          <TableRow key={idx}>
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
            <CellActions type="registry" item={item} subtype={item.state}/>
          </TableRow>
        );
      })}
    </>);
  }
}

export default Tab;
