import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject } from 'mobx-react';

import Modal from '../../common/Modal';
import ModalChallenge from '../../modals/ModalChallenge';

import './CellActions.scss';

@inject('stores')
export default class CellActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      action: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(action = null) {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      action
    });
  }

  render() {
    const { item, name } = this.props;
    const { isModalOpen, action } = this.state;
    const { TCR_ITEM_STATE } = this.props.stores.tcrStore;

    return (<div className="actions">
      {(item.state === TCR_ITEM_STATE.APPLICATION && !item.isChallenged) &&
        <div className="challenge">
          <div className="border"></div>
          <div className="reject" onClick={this.toggleModal.bind(this, 'challenge')}>
            <FontAwesomeIcon icon="ban"/> Challenge
          </div>
        </div>
      }

      {(isModalOpen && action === 'challenge') &&
        <Modal
          icon="ban" 
          header="Challenge DApp application"
          type="small"
          close={this.toggleModal}
        >
          <ModalChallenge item={item} name={name} />
        </Modal>
      }
{/* 
      {type === 'commit' && 
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

      {type == 'reveal' &&
        <div className="reveal">
          <div className="reveal-inner" onClick={this.toggleModal.bind(this, 'reveal')}>
            <FontAwesomeIcon icon={['far', 'eye']}/> Reveal
            &nbsp;<span className="time-left">14:01 left</span>
          </div>
        </div>
      }

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
          {(subtype === 'EXISTS') &&
            <div className="approve" onClick={this.toggleModal.bind(this, 'update')}>
              <FontAwesomeIcon icon="pen"/> Update
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
    </div>);        
  }
}
