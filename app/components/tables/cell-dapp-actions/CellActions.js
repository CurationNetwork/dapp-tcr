import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

import Modal from '../../common/Modal';
import ModalChallenge from '../../modals/ModalChallenge';

import './CellActions.scss';

function Action(props) {
  const { className, onClick, icon, text } = props;
  return (
    <div>
      <div className="border"></div>
      <div className={className} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>&nbsp;{text}
      </div>
    </div>
  );
}

class RevealLeft extends React.Component {
  componentDidMount() {
    this.interval = window.setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const secondsLeft = this.props.revealEndDate - Math.floor(Date.now() / 1000);
    if (secondsLeft <= 0) return 'finished';

    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
  }
}

@inject('stores')
@observer
export default class CellActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      action: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  ACTIONS = Object.freeze({
    CHALLENGE: 0,
    UPDATE: 1,
    DELETE: 2,
    VOTE_FOR: 3,
    VOTE_AGAINST: 4,
  });

  toggleModal(action = null) {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      action
    });
  }

  handleUpdateStatus() {
    const { updateStatus } = this.props.stores.tcrStore;
    updateStatus(this.props.item.id);
  }

  render() {
    const { item, name, stores } = this.props;
    const { isModalOpen, action } = this.state;
    const { EXISTS } = stores.tcrStore.TCR_ITEM_STATE;
    const userAddress = stores.web3Store.defaultAccount;

    return (
      <div className="actions">
        {item.canBeUpdated &&
          <Action
            icon="sync-alt"
            text="Update status"
            className="update"
            onClick={this.handleUpdateStatus}
          />
        }
        {(!item.canBeUpdated && !item.isChallenged) &&
          <>
            <Action
              icon="ban"
              text="Challenge"
              className="reject"
              onClick={this.toggleModal.bind(this, this.ACTIONS.CHALLENGE)}
            />
            {(item.state === EXISTS) &&
              <Action
                icon="pen"
                text="Apply update"
                className="update"
                onClick={this.toggleModal.bind(this, this.ACTIONS.UPDATE)}
              />
            }
            {(item.owner === userAddress) &&
              <Action
                icon="trash-alt"
                className="reject"
                onClick={this.toggleModal.bind(this, this.ACTIONS.DELETE)}
              />
            }
          </>
        }
        {(!item.canBeUpdated && item.isChallenged && item.challengeStatus) &&
          <>
            {item.challengeStatus.phase === 'commit' && 
              <div className="commit">
                <div className="border"></div>
                <div className="approve" onClick={this.toggleModal.bind(this, 'approve')}>
                  <FontAwesomeIcon icon="check"/> Approve
                  </div>
                <div className="border"></div>
                <div className="reject" onClick={this.toggleModal.bind(this, 'reject')}>
                  <FontAwesomeIcon icon="ban"/> Reject
                </div>
              </div>
            }

            {item.challengeStatus.phase === 'reveal' &&
              <div className="reveal">
                <div className="reveal-inner" onClick={this.toggleModal.bind(this, 'reveal')}>
                  <FontAwesomeIcon icon={['far', 'eye']}/> Reveal&nbsp;
                  <span className="time-left">
                    <RevealLeft revealEndDate={item.challengeStatus.revealEndDate} />
                  </span>
                </div>
              </div>
            }
          </>
        }

        {(isModalOpen && action === this.ACTIONS.CHALLENGE) &&
          <Modal
            type="small"
            icon="ban" 
            header="Challenge DApp application"
            close={this.toggleModal}
          >
            <ModalChallenge item={item} name={name} />
          </Modal>
        }
{/* 
        {type === 'get-reward' && 
          <div className="commit">
            <div className="border"></div>
            <div className="approve" onClick={this.toggleModal.bind(this, 'get-reward')}>
              <FontAwesomeIcon icon="coins"/> Get reward
            </div>
          </div>
        }

        {type === 'loose' && 
          <div className="commit">
            <div className="border"></div>
            <div className="loose">You loose :(</div>
            <div className="close">&times; close</div>
          </div>
        } 

        {type === 'registry' &&
          <div className="commit">
            <div className="border"></div>
            {(subtype === 'EDIT') &&
              <div className="approve" onClick={this.toggleModal.bind(this, 'update')}>
                <FontAwesomeIcon icon="pen"/> Decline Update
              </div>
            }
            {(subtype === 'APPLICATION' || subtype === 'EXISTS') &&
              <div className="reject" onClick={this.toggleModal.bind(this, 'challenge')}>
                <FontAwesomeIcon icon="ban"/> Challenge
              </div>
            }
          </div>
        }
*/}
      </div>
    );        
  }
}
