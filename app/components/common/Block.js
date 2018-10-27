import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import './Block.scss';

class Block extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minimized: localStorage.getItem(`${props.name}_minimized`)  === 'true'
    }

    this.toggleMinimize = this.toggleMinimize.bind(this);
  }

  toggleMinimize() {
    const minimized = !this.state.minimized;

    this.setState({minimized});
    localStorage.setItem(`${this.props.name}_minimized`, minimized);
  }

  render() {
    const { icon, name, children, type } = this.props;
    const { minimized } = this.state;

    return (<div className={classNames('block', {minimized})}>
      <div className="block-header">
        <div className="name">
          {icon &&
            <><FontAwesomeIcon icon={icon}/>&nbsp;</>
          }
          {name}
          {(minimized || type === 'registry') &&
            <>&nbsp;&mdash; {React.Children.count(children) - 1}</>
          }
        </div>

        {type !== 'registry' &&
          <div className="minimize" onClick={this.toggleMinimize}>
            <FontAwesomeIcon icon={['far', 'window-minimize']}/>
          </div>
        }
      </div>

      {!minimized &&
        children
      }
    </div>);
  }
}

export default Block;
