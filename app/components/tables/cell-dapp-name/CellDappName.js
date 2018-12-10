import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

import './CellDappName.scss';
import poa from '../../../assets/poa.png';
import ethereum from '../../../assets/ethereum.png';
import imgEmpty from '../../../assets/empty.png';

@inject('stores')
@observer
class CellDappName extends React.Component {
  render() {
    const { id, logo, name, desc, canBeUpdated } = this.props;

    return (
      <div className="dapp-name" id={id}>
        <div className="icon">
          <img src={logo ? `https://ipfs.io/ipfs/${logo}` : imgEmpty} alt={`${name} icon`}/>
        </div>
        <div>
          <div className="name">
            {name}
            {/* {(item.ipfsData.metadata.networks && item.ipfsData.metadata.networks.indexOf('POA Network') !== -1) &&
              <img src={poa} alt="POA Network" style={{height: '16px', marginLeft: '6px'}} />
            }
            {(item.ipfsData.metadata.networks && item.ipfsData.metadata.networks.indexOf('Ethereum') !== -1) &&
              <img src={ethereum} alt="Ethereum" style={{height: '14px', marginLeft: '6px'}} />
            } */}
          </div>
          {desc &&
            <div className="desc-short">{desc}</div>
          }
        </div>
      </div>
    );        
  }
}

export default CellDappName;
