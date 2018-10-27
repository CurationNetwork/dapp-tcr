import React from 'react';

import ModalContainer from './ModalContainer';
import ItemForm from '../forms/ItemForm';

import './ModalDapp.scss';

class ModalDapp extends React.Component {
  render() {
    return (
      <ModalContainer
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}>
        <div className="modal-dapp">
          <ItemForm/>
        </div>
      </ModalContainer>
    );
  }
}

export default ModalDapp;
