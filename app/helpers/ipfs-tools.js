import fileReader  from 'pull-file-reader';
import ipfsAPI from 'ipfs-api';

export const isIpfsHash = (hash) => {
  if (typeof hash === 'string') {
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
  } else {
    return false;
  }
};

export const uploadFileToIpfs = (file) => {
  const ipfsApi = ipfsAPI({host: 'ipfs.twitch666.mixbytes.io', port: '5001', protocol: 'https'});

  return new Promise((resolve, reject) => {
    ipfsApi.add(fileReader(file))
    .then((response) => resolve(response[0].hash))
    .catch((error) => reject(error));
  });
};
