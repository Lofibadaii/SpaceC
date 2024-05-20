<main>
  {/* بطاقة التعدين */}
  <Card cardType="miningPurchase" />
      
  {/* بطاقة شراء المزيد من النجوم */}
  <Card cardType="buyMoreStars" />

  {/* بطاقة للروابط */}
  <Card cardType="referralLinks" />
</main>
import { useState, useEffect } from 'react';

const MINING_PURCHASE_KEY = 'miningPurchaseData';
const LINKS_REWARDS_KEY = 'linksRewardsData';

const useCardStorage = (cardType: string) => {
  const [miningPurchaseData, setMiningPurchaseData] = useState({
    stars: 0,
    level: 0,
    miningHoursPerStar: 0,
    totalMiningHours: 0,
  });

  const [linksRewardsData, setLinksRewardsData] = useState({
    referralRewards: 0,
    referralLink: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const miningData = localStorage.getItem(MINING_PURCHASE_KEY);
      const linksData = localStorage.getItem(LINKS_REWARDS_KEY);
      
      if (miningData) {
        setMiningPurchaseData(JSON.parse(miningData));
      }
      
      if (linksData) {
        setLinksRewardsData(JSON.parse(linksData));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MINING_PURCHASE_KEY, JSON.stringify(miningPurchaseData));
    }
  }, [miningPurchaseData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LINKS_REWARDS_KEY, JSON.stringify(linksRewardsData));
    }
  }, [linksRewardsData]);

  const setData = cardType === 'miningPurchase' ? setMiningPurchaseData : setLinksRewardsData;

  const updateMiningTime = (newTime: number) => {
    if (cardType === 'miningPurchase') {
      setMiningPurchaseData((prevState) => ({
        ...prevState,
        mining: {
          ...prevState.mining,
          time: newTime,
        },
      }));
    }
  };

  const updateStarCount = (newStarCount: number) => {
    if (cardType === 'miningPurchase') {
      setMiningPurchaseData((prevState) => ({
        ...prevState,
        stars: newStarCount,
      }));
    }
  };

  const updateLevel = (newLevel: number) => {
    if (cardType === 'miningPurchase') {
      setMiningPurchaseData((prevState) => ({
        ...prevState,
        level: newLevel,
      }));
    }
  };

  const updateMiningHoursPerStar = (newMiningHoursPerStar: number) => {
    if (cardType === 'miningPurchase') {
      setMiningPurchaseData((prevState) => ({
        ...prevState,
        miningHoursPerStar: newMiningHoursPerStar,
      }));
    }
  };

  const updateTotalMiningHours = (newTotalMiningHours: number) => {
    if (cardType === 'miningPurchase') {
      setMiningPurchaseData((prevState) => ({
        ...prevState,
        totalMiningHours: newTotalMiningHours,
      }));
    }
  };

  const updateReferralRewards = (newReferralRewards: number) => {
    if (cardType === 'linksRewards') {
      setLinksRewardsData((prevState) => ({
        ...prevState,
        referralRewards: newReferralRewards,
      }));
    }
  };

  const updateReferralLink = (newReferralLink: string) => {
    if (cardType === 'linksRewards') {
      setLinksRewardsData((prevState) => ({
        ...prevState,
        referralLink: newReferralLink,
      }));
    }
  };

  return {
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
  };
};

export default useCardStorage;
import React, { useState, useEffect } from 'react';
import useCardStorage from './useCardStorage';

const usePointerGlow = () => {
  const [status, setStatus] = useState(null);
  useEffect(() => {
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
    linksRewardsData,
    updateLevel,
    updateMiningHoursPerStar,
    updateTotalMiningHours,
  } = useCardStorage(cardType);

  const data = cardType === 'miningPurchase' ? miningPurchaseData : linksRewardsData;
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  // Constants for mining rules
  const miningRules = {
    free: {
      stars: 100,
      miningHoursPerStar: 0.001,
      totalMiningHours: 5,
      price: 0,
    },
    level1: {
      stars: 300,
      miningHoursPerStar: 0.01,
      totalMiningHours: 10,
      price: 0.06,
    },
    level2: {
      stars: 600,
      miningHoursPerStar: 0.05,
      totalMiningHours: 20,
      price: 0.5,
    },
    level3: {
      stars: 900,
      miningHoursPerStar: 0.1,
      totalMiningHours: 40,
      price: 1,
    },
  };

  const handleLevelUpPayment = async () => {
    if (!walletAddress) {
      alert('Please enter your wallet address');
      return;
    }
    console.log(`Simulating payment of ${miningRules[selectedLevel].price} ton to wallet ${walletAddress}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateLevel(selectedLevel);
    updateMiningHoursPerStar(miningRules[selectedLevel].miningHoursPerStar);
    updateTotalMiningHours(miningRules[selectedLevel].totalMiningHours);
    setShowPaymentModal(false);
  };

  if (cardType === 'miningPurchase') {
    return (
      <article data-glow>
        <span data-glow />
        <div className="card-content">
          <p>Current Level: {data.level}</p>
          {data.level < Object.keys(miningRules).length - 1 && (
            <>
              <p>Level {data.level + 1} Details:</p>
              <ul>
                <li>Stars Required: {miningRules[`level${data.level + 1}`].stars}</li>
                <li>Mining per Star: {miningRules[`level${data.level + 1}`].miningHoursPerStar} space/hour</li>
                <li>Total Mining Hours: {miningRules[`level${data.level + 1}`].totalMiningHours}</li>
                <li>Price: {miningRules[`level${data.level + 1}`].price} ton</li>
              </ul>
              <button
                onClick={() => {
                  setSelectedLevel(data.level + 1);
                  setShowPaymentModal(true);
                }}
                disabled={data.level >= Object.keys(miningRules).length - 1}
              >
                Level Up
              </button>
            </>
          )}
        </div>

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
      </article>
    );
  }

  // Display linksRewardsData card
  return (
    <article data-glow>
      <span data-glow />
      <div className="card-content">
        {/* Display linksRewardsData content */}
        <p>Referral Rewards: {data.referralRewards}</p>
        <p>Referral Link: {data.referralLink}</p>
      </div>
    </article>
  );
};

export default Card;
        
