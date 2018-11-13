import React from 'react';
import { inject, observer } from 'mobx-react';

import './FormChallenge.scss';

@inject('stores')
@observer
class FormChallenge extends React.Component {
  constructor(props) {
    super(props);
  }

  stateToInt(state) {
    let states = ['NOT_EXISTS', 'APPLICATION', 'EXISTS', 'EDIT', 'DELETING'];
    return states.findIndex(s => s === state);
  }

  doChallenge() {
    const { challenge } = this.props.stores.tcrStore;

    console.log([this.props.item.id, this.stateToInt(this.props.item.state)]);
    challenge(this.props.item.id, this.stateToInt(this.props.item.state));
  }

  render() {
    const { buttonText } = this.props;

    return (<>
      <div className="prompts">You will receive 2 transaction prompts.</div>
      <div className="p-bold">Token deposit</div>
      <div className="p-thin">If the most of voters will stake against you, you will completely loose this tokens.</div>
      <div className="sum-n-button">
        <div className="sum"><span>1</span> DRT</div>
      </div>
      <div className="big-button">
        <button onClick={() => this.doChallenge()}>{buttonText}</button>
      </div>
    </>);
  }
}

export default FormChallenge;
