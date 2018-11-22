import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';

import Tab from './Tab';

import './Tabs.scss';

@inject('stores')
@observer
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
    const { registry } = this.props.stores.tcrStore;

    const existing = registry.filter(item => (item.state === 'EXISTS' || item.state === 'EDIT'));
    const applications = registry.filter(item => item.state === 'APPLICATION');
    const challenges = registry.filter(item => item.isChallenged);

    const tabHeaders = [
      <>
        Dapps in Registry&nbsp;&mdash; {existing.length}
      </>,
      <span className="applications">
        <FontAwesomeIcon icon="pen"/> Applications&nbsp;&mdash; {applications.length}
      </span>,
      <span className="challenges">
        <FontAwesomeIcon icon="ban"/> Challenges&nbsp;&mdash; {challenges.length}
      </span>
    ];

    const tabsContent = [
      <Tab data={existing} slice="registry"/>,
      <Tab data={applications} slice="applications"/>,
      <Tab data={challenges} slice="challenges"/>
    ];

    const { tabActive } = this.state;

    return (<div className="block with-tabs">
      <div className="block-tabs">
        {tabHeaders.map((header, i) => (
          <div
            className={classNames('name', {active: i === tabActive})}
            key={`${i}_tab`} onClick={this.switchTab.bind(this, i)}
          >
            {header}
          </div>
        ))}

        <div className="name last"></div>
      </div>

      {tabsContent[tabActive]}
    </div>);
  }
}
