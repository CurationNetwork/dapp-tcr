import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ItemForm from '../forms/ItemForm';
import FormChallenge from '../forms/FormChallenge';
import Modal from './Modal';

import './ModalDapp.scss';

class ModalDapp extends React.Component {
  shouldComponentUpdate() {
    return !this.props.isOpen;
  }

  render() {
    const {action, item, close} = this.props;
    return null;
    return (
      <Modal close={close}>
        <div className="modal-dapp">
          {!action && <>
            <div className="modal-h"><FontAwesomeIcon icon="plus-square"/> Submit a Dapp</div>
            <ItemForm/>
          </>}

          {/* {action === 'challenge' && <>
            <div className="modal-h challenge"><FontAwesomeIcon icon="ban"/> Challenge a Dapp</div>
            <FormChallenge buttonText="Start challenge" item={item}/>
          </>}

          {action === 'approve' && <>
            <div className="modal-h approve"><FontAwesomeIcon icon="check"/> Vote for approve</div>
            <FormChallenge buttonText="Vote"/>
          </>}

          {action === 'reject' && <>
            <div className="modal-h reject"><FontAwesomeIcon icon="ban"/> Vote for reject</div>
            <FormChallenge buttonText="Vote"/>
          </>}

          {action === 'reveal' && <>
            <div className="modal-h reveal"><FontAwesomeIcon icon="eye"/> Reveal your vote</div>
            <FormChallenge buttonText="Reveal vote"/>
          </>}

          {action === 'get-reward' && <>
            <div className="modal-h get-reward"><FontAwesomeIcon icon="coins"/> Get reward</div>
            <FormChallenge buttonText="Get reward"/>
          </>}

          {action === 'update' && <>
            <div className="modal-h update"><FontAwesomeIcon icon="pen"/> Submit an update</div>
            <ItemForm/>
          </>} */}
        </div>
      </Modal>
    );
  }
}

export default ModalDapp;
