import React, { Component, PureComponent } from 'react';
import axios from 'axios';

import './IpfsUploadWidget.scss';

export default class IPFSUploadWebGatewayWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      msg: props.value || 'Choose file',
      url: null,
      uploadEndpoint: 'https://ipfs.smartz.io',
    }

    this.onChange = this.onChange.bind(this);
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = event => reject(event.target.error);
      reader.onloadstart = event => this.setState({ msg: 'Reading...' });
      reader.readAsText(file);
    });
  }

  uploadIpfs(data) {
    return axios.post(this.state.uploadEndpoint + '/ipfs/', data);
  }

  onChange(event) {
    const { onChange } = this.props;
    const file = event.target.files[0];

    if (!file) {
      this.setState({ msg: null }, onChange(null));
    } else {
      this.readFile(file)
        .then(data => {
          this.data = data;
          this.setState({ msg: 'Uploading to IPFS...' });
          return this.uploadIpfs(data)
        })
        .then(resp => {
          const hash = resp.headers['ipfs-hash'];
          this.setState({
            msg: hash,
            ipfs_hash: hash
          }, onChange(this.state.ipfs_hash));
        });
    }
  };

  render() {
    const { msg } = this.state;
    const { id } = this.props;

    return (
      <div className="ipfs-upload">
        <input
          type="file"
          id={id}
          multiple={false}
          className={"form-control"}
          onChange={this.onChange}
        />

        <label
          htmlFor={id}
          className={(msg === 'Choose file') ? '' : 'active'}>
          {msg}
        </label>

        {this.state.url ? (<p>{this.state.url}</p>) : null}
      </div>
    );
  }
};

