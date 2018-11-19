export const isIpfsHash = (hash) => {
  if (typeof hash === 'string') {
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
  } else {
    return false;
  }
};
