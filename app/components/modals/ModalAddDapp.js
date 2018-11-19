import React from 'react';

import FormDapp from '../forms/FormDapp';
import FormDappHash from '../forms/FormDappHash';
import FormDappJson from '../forms/FormDappJson';

import './ModalAddDapp.scss';

export default class ModalAddDapp extends React.Component {
  render() {
    return (<>
      <div className="submit-dapp">
        <p>You can do this in 3 ways:</p>
        <p>1. Submit an IPFS-hash of a DApp JSON Schema and send it to TCR at once:</p>
        <FormDappHash/>
        <p>2. Upload a completed or partially completed DApp JSON Schema to following form, finalize it if necessary and then submit:</p>
        <FormDappJson/>
        <p>3. Fill the following form step by step and submit:</p>
      </div>
      <FormDapp/>
    </>);
  }
}
