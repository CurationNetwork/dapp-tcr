import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CellActions.scss';

class CellActions extends React.Component {
  render() {
    const { type, challenges } = this.props;

    return (<div className="actions">
      {type === 'challenge' && 
        <div className="challenge">
          <div className="border"></div>
          <div className="reject"><FontAwesomeIcon icon="ban"/> Challenge to reject</div>
        </div>
      }

      {type === 'commit' && 
        <div className="commit">
          <div className="border"></div>
          <div className="approve"><FontAwesomeIcon icon="check"/> Approve</div>
          <div className="border"></div>
          <div className="reject"><FontAwesomeIcon icon="ban"/> Reject</div>
        </div>
      }

      {type == 'reveal' &&
        <div className="reveal">
          <div className="reveal-inner">
            <FontAwesomeIcon icon={['far', 'eye']}/> Reveal
            &nbsp;<span className="time-left">14:01 left</span>
          </div>
        </div>
      }

      {type === 'get-reward' && 
        <div className="commit">
          <div className="border"></div>
          <div className="approve"><FontAwesomeIcon icon="coins"/> Get reward</div>
        </div>
      }

      {type === 'loose' && 
        <div className="commit">
          <div className="border"></div>
          <div className="loose">You loose :(</div>
          <div className="close">&times; close</div>
        </div>
      }

      {type === 'registry' &&
        <div className="commit">
          <div className="border"></div>
          {(!Array.isArray(challenges) || challenges.indexOf('update') === -1) &&
            <div className="approve"><FontAwesomeIcon icon="pen"/> Update</div>
          }
          {(!Array.isArray(challenges) || challenges.indexOf('remove') === -1) &&
            <>
              {!Array.isArray(challenges) && <div className="border"></div>}
              <div className="reject"><FontAwesomeIcon icon="ban"/> Remove</div>
            </>
          }
        </div>
      }
    </div>);        
  }
}

export default CellActions;
