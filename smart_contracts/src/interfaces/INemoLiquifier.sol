// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

interface INeemoLiquifier {
    /// @notice Reverted when invalid input is provided.
    error InvalidInput();

    /// @notice Reverted when invalid implementation is provided.
    error InvalidImplementation();

    /// @notice Reverted when authentication fails.
    error AuthenticationFailed();

    /// @notice Reverted when action is paused.
    error ActionPaused();

    /// @notice Reverted when call is failed while adding liquidity.
    error AddLiquidityFailed(string);

    /// @notice Reverted when Astar withdraw failed.
    error SwapUnderlyingToLstFailed(string);

    /// @notice Reverted when NsAstar withdraw failed.
    error SwapLstToUnderlyingFailed(string);

    /// @notice Reverted when withdraw liquidity failed.
    error WithdrawLiquidityFailed(string);

    /// @notice Reverted when withdraw liquidity failed.
    error ProtocolWithdrawFailed(string);

    /// @notice Event emitted when the treasury address is set.
    event LogSetTreasury(address _oldTreasury, address _newTreasury);

    /// @notice Event emitted when fees is set for LST to Underlying token swap
    event LogSetLstToUnderlyingSwapFee(uint256 _oldFee, uint256 _newFee);

    /// @notice Event emitted when user address is whitelisted
    event LogUpdateLpWhitelistStatus(address indexed _user, bool _status);

    /// @notice Event emitted when user address is exempted from fees
    event LogFeeExemptWhitelistStatus(address indexed _user, bool _status);

    /// @notice Event emitted when liquidity provider provides liquidity
    event LogAddLiquidity(address indexed _tokenAddress, address indexed _user, uint256 _tokenAmount);

    /// @notice Event emitted when liquidity provider withdraws liquidity
    event LogWithdrawLiquidity(address indexed _tokenAddress, address indexed _user, uint256 _tokenAmount);

    /// @notice Event emitted when liquidity provider swaps underlying token to LST (Astar => nsAstr)
    event LogSwapUnderlyingToLst(address indexed _user, uint256 _tokenAmount, uint256 _lstAmount);

    /// @notice Event emitted when liquidity provider swaps LST to underlying token (nsAstr => Astar)
    event LogSwapLstToUnderlying(address indexed _user, uint256 _lstAmount, uint256 _tokenAmount, uint256 _fee);

    /// @notice Event emitted when protocol withdraws tokens, only in case of emergency
    event LogProtocolWithdraw(address indexed _tokenAddress, uint256 _tokenAmount);

    /// @notice Emitted when a user is referred by another address.
    event LogReferredBy(address indexed _caller, address indexed _user, address indexed _referredBy, uint256 _amount);

    struct LiquidityInfo {
        uint256 underlyingTokenLiquidity;
        uint256 lstLiquidity;
    }

    function addLiquidity(address _token, uint256 _amount) external;
    function getLiquidity() external view returns (bool, uint256, uint256);
    function setTreasury(address _newTreasury) external;
    function setLstToUnderlyingSwapFee(uint256 _fee) external;
    function updateLpWhitelistStatus(address _user, bool _status) external;
    function updateFeeExemptWhitelist(address _user, bool _status) external;
    function withdrawLiquidity(address _token, uint256 _amount) external;
    function swapUnderlyingToLst(
        uint256 _tokenAmount,
        address _delegateTo,
        address referral
    ) external returns (uint256);
    function swapLstToUnderlying(uint256 _tokenAmount) external returns (uint256);
    function protocolWithdraw(address _token, uint256 _amount) external;
}
