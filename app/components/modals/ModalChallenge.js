import React from 'react';
import { inject, observer } from 'mobx-react';

import FormChallenge from '../forms/FormChallenge';

import './ModalChallenge.scss';

@inject('stores')
@observer
export default class ModalChallenge extends React.Component {
  render() {
    const { item, name, stores } = this.props;
    const { parametrizerStore, tokenStore} = stores;
    const { tcrParameters } = parametrizerStore;

    const formatMinDeposit = `${tokenStore.weiToTokens(tcrParameters.get('minDeposit'))} ${tokenStore.symbol}`;
    const paramsTable = [
      ['Deposit to start challenge', formatMinDeposit],
      ['Voting stages duration', `${tcrParameters.get('commitStageLen')}s commit, ${tcrParameters.get('revealStageLen')}s reveal`],
      ['Majority to win', `${tcrParameters.get('voteQuorum')}%`]
    ];
    return (
      <div className="modal-challenge">
        <div className="action-description">
          You are going to start voting process for/against application:
          <br/><b>{name}.</b>
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
        <div className="p-bold">Token deposit <span>Lost if you lose</span></div>
        <div className="p-thin">If the majority of voters will stake against you, you will completely lose this tokens.</div>
        <div className="sum">{formatMinDeposit}</div>
        <div className="big-button">
          <FormChallenge
            buttonText="Start challenge"
            item={item}
          />
        </div>
      </div>
    );
  }
}
