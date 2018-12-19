import React from 'react';
import { inject, observer } from 'mobx-react';

import FormVote from '../forms/FormVote';

import './ModalVote.scss';

@inject('stores')
@observer
export default class ModalVote extends React.Component {
  constructor(props) {
    super(props);

    this.handleStakeChange = this.handleStakeChange.bind(this);

    const { tcrParameters } = this.props.stores.parametrizerStore;
    this.state = {
      stakeAmount: tcrParameters.get('minDeposit') / 10,
    };
  }

  handleStakeChange(e) {
    const { tokenStore } = this.props.stores;
    let { value } = e.target;

    this.setState({
      stakeAmount: tokenStore.tokensToWei(value),
    });
  }

  render() {
    const { item, name, stores } = this.props;
    const { parametrizerStore, tokenStore } = stores;
    const { tcrParameters } = parametrizerStore;
    const { stakeAmount } = this.state;

    const paramsTable = [
      ['Deposit to vote', 'any amount'],
      ['Voting stages duration', `${tcrParameters.get('commitStageLen')}s commit, ${tcrParameters.get('revealStageLen')}s reveal`],
      ['Majority to win', `${tcrParameters.get('voteQuorum')}%`],
      ['Dispensation percent', `${tcrParameters.get('dispensationPct')}%`],
    ];
    const dicp = tokenStore.weiToTokens(stakeAmount) / 100 * tcrParameters.get('dispensationPct');
    return (
      <div className="modal-challenge">
        <div className="action-description">
          You are going to participate in resolving the challenge by voting for the registry element <b>{name}</b> or against it.
        </div>
        <div className="params-table">
          <table>
            <tbody>
              {paramsTable.map(v => (
                <tr key={v}>
                  {v.map(vv => (
                    <td key={vv}>{vv}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-bold">Voting stake <span className="positive">Freezed while voting</span></div>
        <div className="p-thin">If the majority of voters will stake opposite your vote, you will lose this amount of tokens.</div>
        <div className="modal-form">
          <input
            type="number"
            value={tokenStore.weiToTokens(stakeAmount)}
            onChange={this.handleStakeChange}
          />
          <span className="units">{tokenStore.symbol}</span>
        </div>
        <div className="p-bold">Dispensation <span>Lost if you lose</span></div>
        <div className="p-thin">If the majority of voters will stake opposite your vote, you will lose this amount of tokens.</div>
        <div className="sum">
          {`${dicp} ${tokenStore.symbol}`}
        </div>
        <div className="big-button">
          <FormVote
            buttonText="Vote"
            buttonTimer={item.challengeStatus
              ? item.challengeStatus.commitEndDate.toNumber()
              : null
            }
            item={item}
            formData={{stakeAmount}}
          />
        </div>
      </div>
    );
  }
}
