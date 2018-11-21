import React from 'react';

import './Spinner.scss';

class Spinner extends React.Component {
  render() {
    const size = this.props.size || '40px';
    const text = this.props.text || 'Something happening...';

    return (
      <div className="spinner-wrapper">
        <div className="spinner" style={{width: size, height: size}}>
          <div className="a1"></div>
          <div className="a2"></div>
        </div>
        <div className="spinner-text">{text}</div>
      </div>
    );
  }
}

export default Spinner;
