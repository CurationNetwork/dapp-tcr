import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { inject, observer } from "mobx-react";

import Table from "../tables/Table";

import "./Tabs.scss";

@inject("stores")
@observer
export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabActive: Number(localStorage.getItem("tabActive")) || 0
    };

    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(n) {
    this.setState({ tabActive: n });
    localStorage.setItem("tabActive", n);
  }

  render() {
    const { registry, TCR_ITEM_STATE } = this.props.stores.tcrStore;

    const existing = registry.filter(
      item => item.state === TCR_ITEM_STATE.EXISTS || item.state === TCR_ITEM_STATE.EDIT
    );
    const applications = registry.filter(item => item.state === TCR_ITEM_STATE.APPLICATION);
    const challenges = registry.filter(item => item.isChallenged);

    const tabHeaders = [
      <>Dapps in Registry&nbsp;&mdash; {existing.length}</>,
      <span className="applications">
        <FontAwesomeIcon icon="pen" /> Applications&nbsp;&mdash;{" "}
        {applications.length}
      </span>,
      <span className="challenges">
        <FontAwesomeIcon icon="ban" /> Challenges&nbsp;&mdash;{" "}
        {challenges.length}
      </span>
    ];

    const tabsContent = [
      <Table itemsData={existing} slice="registry" />,
      <Table itemsData={applications} slice="applications" />,
      <Table itemsData={challenges} slice="challenges" />
    ];

    const { tabActive } = this.state;

    return (
      <div className="block with-tabs">
        <div className="block-tabs">
          {tabHeaders.map((header, i) => (
            <div
              key={`${i}_tab`}
              className={classNames("name", { active: i === tabActive })}
              onClick={this.switchTab.bind(this, i)}
            >
              {header}
            </div>
          ))}

          <div className="name last" />
        </div>

        {tabsContent[tabActive]}
      </div>
    );
  }
}
