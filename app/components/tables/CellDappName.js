import React from 'react';

import './CellDappName.scss';
import {Contract} from "../../helpers/eth";

class CellDappName extends React.Component {

  updateStatus() {
    let contract = Contract('Registry');

    contract.send('update_status', [this.props.item.id])
      .then(console.log());
  }

  render() {
    const { icon, name, desc } = this.props;

    return (<div className="dapp-name">
      <div className="icon"><img src={icon} alt={`${name} icon`}/></div>
      <div>
        <div className="name">{name}</div>
        <div className="desc-short">{desc}</div>
        <div className="update" onClick={() => this.updateStatus()}>update status</div>
      </div>
    </div>);        
  }
}

export default CellDappName;
