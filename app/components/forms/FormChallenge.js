import React from 'react';
import { inject, observer } from 'mobx-react';

import './FormChallenge.scss';

@inject('stores')
@observer
export default class FormChallenge extends React.Component {
  constructor(props) {
    super(props);
  }

  doChallenge() {
    const { challenge } = this.props.stores.tcrStore;
    const { item } = this.props;

    console.log(item.id, item.state);
    challenge(item.id, item.state);
  }

  render() {
    const { buttonText } = this.props;

    return (
      <button onClick={() => this.doChallenge()}>{buttonText}</button>
    );
  }
}
