import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CellActions.scss';

class CellActions extends React.Component {
  render() {
    const { type } = this.props;

    return (<div className="actions">
      {type === 'challenge' && 
        <div className="challenge"><FontAwesomeIcon icon="ban"/> Challenge to reject</div>
      }
    </div>);        
  }
}

export default CellActions;
