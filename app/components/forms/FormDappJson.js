import React from 'react';
import { inject, observer } from 'mobx-react';

import './FormDappJson.scss';

@inject('stores')
@observer
export default class FormDappHash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonInputError: false
    };

    this.handleJsonSubmit = this.handleJsonSubmit.bind(this);
    this.jsonInput = React.createRef();
  }

  handleJsonSubmit(e) {
  const { setFormData } = this.props.stores.formsStore;

    e.preventDefault();

    const f = this.jsonInput.current.files[0];
    const fr = new FileReader();
    fr.onload = (e) => {
      setFormData('form-dapp', JSON.parse(e.target.result));
    };
    fr.readAsText(f);
  }

  render() {
    return (
      <form className="form-dapp-json modal-form" onSubmit={this.handleJsonSubmit}>
        <div>
          <input
            type="file"
            placeholder="IPFS hash of DApp JSON Schema"
            ref={this.jsonInput}
          />
          {this.state.jsonInputError &&
            <div className="error-detail">
              <p className="text-danger">Valid IPFS-hash required</p>
            </div>
          }
        </div>
        <p><button>Upload</button></p>
      </form>
    );
  }
}
