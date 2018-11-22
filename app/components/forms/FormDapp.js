import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";
import { inject, observer } from 'mobx-react';

import IpfsUploadWidget from './widgets/IpfsUploadWidget.jsx';
import TagsWidget from './widgets/TagsWidget.jsx';
import Spinner from '../common/Spinner';
import { dappSchema } from '../../helpers/get-schema';

import './FormDapp.scss';

const uploadEndpoint = 'https://ipfs.smartz.io';

@inject('stores')
@observer
export default class FormDapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formStatus: 'filling'
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleApplyResult = this.handleApplyResult.bind(this);
  }

  handleFormSubmit({ formData }) {
    this.setState({formStatus: 'uploading-to-ipfs'});

    this.props.stores.formsStore.setFormData(formData);

    axios.post(uploadEndpoint + '/ipfs/', JSON.stringify(formData))
      .then(resp => {
        const uploadedIPFSHash = resp.headers['ipfs-hash'];
        this.setState({
          formStatus: 'sending-tx',
          ipfsHash: uploadedIPFSHash
        });

        const bytesHash = '0x' + Buffer.from(uploadedIPFSHash).toString('hex');        
        this.props.stores.tcrStore.apply(bytesHash, res => this.handleApplyResult(res));
      });
  };

  handleApplyResult(res) {    
    if (typeof res === 'object' && res.name === 'Error') {
      this.setState({formStatus: 'failure'});
    } else {
      this.setState({
        tx: res,
        formStatus: 'success'
      });
    }
  }

  render() {
    const widgets = {
      ipfsUploadWidget: IpfsUploadWidget,
    };

    const fields = {
      tagsWidget: TagsWidget
    };

    const uiSchema = {
      "previousSchema": {
        "ui:widget": "hidden",
      },
      "metadata": {
        "name": {
          "ui:placeholder": "Fancy dapp name",
        },
        "description": {
          "ui:widget": "textarea",
          "ui:options": {
            "rows": 5
          },
        },
        "version": {
          "ui:placeholder": "1.0.0",
        },
        "releaseNotes": {
          "ui:widget": "textarea",
          "ui:options": {
            "rows": 5
          },
        },
        "categories": {
          "items": {
            "ui:placeholder": "Choose one",
          },
          "ui:widget": "checkboxes",
        },
        "tags": {
          "ui:field": "tagsWidget",
          "ui:description": "Split tags by comma or just hit enter",
        },
        "website": {
          "ui:placeholder": "https://...",
        },
        "github": {
          "ui:placeholder": "https://github.com/...",
        },
        "logo": {
          "ui:widget": "ipfsUploadWidget",
          "ui:description": "IPFS hash of the DApp logo. Image is loading to IPFS magically from this form",
        },
        "images": {
          "ui:description": "IPFS hashes of additional images for DApp (screenshots, schemas, etc.). Images are loading to IPFS magically from this form",
          "items": {
            "ui:widget": "ipfsUploadWidget",
          }
        }
      },
      "smartContracts": {
        "items": {
          "standards": {
            "ui:field": "tagsWidget",
            "ui:description": "Array of ERC standard numbers, supported by smart contract. Like tags, split standards by comma or just hit enter"
          }
        }
      }
    };

    const formData = this.props.stores.formsStore.formsData.get('form-dapp');
    let { formStatus, tx, ipfsHash } = this.state;

    const { transactions } = this.props.stores.transactionsStore;
    if (tx) {
      formStatus = transactions.get(tx).status;
    }

    return (
      <Form
        schema={dappSchema}
        uiSchema={uiSchema}
        widgets={widgets}
        fields={fields}
        formData={formData}
        onSubmit={this.handleFormSubmit}
        onError={(e) => console.error(e)}
        showErrorList={false}
      >
        {(formStatus === 'filling' || formStatus === 'failure') &&
          <p><button type="submit" className="btn btn-info">Submit</button></p>
        }

        {(ipfsHash || tx) &&
          <div className="submit-results">
            {ipfsHash &&
              <p>IPFS hash: {ipfsHash}</p>
            }
            {tx &&
              <p>Transaction: {tx}</p>
            }
          </div>
        }

        {formStatus !== 'filling' &&
          <div className="submit-status">
            {formStatus === 'uploading-to-ipfs' &&
              <Spinner text="Uploading scheme to IPFS..."/>
            }
            {formStatus === 'sending-tx' &&
              <Spinner text="Sending transaction to the TCR contract..."/>
            }
            {formStatus === 'pending' &&
              <Spinner text="Pending transaction..."/>
            }
            {(formStatus === 'success' || formStatus === 'failure') &&
              <>
                <span className={formStatus}>
                  {formStatus === 'success' 
                    ? 'Application successfully submitted to the TCR.'
                    : 'Transaction failure :-('
                  }
                </span>

                {formStatus === 'success' && 
                  <span
                    className="close-window"
                    onClick={this.props.stores.modalStore.modalClose}
                  >
                    &times; Close window
                  </span>
                }
              </>
            }
          </div>
        }
      </Form>
    );
  }
}
