import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

import Modal from '../../common/Modal';
import ModalChallenge from '../../modals/ModalChallenge';
import ModalVote from '../../modals/ModalVote';
import { leftUntil } from '../../../helpers/time-utils';

import './CellActions.scss';

function Action(props) {
  const { className, onClick, icon, text } = props;
  return (
    <>
      <div className="border"></div>
      <div className={className} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>&nbsp;{text}
      </div>
    </>
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
    return leftUntil(this.props.revealEndDate);
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
    REVEAL: 5,
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
        <div>
          <Action
            icon="check"
            text="Keep"
            className="approve"
            onClick={this.toggleModal.bind(this, this.ACTIONS.VOTE_FOR)}
          />
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
                <>
                  <Action
                    icon="pen"
                    text="Apply update"
                    className="update"
                    onClick={this.toggleModal.bind(this, this.ACTIONS.UPDATE)}
                  />
                  {(item.owner === userAddress) &&
                    <Action
                      icon="trash-alt"
                      className="reject"
                      onClick={this.toggleModal.bind(this, this.ACTIONS.DELETE)}
                    />
                  }
                </>
              }
            </>
          }
          {(!item.canBeUpdated && item.isChallenged && item.challengeStatus) &&
            <>
              {item.challengeStatus.phase === 'commit' &&
                <>
                  <Action
                    icon="check"
                    text="Keep"
                    className="approve"
                    onClick={this.toggleModal.bind(this, this.ACTIONS.VOTE_FOR)}
                  />
                  <Action
                    icon="ban"
                    text="Kick"
                    className="reject"
                    onClick={this.toggleModal.bind(this, this.ACTIONS.VOTE_AGAINST)}
                  />
                </>
              }
              {item.challengeStatus.phase === 'reveal' &&
                <Action
                  icon={['far', 'eye']}
                  text={
                    <>
                      Reveal&nbsp;
                      <span className="time-left">
                        <RevealLeft revealEndDate={item.challengeStatus.revealEndDate} />
                      </span>
                    </>
                  }
                  className="reveal"
                  onClick={this.toggleModal.bind(this, this.ACTIONS.REVEAL)}
                />
              }
            </>
          }

          {isModalOpen &&
            <>
              {action === this.ACTIONS.CHALLENGE &&
                <Modal
                  type="small"
                  icon="ban"
                  feel="negative"
                  header="Challenge DApp application"
                  close={this.toggleModal}
                  children={
                    <ModalChallenge item={item} name={name} />
                  }
                />
              }
              {(action === this.ACTIONS.VOTE_FOR) &&
                <Modal
                  type="small"
                  icon="check"
                  feel="positive"
                  header="Vote to keep the DApp"
                  close={this.toggleModal}
                  children={
                    <ModalVote item={item} name={name} />
                  }
                />
              }
              {(action === this.ACTIONS.VOTE_AGAINST) &&
                <Modal
                  type="small"
                  icon="ban"
                  feel="negative"
                  header="Vote to kick the DApp"
                  close={this.toggleModal}
                  children={
                    <ModalVote item={item} name={name} />
                  }
                />
              }
            </>
          }
        </div>
      </div>
    );
  }
}
