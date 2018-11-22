import React from 'react';

import './TableHeader.scss';

class TableHeader extends React.Component {
  render() {
    const { type } = this.props;

    return (<>
      <div className="dapp-name-header">
        {type === 'registry'
          ? 'Name'
          : type === 'applications'
            ? 'Applicant'
            : 'Defendant'}
      </div>
      <div className="dapp-status-header">Status</div>
      <div className="actions-header"><div>Actions</div></div>
    </>);
  }
}

export default TableHeader;
