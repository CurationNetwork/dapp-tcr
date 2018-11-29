import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject } from 'mobx-react';
import classNames from 'classnames';

import './Modal.scss';

@inject('stores')
export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.node = undefined;
    this.app = undefined;
    this.closeModal = this.closeModal.bind(this);
    this.onEsc = this.onEsc.bind(this);
  }

  componentWillMount() {
    this.node = document.createElement('div'); // create modal container
    this.node.setAttribute('id', 'modal');
    this.node.setAttribute('class', 'modal-container');
    document.body.appendChild(this.node);

    this.app = document.getElementById('app'); // add sexy backdrop blur
    this.app.style.transition = `filter 200ms ease-out`;
    this.app.style.filter = `blur(4px)`;

    document.addEventListener('keydown', this.onEsc); // catch ESC key
    document.body.classList.add('modal-disable-scroll'); // disable scroll

    this.props.stores.modalStore.setModalClose(this.closeModal);
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-disable-scroll');
    document.removeEventListener('keydown', this.onEsc);
    this.app.style.filter = `blur(0px)`;
    document.body.removeChild(this.node);
    this.props.stores.modalStore.setModalClose(null);
  }

  onEsc(e) {
    if (e.keyCode === 27) this.closeModal(); // 27 - ESC key
  }
  
  closeModal() {
    this.props.close();
  }

  render() {
    const { children, icon, header, type } = this.props;
    
    const content = (
      <div className={classNames("modal-window", {"modal-big": type === 'big'})}>
        <div className="modal-h">
          <FontAwesomeIcon icon={icon}/> {header}
        </div>

        <div className="modal-content">
          {children}
        </div>

        <button
          className="close-cross"
          type="button"
          aria-label="Close"
          onClick={this.closeModal}
        >
          <FontAwesomeIcon icon={['far', 'times-circle']}/>
        </button>
      </div>
    );

    return ReactDOM.createPortal(content, this.node);
  }
}
