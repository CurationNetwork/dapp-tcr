import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CellDappStatus.scss';

function Stage(props) {
  const { type, status } = props;

  return (<div className={`stage ${status}`}>
    {type === 'submitted' &&
      <><FontAwesomeIcon icon="plus-square"/> Submitted</>
    }
    {type === 'in-registry' &&
      <>In registry</>
    }
  </div>);
}

function ProgressBar(props) {
  const { passedPercent } = props;

  return (<div className="progress-bar">
    <div className="filled" style={{flexGrow: passedPercent}}></div>
    <div className="empty" style={{flexGrow: 100 - passedPercent}}></div>
  </div>);
}

class CellDappStatus extends React.Component {
  render() {
    const { type, passedPercent } = this.props;

    return (<div className={`dapp-status ${type}`}>
      <Stage type="submitted" status="active"/>
      <ProgressBar passedPercent={passedPercent}/>
      <Stage type="in-registry" status="future"/>
    </div>);        
  }
}

export default CellDappStatus;
