import TokenABI from './abi/Token.abi.json';
import VotingABI from './abi/Voting.abi.json';
import FaucetABI from './abi/Faucet.abi.json';
import RegistryABI from './abi/Registry.abi.json';

const contracts = {
  Token: {
    address: '0x81f7cff4e30d8878114111b211f8bcc6c7fa31ae',
    abi: TokenABI
  },
  Voting: {
    address: '0x675e30a1c9c7dadfe9f650958338866ade0952e9',
    abi: VotingABI
  },
  Faucet: {
    address: '0x93c405df3680dc317b42fe044cc88c2db8026b7c',
    abi: FaucetABI
  },
  Registry: {
    address: '0x663e8bd1450b30b400afcff6c73bdd7afbc5d331',
    abi: RegistryABI
  },
};

export default contracts;
