import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Block.scss';

class Block extends React.Component {
  render() {
    const { icon, name, children } = this.props;

    return (<div className="block">
      <div className="block-header">
        <div className="name">
          {icon &&
            <><FontAwesomeIcon icon={icon}/>&nbsp;</>
          }
          {name}
        </div>
        <div className="minimize"><FontAwesomeIcon icon={['far', 'window-minimize']}/></div>
      </div>
      {children}
    </div>);
  }
}

export default Block;
