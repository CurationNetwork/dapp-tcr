import React from 'react';
import Form from "react-jsonschema-form";
import { spec } from './spec.js';

class ItemForm extends React.Component {
  render() {
    const onSubmit = ({formData}) => console.log("Data submitted: ",  formData);

    return (<div>
      {/* Do not touch this*/}
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"/>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
      {/* END Do not touch this*/}

      <Form schema={spec} onSubmit={onSubmit} />
    </div>);
  }
}

export default ItemForm;
