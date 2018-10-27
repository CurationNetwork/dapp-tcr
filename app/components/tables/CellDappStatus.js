import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import './CellDappStatus.scss';

function Stage(props) {
  const { type, status } = props;

  return (<div className={`stage ${status}`}>
    {type === 'submitted' && <><FontAwesomeIcon icon="plus-square"/> Submitted</>}
    {type === 'in-registry' && <>In registry</>}
    {type === 'challenged' && <><FontAwesomeIcon icon="gavel"/> Challenged. Commit</>}
    {type === 'reveal' && <>Reveal</>}
    {type === 'rejected' && <>Rejected</>}
    {type === 'challenged-update' && <><FontAwesomeIcon icon="gavel"/> Challenged for update</>}
    {type === 'challenged-remove' && <><FontAwesomeIcon icon="gavel"/> Challenged for removal</>}
  </div>);
}

function ProgressBar(props) {
  const { passedPercent } = props;

  return (<div className="progress-bar">
    {passedPercent > 0 &&
      <div className="filled" style={{flexGrow: passedPercent}}></div>
    }
    {passedPercent < 100 &&
      <div className="empty" style={{flexGrow: 100 - passedPercent}}></div>
    }
  </div>);
}

function ProgressBarFork(props) {
  const { status } = props;

  return (<div className="progress-bar-fork">
    <div className={classNames('top', {filled: status === 'in-registry'})}></div>
    <div className={classNames('middle', {filled: status !== 'future'})}></div>
    <div className={classNames('bottom', {filled: status === 'rejected'})}></div>
  </div>);
}

class CellDappStatus extends React.Component {
  render() {
    const { type, stage, passedPercent, challenges } = this.props;

    if (type === 'submitted') {
      return (<div className="dapp-status">
        <Stage type="submitted" status="active"/>
        <ProgressBar passedPercent={passedPercent}/>
        <Stage type="in-registry" status="future"/>
      </div>);
    }

    else if (type === 'challenged') {
      let [challengedStatus, passed1, revealStatus, passed2, finishStatus] = new Array(5);

      challengedStatus = stage === 'commit' ? 'active' : 'passed';
      passed1 = stage === 'commit' ? passedPercent : 100;

      if (stage === 'commit') {
        revealStatus = 'future';
        passed2 = 0;
      } else {
        revealStatus = stage === 'reveal' ? 'active' : 'passed';
        passed2 = stage === 'reveal' ? passedPercent : 100;
      }

      if (stage === 'commit' || stage === 'reveal') {
        finishStatus = 'future';
      } else {
        finishStatus = stage;
      }
      
      return (<div className="dapp-status">
        <Stage type="challenged" status={challengedStatus}/>
        <ProgressBar passedPercent={passed1}/>
        <Stage type="reveal" status={revealStatus}/>
        <ProgressBar passedPercent={passed2}/>
        <ProgressBarFork status={finishStatus}/>
        <div className="finish">
          <Stage type="in-registry" status={stage === 'in-registry' ? 'active' : 'future'}/>
          <Stage type="rejected" status={stage === 'rejected' ? 'active' : 'future'}/>
        </div>
      </div>);
    }

    else if (type === 'registry') {
      return (<div className="dapp-status">
        <Stage type="in-registry" status="active"/>
        {(Array.isArray(challenges) && challenges.indexOf('update') !== -1) &&
          <Stage type="challenged-update" status="active registry"/>
        }
        {(Array.isArray(challenges) && challenges.indexOf('remove') !== -1) &&
          <Stage type="challenged-remove" status="active registry"/>
        }
      </div>);      
    }
  }
}

export default CellDappStatus;
