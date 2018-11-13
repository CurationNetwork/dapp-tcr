import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from './Modal';
import FormDapp from '../forms/FormDapp';

import './ButtonAddDapp.scss';

export default class ButtonAddDapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    })
  }

  render() {
    return (<>
      <button className="add-dapp" onClick={this.toggleModal}>
        <FontAwesomeIcon icon="plus-square"/> Submit a Dapp
      </button>

      {this.state.isModalOpen &&
        <Modal header="Submit a Dapp" icon="plus-square" close={this.toggleModal}>
          <FormDapp/>
        </Modal>
      }
    </>);
  }
}
