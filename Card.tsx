import React, { useState } from 'react';
import useCardStorage from './useCardStorage';





const usePointerGlow = () => {
  const [status, setStatus] = React.useState(null);
  React.useEffect(() => {
    const syncPointer = ({ clientX: pointerX, clientY: pointerY }) => {
      const x = pointerX.toFixed(2);
      const y = pointerY.toFixed(2);
      const xp = (pointerX / window.innerWidth).toFixed(2);
      const yp = (pointerY / window.innerHeight).toFixed(2);
      document.documentElement.style.setProperty('--x', x);
      document.documentElement.style.setProperty('--xp', xp);
      document.documentElement.style.setProperty('--y', y);
      document.documentElement.style.setProperty('--yp', yp);
      setStatus({ x, y, xp, yp });
    };
    document.body.addEventListener('pointermove', syncPointer);
    return () => {
      document.body.removeEventListener('pointermove', syncPointer);
    };
  }, []);
  return [status];
};
const Card = ({ cardType }) => {
usePointerGlow();
  const {
    miningPurchaseData,
    setMiningPurchaseData,
    linksRewardsData,
    setLinksRewardsData,
    updateMiningTime,
    updateStarCount,
    updateLevel,
    updateMiningHoursPerStar,
    updateTotalMiningHours,
    updateReferralRewards,
    updateReferralLink,
  } = useCardStorage();

  const data = cardType === 'miningPurchase' ? miningPurchaseData : linksRewardsData;
  const setData = cardType === 'miningPurchase' ? setMiningPurchaseData : setLinksRewardsData;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  // Constants for mining rules
  const miningRules = {
    free: {
      stars: 100,
      miningHoursPerStar: 0.001,
      totalMiningHours: 5,
      price: 0, // Free level
    },
    level1: {
      stars: 300,
      miningHoursPerStar: 0.01,
      totalMiningHours: 10,
      price: 0.06, // 0.5 ton
    },
    level2: {
      stars: 600,
      miningHoursPerStar: 0.05,
      totalMiningHours: 20,
      price: 0.5, // 1 ton
    },
    level3: {
      stars: 900,
      miningHoursPerStar: 0.1,
      totalMiningHours: 40,
      price: 1, // 2 ton
    },
  };

  // Calculate mining hours and level-based information
  const miningHoursPerStar = data.miningHoursPerStar;
  const totalStars = data.stars;
  const totalMiningHours = miningHoursPerStar * totalStars;
  const level = data.level;

  // Handle payment for level up
  const handleLevelUpPayment = async () => {
    if (!walletAddress) {
      alert('Please enter your wallet address');
      return;
    }

    // Simulate payment using a mock payment gateway (replace with actual payment processing)
    console.log(`Simulating payment of ${miningRules[selectedLevel].price} ton to wallet ${walletAddress}`);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

    // Update level and mining rules
    updateLevel(selectedLevel);
    updateMiningHoursPerStar(miningRules[selectedLevel].miningHoursPerStar);
    updateTotalMiningHours(miningRules[selectedLevel].totalMiningHours);

    // Close payment modal
    setShowPaymentModal(false);
  };

  // Display mining information (if cardType is 'miningPurchase')
  if (cardType === 'miningPurchase') {
    return (
      <article data-glow>
        <span data-glow />
        <div className="card-content">
          {/* ... existing mining information ... */}

          {/* Level-based information */}
          <p>Current Level: {level}</p>
          <p>Level {level + 1} Details:</p>
          <ul>
            <li>Stars Required: {miningRules[level + 1].stars}</li>
            <li>Mining per Star: {miningRules[level + 1].miningHoursPerStar} space/hour</li>
            <li>Total Mining Hours: {miningRules[level + 1].totalMiningHours}</li>
            <li>Price: {miningRules[level + 1].price} ton</li>
          </ul>

          <button
            onClick={() => {
              setSelectedLevel(level + 1);
              setShowPaymentModal(true);
            }}
            disabled={level >= Object.keys(miningRules).length - 1}
          >
            Level Up
          </button>
        </div>
        <button data-glow>
          <span>Glow Up</span>
        </button>

        {/* Payment modal (conditionally rendered) */}
        {showPaymentModal && (
          <div className="payment-
// ... existing code for Card component ...

        {/* Payment modal (conditionally rendered) */}
        {showPaymentModal && (
          <div className="payment-modal">
            <h2>Level Up to Level {selectedLevel + 1}</h2>
            <p>Please enter your wallet address to proceed:</p>
            <input
              type="text"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={handleLevelUpPayment}>Pay {miningRules[selectedLevel].price} ton</button>
            <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
          </div>
        )}

        <button data-glow>
          <span>Glow Up</span>
        </button>
      </article>
    );
  }
};

export default Card;
      
