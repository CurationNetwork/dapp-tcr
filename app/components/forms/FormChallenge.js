import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Form.scss';

class FormChallenge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { buttonText } = this.props;

    return (<>
      <div className="prompts">You will receive 2 transaction prompts.</div>
      <div className="p-bold">Token deposit</div>
      <div className="p-thin">If the most of voters will stake against you, you will completely loose this tokens.</div>
      <div className="sum-n-button">
        <div className="sum"><span>10</span> DRT</div>
        <div className="button">
          <button>Approve</button>
        </div>
      </div>
      <div className="big-button">
        <button className="disabled">{buttonText}</button>
      </div>
    </>);
  }
}

export default FormChallenge;
