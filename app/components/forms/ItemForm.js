import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";
import IPFSUploadWebGatewayWidget from './IPFSUploadWebGateway.jsx'
const main_schema = require('../../../schema/main-spec-v0.1.0.json');

let module_schemas = {};
module_schemas['contact'] = require('../../../schema/module-contact-spec-v0.1.0.json');
module_schemas['ontology'] = require('../../../schema/module-ontology-spec-v0.1.0.json');
module_schemas['standard'] = require('../../../schema/module-standard-spec-v0.1.0.json');

class ItemForm extends React.Component {
  
  render() {
	// MERGING SCHEMAS
	for (module in module_schemas) {
		for (let k in module_schemas[module]) {
			if (k == 'definitions') {
				for (let kk in module_schemas[module]['definitions']) {
					if (kk in main_schema['definitions']) {
						console.log("Error, key '" + k + "' already exists in main_schema.definitions");
						continue;
					}
					main_schema['definitions'][kk] = module_schemas[module]['definitions'][kk];
				}
				delete module_schemas[module]['definitions'];
			}
			main_schema['properties'][module] = module_schemas[module];
		}
	}

    const onSubmit = ({formData}) => {
		console.log("FORM SUBMIT!");
		console.log(formData);
	}

	const widgets = {
        ipfsUploadWidget: IPFSUploadWebGatewayWidget
    }

	let uiSchema = {
		"metadata": {
			"images": {
				"items": {
					"ui:widget": "ipfsUploadWidget"
				}
			}
		}
	};

    return (<div>
      <Form schema={main_schema} uiSchema={uiSchema} widgets={widgets} onSubmit={onSubmit} />
    </div>);
  }
}

export default ItemForm;
