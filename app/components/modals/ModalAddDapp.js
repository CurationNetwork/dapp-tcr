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
        <p>1. If you already have uploaded your DApp Schema to IPFS, just submit it's IPFS-hash and send an application to the TCR at once:</p>
        <FormDappHash/>
        <p>2. If you have a completed or partially completed DApp Schema, upload it to the following form, finalize it if necessary and submit:</p>
        <FormDappJson/>
        <p>3. Start you DApp Schema from scratch in the following form, complete it step by step and submit. It will be uploaded to the IPFS and IPFS-hash will be automatically sent to the TCR in the application.</p>
      </div>
      <FormDapp/>
    </>);
  }
}
