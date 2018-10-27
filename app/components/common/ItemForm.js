import React from 'react';
import Form from "react-jsonschema-form";
import { spec } from './spec.js';

class ItemForm extends React.Component {
  render() {
    const onSubmit = ({formData}) => console.log("Data submitted: ",  formData);

    return (<div>
      <Form schema={spec} onSubmit={onSubmit} />
    </div>);
  }
}

export default ItemForm;
