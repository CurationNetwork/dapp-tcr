import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import ProgressBar from './ProgressBar';
import './CellDappStatus.scss';

function Stage(props) {
  const { type, status, subtype } = props;

  return (<div className={`stage ${status}`}>
    {type === 'application' && <><FontAwesomeIcon icon="plus-square"/> Application</>}
    {type === 'updating' && <><FontAwesomeIcon icon="pen"/> Updating</>}
    {type === 'in-registry' && <>In registry</>}
    {type === 'challenged' &&
      <><FontAwesomeIcon icon="gavel"/> {subtype.charAt(0).toUpperCase() + subtype.slice(1)}. Commit</>}
    {type === 'reveal' && <>Reveal</>}
    {type === 'rejected' && <>Rejected</>}
    {type === 'challenged-update' && <><FontAwesomeIcon icon="pen"/> &nbsp; Update submitted</>}
    {type === 'challenged-remove' && <><FontAwesomeIcon icon="gavel"/> &nbsp; Challenged</>}
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
    const { state, isChallenged, stageEndTime } = this.props;

    let paylo = <div className="dapp-status"></div>;

    if (state === 'APPLICATION' && !isChallenged) {
      paylo = (
        <div className="dapp-status">
          <Stage type="application" status="active"/>
          <ProgressBar stageEndTime={stageEndTime}/>
          <Stage type="in-registry" status="future"/>
        </div>
      );
    }

    // else if (type === 'challenged') {
    //   let [challengedStatus, passed1, revealStatus, passed2, finishStatus] = new Array(5);

    //   let challengeStatus = item.challengeStatus;

    //   let subtype = item.state === 'EXISTS' ? 'Removal' : 'Update';

    //   let stage = challengeStatus.phase;
    //   challengedStatus = stage === 'commit' ? 'active' : 'passed';
    //   passed1 = stage === 'commit' ? (challengeStatus.commitEndDate - new Date().getTime()/1000) / 60 : 100;

    //   if (stage === 'commit') {
    //     revealStatus = 'future';
    //     passed2 = 0;
    //   } else {
    //     revealStatus = stage === 'reveal' ? 'active' : 'passed';
    //     passed2 = stage === 'reveal' ? (challengeStatus.revealEndDate - new Date().getTime()/1000) / 60 : 100;
    //   }

    //   if (stage === 'commit' || stage === 'reveal') {
    //     finishStatus = 'future';
    //   } else {
    //     finishStatus = stage;
    //   }

    //   paylo = (<div className="dapp-status">
    //     <Stage type="challenged" status={challengedStatus} subtype={subtype} />
    //     <ProgressBar passedPercent={passed1}/>
    //     <Stage type="reveal" status={revealStatus}/>
    //     <ProgressBar passedPercent={passed2}/>
    //     <ProgressBarFork status={finishStatus}/>
    //     <div className="finish">
    //       <Stage type="in-registry" status={stage === 'in-registry' ? 'active' : 'future'}/>
    //       <Stage type="rejected" status={stage === 'rejected' ? 'active' : 'future'}/>
    //     </div>
    //   </div>);
    // }

    // else if (type === 'registry') {
    //   paylo = (<div className="dapp-status registry">
    //     {(item.isChallenged && item.state === 'EDIT') &&
    //       <Stage type="challenged-update" status="active "/>
    //     }
    //     {(item.isChallenged && item.state !== 'EDIT') &&
    //       <Stage type="challenged-remove" status="active"/>
    //     }
    //   </div>);
    // }

    return (<>
      {paylo}
    </>)
  }
}

export default CellDappStatus;
