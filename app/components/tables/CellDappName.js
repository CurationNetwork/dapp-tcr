import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CellDappName.scss';
import {Contract} from "../../helpers/eth";

class CellDappName extends React.Component {

  updateStatus() {
    let contract = Contract('Registry');

    contract.send('update_status', [this.props.item.id])
      .then(console.log());
  }

  render() {
    const { icon, name, desc, item } = this.props;

    return (<div className="dapp-name">
      <div className="icon"><img src={icon} alt={`${name} icon`}/></div>
      <div>
        <div className="name">
          {name}
        </div>
        <div className="desc-short">{desc}</div>
        <div className="update" onClick={() => this.updateStatus()}>
          <FontAwesomeIcon icon="sync-alt"/> update status
        </div>
      </div>
    </div>);        
  }
}

export default CellDappName;
