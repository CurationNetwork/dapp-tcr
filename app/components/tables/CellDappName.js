import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CellDappName.scss';
import {Contract} from "../../helpers/eth";
import poa from '../../assets/poa.png';
import ethereum from '../../assets/ethereum.png';

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
          {(item.ipfsData.metadata.networks && item.ipfsData.metadata.networks.indexOf('POA Network') !== -1) &&
            <img src={poa} alt="POA Network" style={{height: '16px', marginLeft: '6px'}} />
          }
          {(item.ipfsData.metadata.networks && item.ipfsData.metadata.networks.indexOf('Ethereum') !== -1) &&
            <img src={ethereum} alt="Ethereum" style={{height: '14px', marginLeft: '6px'}} />
          }
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
