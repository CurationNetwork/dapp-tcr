import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faPenSquare, faPlusSquare, faMinusSquare, faBan } from '@fortawesome/free-solid-svg-icons';
import { faWindowMinimize } from '@fortawesome/free-regular-svg-icons';
library.add(faWindowMinimize, faPenSquare, faPlusSquare, faMinusSquare, faBan);

import Dapp from './components/Dapp';

import './styles/fonts.scss';
import './styles/reset.scss';

class App extends React.Component {

  render() {
    return (<Dapp/>);
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
