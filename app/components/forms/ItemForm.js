import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";
import { inject, observer } from 'mobx-react';

import IPFSUploadWebGatewayWidget from './IPFSUploadWebGateway.jsx'
const main_schema = require('../../../schema/main-spec-v0.1.0.json');
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';

// SKIP additional modules for hackathon
//let module_schemas = {};
// module_schemas['contact'] = require('../../../schema/module-contact-spec-v0.1.0.json');
// module_schemas['ontology'] = require('../../../schema/module-ontology-spec-v0.1.0.json');
// module_schemas['standard'] = require('../../../schema/module-standard-spec-v0.1.0.json');

@inject('stores')
@observer
class ItemForm extends React.Component {
  render() {
	// MERGING SCHEMAS (if any modules)
	// for (module in module_schemas) {
	// 	for (let k in module_schemas[module]) {
	// 		if (k == 'definitions') {
	// 			for (let kk in module_schemas[module]['definitions']) {
	// 				if (kk in main_schema['definitions']) {
	// 					console.log("Error, key '" + k + "' already exists in main_schema.definitions");
	// 					continue;
	// 				}
	// 				main_schema['definitions'][kk] = module_schemas[module]['definitions'][kk];
	// 			}
	// 			delete module_schemas[module]['definitions'];
	// 		}
	// 		main_schema['properties'][module] = module_schemas[module];
	// 	}
	// }
  const { apply } = this.props.stores.tcrStore;

	let uploadedIPFSHash = null;

  const onSubmit = ({formData}) => {
    axios.post(uploadEndpoint + '/ipfs/', JSON.stringify(formData))
      .then(resp => {
        uploadedIPFSHash = resp.headers['ipfs-hash'];
        let bytesHash = '0x' + Buffer.from(uploadedIPFSHash).toString('hex');
        apply(bytesHash);
      });
	};

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
	main_schema.properties.spec_version['default'] = '0.1.0';
	main_schema.properties.metadata.properties.name['default'] = 'Default Name';
	main_schema.properties.prev_meta['default'] = '';

    return (<div>
      <Form schema={main_schema} uiSchema={uiSchema} widgets={widgets} onSubmit={onSubmit} />
    </div>);
  }
}

export default ItemForm;
