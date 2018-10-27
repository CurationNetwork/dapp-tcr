import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import TabRegistry from './TabRegistry';
import TabApplications from './TabApplications';
import TabChallenges from './TabChallenges';

import './Block.scss';

class Block extends React.Component {
  constructor(props) {
    super(props);

    const { children, applications, challenges } = props;

    
    this.state = {
      tabActive: Number(localStorage.getItem('tabActive')) || 0
    }

    this.tabHeaders = [
      <>Dapps in Registry&nbsp;&mdash; {React.Children.count(children)}</>,
      <span className="applications">
        <FontAwesomeIcon icon="pen"/> Applications&nbsp;&mdash; {React.Children.count(applications)}
      </span>,
      <span className="challenges">
        <FontAwesomeIcon icon="ban"/> Challenges&nbsp;&mdash; {React.Children.count(challenges)}
      </span>
    ];

    this.tabContent = [<TabRegistry/>, <TabApplications/>, <TabChallenges/>];

    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(n) {
    this.setState({tabActive: n});
    localStorage.setItem('tabActive', n);
  }

  render() {
    const { tabActive } = this.state;

    return (<div className="block with-tabs">
      <div className="block-tabs">
        {this.tabHeaders.map((header, i) => (
          <div className={classNames('name', {active: i === tabActive})}
            key={`${i}_tab`} onClick={this.switchTab.bind(this, i)}>

            {header}
          </div>
        ))}
        <div className="name last"></div>
      </div>

      {this.tabContent[this.state.tabActive]}
    </div>);
  }
}

export default Block;
