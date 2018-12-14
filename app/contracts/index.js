import TokenABI from './abi/Token.abi.json';
import VotingABI from './abi/Voting.abi.json';
import FaucetABI from './abi/Faucet.abi.json';
import RegistryABI from './abi/Registry.abi.json';
import ParametrizerABI from './abi/Parametrizer.abi.json';

const contracts = {
  Token: {
    address: '0xd162be13fab3416b7f3e4af233abb5e7a15ae573',
    abi: TokenABI
  },
  Voting: {
    address: '0x17f23cc45df84e737149c2d0d77e423b16a89fc2',
    abi: VotingABI
  },
  Faucet: {
    address: '0x10a8d96938e7bd8c3d1a980146ab7bf56038c91b',
    abi: FaucetABI
  },
  Registry: {
    address: '0xd18d96f48d5a2cffa4bb12862d262c0ee32a488a',
    abi: RegistryABI
  },
  Parametrizer: {
    address: '0x8d414e0975f25715da4bf8c6c83011089740ac31',
    abi: ParametrizerABI
  }
};

export default contracts;
