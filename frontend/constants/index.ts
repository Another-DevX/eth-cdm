export const PLATOCOIN_ADDRESS = '0xe1c5c96653FaC4F0886184a0BFc20C5f4c1d26eB';
export const MOCK_ASTR_ADDRESS = '0x67A0d2Db9188B10f24a47B7671890B326A0b6714';
export const ASTR_ADDRESS = '0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441';
export const NsASTR_ADDRESS = '0xc67476893C166c537afd9bc6bc87b3f228b44337';
export const STAKING_POOL_ADDRESS =
  '0x7C7E4Bb7F4891a7B7a069eF237De5BE1E42FAF15';

export const STAKING_POOL_ABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_neemoLiquifier',
        type: 'address',
        internalType: 'address',
      },
      { name: '_astr', type: 'address', internalType: 'address' },
      { name: '_nsastr', type: 'address', internalType: 'address' },
      { name: '_platoCoin', type: 'address', internalType: 'address' },
      { name: '_apyaspr', type: 'address', internalType: 'address' },
      { name: 'minter', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'ASTR',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ASTRMockToken',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ASTRMock' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'BENEFACTOR_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DEFAULT_ADMIN_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MINT_COINS_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'NsASTR',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ORGANIZATION_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRoleAdmin',
    inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'givePlatoCoinsToBenefactor',
    inputs: [
      { name: '_coins', type: 'uint256', internalType: 'uint256' },
      { name: '_benefactor', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'grantRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'neemoLiquifier',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract INeemoLiquifier',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'platoCoin',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract PlatoCoin' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'redeemPlatoCoins',
    inputs: [{ name: '_amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'renounceRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      {
        name: 'callerConfirmation',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'revokeRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'stake',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'stakedAmount',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'unstake',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'RoleAdminChanged',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'previousAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'newAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleGranted',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleRevoked',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'AccessControlBadConfirmation', inputs: [] },
  {
    type: 'error',
    name: 'AccessControlUnauthorizedAccount',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'neededRole', type: 'bytes32', internalType: 'bytes32' },
    ],
  },
];
