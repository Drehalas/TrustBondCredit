// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BonzoVault
 * @notice A simplified Bonzo-like vault contract that stores liquidity position ranges.
 * This is a scaffold contract for the BondCredit volatility-aware rebalancer agent.
 * The agent monitors HBAR volatility and adjusts these ranges to minimize impermanent loss.
 */

contract BonzoVault {
    // State variables
    address public owner;
    int256 public currentTick;
    int256 public lowerTick;
    int256 public upperTick;

    // Track deposited liquidity (simplified)
    uint256 public totalLiquidity;
    mapping(address => uint256) public deposits;

    // Events
    event RangeAdjusted(int256 newLowerTick, int256 newUpperTick, string reason);
    event WithdrawToStaking(uint256 amount, string reason);
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
        // Initialize with neutral range
        currentTick = 0;
        lowerTick = -120;
        upperTick = 120;
        totalLiquidity = 0;
    }

    /**
     * @notice Get the current tick in the pool (price position).
     * In a real implementation, this would come from a Uniswap-style pool.
     * For demo, we return the stored state.
     * @return The current tick
     */
    function getCurrentTick() external view returns (int256) {
        return currentTick;
    }

    /**
     * @notice Adjust the liquidity range (tighten, widen, or reset bounds).
     * Called by the volatility-aware rebalancer agent when volatility thresholds trigger.
     * @param _lowerTick New lower tick bound
     * @param _upperTick New upper tick bound
     */
    function adjustRange(int256 _lowerTick, int256 _upperTick) external onlyOwner {
        require(_lowerTick < _upperTick, "Invalid range: lower >= upper");

        lowerTick = _lowerTick;
        upperTick = _upperTick;

        emit RangeAdjusted(_lowerTick, _upperTick, "Range adjusted by agent");
    }

    /**
     * @notice Emergency withdraw: move liquidity to single-sided staking.
     * Called when volatility exceeds critical threshold (> 50%).
     * This removes the active liquidity position and moves it to staking for safety.
     */
    function withdrawToStaking() external onlyOwner {
        uint256 amount = totalLiquidity;
        require(amount > 0, "No liquidity to withdraw");

        // In a real vault, this would execute the LP withdrawal and move to staking contract
        // For now, we just track the event
        totalLiquidity = 0;

        // Reset range to safe defaults
        lowerTick = -120;
        upperTick = 120;

        emit WithdrawToStaking(amount, "Emergency withdraw to staking");
    }

    /**
     * @notice Allow users to deposit liquidity (simplified for demo).
     * In production, this would be a proper LP deposit with token management.
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        deposits[msg.sender] += msg.value;
        totalLiquidity += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw liquidity (simplified for demo).
     */
    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient deposit");
        deposits[msg.sender] -= amount;
        totalLiquidity -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @notice Simulate price movement (for testing/demo).
     * In production, this would come from the actual pool's state.
     */
    function setCurrentTick(int256 _tick) external onlyOwner {
        currentTick = _tick;
    }

    /**
     * @notice Check if position is in range.
     * @return True if currentTick is within [lowerTick, upperTick]
     */
    function isInRange() external view returns (bool) {
        return currentTick >= lowerTick && currentTick <= upperTick;
    }

    /**
     * @notice Get current position state.
     */
    function getPositionState()
        external
        view
        returns (
            int256 tick,
            int256 lower,
            int256 upper,
            uint256 liquidity
        )
    {
        return (currentTick, lowerTick, upperTick, totalLiquidity);
    }

    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Allow contract to receive ETH (for deposits via fallback)
    receive() external payable {}
}
