import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";
import { inject, observer } from 'mobx-react';

import IpfsUploadWidget from './widgets/IpfsUploadWidget.jsx';
import TagsWidget from './widgets/TagsWidget.jsx';

import './FormDapp.scss';

const dappSchema = require('../../../schema/dapp-schema-v0.2.1.json');
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';

@inject('stores')
@observer
class FormDapp extends React.Component {
  onSubmit(formData) {    
    axios.post(uploadEndpoint + '/ipfs/', JSON.stringify(formData))
      .then(resp => {
        const uploadedIPFSHash = resp.headers['ipfs-hash'];
        const bytesHash = '0x' + Buffer.from(uploadedIPFSHash).toString('hex');
        apply(bytesHash);
      });
  };

  render() {
    const { apply } = this.props.stores.tcrStore;

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
        },
        "website": {
          "ui:placeholder": "https://",
        },
        "github": {
          "ui:placeholder": "https://github.com/",
        },
        "logo": {
          "ui:widget": "ipfsUploadWidget",
        },
        "images": {
          "items": {
            "ui:widget": "ipfsUploadWidget",
          }
        }
      },
      "smartContracts": {
        "items": {
          "standards": {
            "ui:field": "tagsWidget"
          }
        }
      }
    };

    // const formData = {
    //   metadata: {
    //     tags: [
    //       'test1',
    //       'test2'
    //     ]
    //   },
    // };

    return (
      <Form
        schema={dappSchema}
        uiSchema={uiSchema}
        widgets={widgets}
        fields={fields}
        onSubmit={this.onSubmit.bind(this)}
        onError={this.onSubmit.bind(this)}
        showErrorList={false}
      />
    );
  }
}

export default FormDapp;
