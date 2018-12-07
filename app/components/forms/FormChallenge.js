import React from 'react';
import { inject, observer } from 'mobx-react';

import Spinner from '../common/Spinner';

import './FormChallenge.scss';

@inject('stores')
@observer
export default class FormChallenge extends React.Component {
  FORM_STATE = Object.freeze({
    INITIAL: 0,
    TX_SIGNING: 1,
    TX_SENT: 2
  });

  constructor(props) {
    super(props);

    this.state = {
      txState: this.FORM_STATE.INITIAL,
      txHash: null
    }
  }

  doChallenge() {
    this.setState({
      txState: this.FORM_STATE.TX_SIGNING
    });

    const { challenge } = this.props.stores.tcrStore;
    const { item } = this.props;

    challenge(item.id, item.state)
      .then(txHash => {
        this.setState({
          txState: this.FORM_STATE.TX_SENT,
          txHash
        });
      })
      .catch(console.error);
  }

  render() {
    let { buttonText } = this.props;
    let { txState, txHash } = this.state;
    const { transactions, TX_STATUS } = this.props.stores.transactionsStore;
    const tx = transactions.get(txHash);

    return (
      <>
        {txHash &&
          <div className="tx-hash">Transaction: {txHash}</div>
        }

        {txState === this.FORM_STATE.INITIAL &&
          <button onClick={() => this.doChallenge()}>{buttonText}</button>
        }

        {(txState === this.FORM_STATE.TX_SIGNING || txState === this.FORM_STATE.TX_SENT) &&
          <div className="tx-status">
            {txState === this.FORM_STATE.TX_SIGNING &&
              <Spinner text="Signing transaction..."/>
            }
            {(tx && tx.status === TX_STATUS.PENDING) &&
              <Spinner text="Pending transaction..."/>
            }
            {(tx && tx.status === TX_STATUS.SUCCESS) &&
              <span className="success">Transaction succeeded</span>
            }
            {(tx && tx.status === TX_STATUS.FAILURE) &&
              <span className="failure">Transaction failed</span>
            }
            {(tx && (tx.status === TX_STATUS.SUCCESS || tx.status === TX_STATUS.FAILURE)) &&
              <span
                className="close-window"
                onClick={this.props.stores.modalStore.modalClose}
              >
                &times; Close window
              </span>
            }
          </div>
        }
      </>
    );
  }
}
