import React from 'react';

import './TableHeader.scss';

class TableHeader extends React.Component {
  render() {
    const { type } = this.props;

    if (type === 'submitted') {
      return (<>
        <div className="dapp-name-header">Applicant</div>
        <div className="dapp-status-header">Status</div>
        <div className="actions-header"><div>Actions</div></div>
      </>);
    }
  }
}

export default TableHeader;
