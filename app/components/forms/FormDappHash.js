import React from 'react';
import { inject, observer } from 'mobx-react';

import { isIpfsHash } from '../../helpers/ipfs-tools';

import './FormDappHash.scss';

@inject('stores')
@observer
export default class FormDappHash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hashInputError: false
    };

    this.handleHashSubmit = this.handleHashSubmit.bind(this);

    this.hashInput = React.createRef();
  }

  handleHashSubmit(e) {
    e.preventDefault();
    const { value } = this.hashInput.current.value.trim();

    if (isIpfsHash(value)) {
      this.setState({hashInputError: false});
      this.props.stores.tcrStore.apply(value);
    } else {
      this.setState({hashInputError: true});
    }  
  }

  render() {
    return (
      <form className="form-dapp-hash modal-form" onSubmit={this.handleHashSubmit}>
        <div>
          <input
            type="text"
            placeholder="IPFS hash of DApp JSON Schema"
            ref={this.hashInput}
          />
          {this.state.hashInputError &&
            <div className="error-detail">
              <p className="text-danger">Valid IPFS-hash required</p>
            </div>
          }
        </div>
        <p><button>Submit</button></p>
      </form>
    );
  }
}
