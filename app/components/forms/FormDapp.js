import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";
import { inject, observer } from 'mobx-react';

import IPFSUploadWebGatewayWidget from './IPFSUploadWebGateway.jsx'

import './FormDapp.scss';

const dappSchema = require('../../../schema/dapp-schema-v0.2.0.json');
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';

@inject('stores')
@observer
class FormDapp extends React.Component {
  onSubmit({formData}) {
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
      ipfsUploadWidget: IPFSUploadWebGatewayWidget
    };

    let uiSchema = {
      "metadata": {
        "logo" : { "ui:widget": "ipfsUploadWidget" },
        "images": {
          "items": {
            "ui:widget": "ipfsUploadWidget"
          }
        }
      }
    };
    dappSchema.properties.version.properties.current['default'] = '0.1.0';
    dappSchema.properties.metadata.properties.name['default'] = 'Default Name';

    return (
      <Form
        schema={dappSchema}
        uiSchema={uiSchema}
        widgets={widgets}
        onSubmit={this.onSubmit.bind(this)}
      />
    );
  }
}

export default FormDapp;
