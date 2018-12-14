import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';


import ProgressBar from './ProgressBar';
import './CellDappStatus.scss';

function Stage(props) {
  const { type, status } = props;

  return (<div className={`stage ${status}`}>
    {type === 'application' && <><FontAwesomeIcon icon="plus-square"/> Application</>}
    {type === 'updating' && <><FontAwesomeIcon icon="pen"/> Updating</>}
    {type === 'in-registry' && <>In registry</>}
    {type === 'challenged' && <><FontAwesomeIcon icon="gavel"/> Challenge. Commit</>}
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

@inject('stores')
@observer
export default class CellDappStatus extends React.Component {
  render() {
    const { state, stores, isChallenged, stageEndTime, challengeStatus } = this.props;
    const { TCR_ITEM_STATE } = stores.tcrStore;
    let phase, commitStatus, revealStatus;

    if (isChallenged && challengeStatus) {  
      phase = challengeStatus.phase;
      if (phase === 'commit') {
        commitStatus = 'active';
        revealStatus = 'future';
      } else {
        commitStatus = 'passed';
        revealStatus = 'active';
      }
    }

    return (
      <div className="dapp-status">
        {(state === TCR_ITEM_STATE.APPLICATION && !isChallenged) &&
          <>
            <Stage type="application" status="active"/>
            <ProgressBar
              stageEndTime={stageEndTime}
              stageLen={stores.parametrizerStore.tcrParameters.get('applyStageLen')}
            />
            <Stage type="in-registry" status="future"/>
          </>
        }
        {(isChallenged && challengeStatus) &&
          <>
            <Stage type="challenged" status={commitStatus} />
            <ProgressBar
              stageEndTime={challengeStatus.commitEndDate}
              stageLen={stores.parametrizerStore.tcrParameters.get('commitStageLen')}
            />
            <Stage type="reveal" status={revealStatus}/>
            <ProgressBar
              stageEndTime={challengeStatus.revealEndDate}
              stageLen={stores.parametrizerStore.tcrParameters.get('revealStageLen')}
            />
            <ProgressBarFork status="future"/>
            <div className="finish">
              <Stage type="in-registry" status={phase === 'in-registry' ? 'active' : 'future'}/>
              <Stage type="rejected" status={phase === 'rejected' ? 'active' : 'future'}/>
            </div>
          </>
        }
        {(state === TCR_ITEM_STATE.EXISTS && !isChallenged) &&
          <Stage type="in-registry" status="active" />
        }
      </div>
    );
  }
}
