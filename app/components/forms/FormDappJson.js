import React from 'react';
import { inject, observer } from 'mobx-react';

import './FormDappJson.scss';

@inject('stores')
@observer
export default class FormDappHash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonInputError: false,
      label: 'Upload a DApp JSON schema file',
      file: undefined
    };

    this.handleJsonSubmit = this.handleJsonSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);

    this.jsonInput = React.createRef();
  }

  handleJsonSubmit(e) {
    e.preventDefault();
    const { setFormData } = this.props.stores.formsStore;

    const f = this.jsonInput.current.files[0];
    if (!f) return null;

    const fr = new FileReader();
    fr.onload = (ee) => {
      try {
        setFormData('form-dapp', JSON.parse(ee.target.result));
        this.setState({
          jsonInputError: false,
          label: 'Schema uploaded',
          file: undefined
        });
        this.jsonInput.current.value = '';

      } catch (ee) {
        this.setState({jsonInputError: true});
      }
      
    };

    fr.readAsText(f);
  }

  handleFileChange(e) {
    this.setState({file: e.target.files[0].name});
  }

  render() {
    const { file, label } = this.state;
    return (
      <form className="form-dapp-json modal-form" onSubmit={this.handleJsonSubmit}>
        <div>
          <input
            id="json-file"
            type="file"
            ref={this.jsonInput}
            onChange={this.handleFileChange}
          />

          <label
            htmlFor="json-file"
            className={(file || label === 'Schema uploaded') ? 'active': ''}>
            {file || label}
          </label>

          {this.state.jsonInputError &&
            <div className="error-detail">
              <p className="text-danger">Valid JSON file required</p>
            </div>
          }
        </div>

        <p><button>Upload</button></p>
      </form>
    );
  }
}
