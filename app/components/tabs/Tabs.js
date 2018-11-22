import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import TabRegistry from './tab-registry/TabRegistry';
import TabApplications from './tab-applications/TabApplications';
import TabChallenges from './tab-challenges/TabChallenges';

import './Tabs.scss';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabActive: Number(localStorage.getItem('tabActive')) || 0
    };

    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(n) {
    this.setState({tabActive: n});
    localStorage.setItem('tabActive', n);
  }

  render() {
    this.tabContent = [
      <TabRegistry {...this.props}/>,
      <TabApplications {...this.props}/>,
      <TabChallenges {...this.props}/>
    ];

    this.tabHeaders = [
      <>
        Dapps in Registry&nbsp;&mdash;&nbsp;
        {this.props.data.filter(item => item.state === 'EXISTS').length}
      </>,
      <span className="applications">
        <FontAwesomeIcon icon="pen"/> Applications&nbsp;&mdash;&nbsp;
        {this.props.data.filter(
          item => (item.state === 'APPLICATION' || item.state === 'EDIT')).length
        }
      </span>,
      <span className="challenges">
        <FontAwesomeIcon icon="ban"/> Challenges&nbsp;&mdash;&nbsp;
        {this.props.data.filter(item => item.isChallenged).length}
      </span>
    ];

    const { tabActive } = this.state;

    return (<div className="block with-tabs">
      <div className="block-tabs">
        {this.tabHeaders.map((header, i) => (
          <div
            className={classNames('name', {active: i === tabActive})}
            key={`${i}_tab`} onClick={this.switchTab.bind(this, i)}
          >
            {header}
          </div>
        ))}

        <div className="name last"></div>
      </div>

      {this.tabContent[this.state.tabActive]}
    </div>);
  }
}
