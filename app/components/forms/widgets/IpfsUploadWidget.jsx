import React from 'react';
import { uploadFileToIpfs } from 'helpers/ipfs-tools';

import './IpfsUploadWidget.scss';

export default class IPFSUploadWebGatewayWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      msg: props.value || 'Choose file',
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { onChange } = this.props;
    const file = event.target.files[0];

    if (!file) {
      this.setState({ msg: 'Choose file' }, onChange(null));
    } else {
      this.setState({ msg: 'Uploading file to IPFS...' });

      uploadFileToIpfs(file)
        .then((hash) => {
          this.setState({
            msg: hash,
            ipfs_hash: hash
          }, onChange(hash));
        })
        .catch((err) => {
          console.error(err);
          this.setState({ msg: 'Error :-('});
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
      </div>
    );
  }
};

