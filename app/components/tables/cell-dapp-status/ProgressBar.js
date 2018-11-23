import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('stores')
@observer
export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.calcPassedPercent = this.calcPassedPercent.bind(this);
  }

  componentDidMount() {    
    this.calcPassedPercent();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  calcPassedPercent() {
    const { stageEndTime, stores } = this.props;
    const applyStageLen = stores.parametrizerStore.tcrParameters.get('applyStageLen');

    let passedPercent = 0;
    if (stageEndTime) {
      const timeDiff = stageEndTime - Math.round(Date.now() / 1000);
      passedPercent = timeDiff < 0
        ? 100
        : Math.round(100 * (1 - timeDiff / applyStageLen));
      if (passedPercent < 0) passedPercent = 0;

      if (passedPercent < 100 && !this.interval) {
        this.interval = setInterval(this.calcPassedPercent, 3000);
      }  
    } else {
      setTimeout(this.calcPassedPercent, 300);
    }

    this.setState({passedPercent});
  }

  render() {
    const { passedPercent } = this.state;

    return (
      <div className="progress-bar">
        {passedPercent > 0 &&
          <div className="filled" style={{flexGrow: passedPercent}}></div>
        }
        {passedPercent < 100 &&
          <div className="empty" style={{flexGrow: 100 - passedPercent}}></div>
        }
      </div>
    );
  }
}
