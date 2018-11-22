import TokenABI from './abi/Token.abi.json';
import VotingABI from './abi/Voting.abi.json';
import FaucetABI from './abi/Faucet.abi.json';
import RegistryABI from './abi/Registry.abi.json';
import ParametrizerABI from './abi/Parametrizer.abi.json';

const contracts = {
  Token: {
    address: '0xc4ae75d112a8a87c3cab55f018b2f6aae5658109',
    abi: TokenABI
  },
  Voting: {
    address: '0x539216c323f18a7f07879ee2e19e41f8f6e98a64',
    abi: VotingABI
  },
  Faucet: {
    address: '0xd9f4f3f0b8205c69ddd86765e98cef3abd660df9',
    abi: FaucetABI
  },
  Registry: {
    address: '0xe26bf826d13914e4217b10bc027e1553cdf9e1a2',
    abi: RegistryABI
  },
  Parametrizer: {
    address: '0x3ea047b3994a10873876c7589607280cb31bde97',
    abi: ParametrizerABI
  }
};

export default contracts;
