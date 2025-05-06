// DOM Elements
const loader = document.querySelector('.loader-container');
const connectWalletBtn = document.getElementById('connect-wallet');
const mineNowBtn = document.getElementById('mine-now-btn');
const startMiningBtn = document.getElementById('start-mining-btn');
const miningModal = document.getElementById('mining-modal');
const successModal = document.getElementById('success-modal');
const confirmMiningBtn = document.getElementById('confirm-mining-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const investAmountInput = document.getElementById('invest-amount');
const estimatedReturn = document.getElementById('estimated-return');
const nextMiningTime = document.getElementById('next-mining-time');
const miningProgress = document.getElementById('mining-progress');
const minedPercentage = document.getElementById('mined-percentage');
const remainingTokens = document.getElementById('remaining-tokens');
const calculateBtn = document.getElementById('calculate-btn');
const poolBalance = document.getElementById('pool-balance');
const activeMinerCounter = document.getElementById('active-miners');
const miningSpeedCounter = document.getElementById('mining-speed');
const stakingDuration = document.getElementById('staking-duration');
const withdrawalCountdown = document.getElementById('withdrawal-countdown');
const claimRewardsBtn = document.getElementById('claim-rewards-btn');
const successAmount = document.getElementById('success-amount');

// Wallet Connection State
let walletConnected = false;
let lastMiningTime = null;

// Particle Animation Configuration
const particleSettings = {
  count: 30,
  minSize: 2,
  maxSize: 5,
  duration: 2,
  radius: 80
};

// Initial values
const initialValues = {
  totalSupply: 21000000,
  miningPoolTotal: 12600000,
  currentRate: 137,
  baseRate: 100,
  activityBonus: 0.227,
  minedPercentage: 23.7,
  activeminers: 2841,
  miningSpeed: 1274,
  stakingDuration: 17,
  withdrawalTime: 31,
  stakedAmount: 1437,
};

// Animation Functions
function createParticles(container) {
  for (let i = 0; i < particleSettings.count; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * (particleSettings.maxSize - particleSettings.minSize) + particleSettings.minSize;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Start position (center of container)
      const centerX = container.offsetWidth / 2;
      const centerY = container.offsetHeight / 2;
      
      // Random angle
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * particleSettings.radius;
      
      // Calculate end position
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      // Set custom properties for the animation
      particle.style.setProperty('--tx', `${endX}px`);
      particle.style.setProperty('--ty', `${endY}px`);
      
      // Position the particle
      particle.style.top = `${centerY}px`;
      particle.style.left = `${centerX}px`;
      
      container.appendChild(particle);
      
      // Remove particle when animation completes
      setTimeout(() => {
        container.removeChild(particle);
      }, particleSettings.duration * 1000);
      
    }, i * (particleSettings.duration * 1000 / particleSettings.count));
  }
}

// Initialize the page
function initPage() {
  // Hide loader after 1.5 seconds
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }, 1500);

  // Set up initial values
  updateMiningProgress(initialValues.minedPercentage);
  updateCounters();

  // Set up investment amount change handler
  if (investAmountInput) {
    investAmountInput.addEventListener('input', updateEstimatedReturns);
    updateEstimatedReturns();
  }

  // Start particles in animation container
  const miningAnimation = document.getElementById('mining-animation');
  if (miningAnimation) {
    const particlesContainer = miningAnimation.querySelector('.mining-particles');
    if (particlesContainer) {
      setInterval(() => createParticles(particlesContainer), 3000);
    }
  }

  // Setup calculator
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateReturns);
  }

  // Set up animation for earnings progress
  animateEarningsProgress();
}

// Update the mining progress bar and related data
function updateMiningProgress(percentage) {
  if (miningProgress && minedPercentage && remainingTokens) {
    miningProgress.style.width = `${percentage}%`;
    minedPercentage.textContent = `${percentage}%`;
    
    const remainingAmount = Math.floor(initialValues.miningPoolTotal * (1 - percentage / 100));
    remainingTokens.textContent = `${remainingAmount.toLocaleString()} JB`;
    poolBalance.textContent = `${remainingAmount.toLocaleString()} JB`;
  }
}

// Update all dynamic counters with animation
function updateCounters() {
  // Animate active miners counter
  animateCounter(activeMinerCounter, 2700, initialValues.activeminers, 1500);
  
  // Animate mining speed counter
  animateCounter(miningSpeedCounter, 1000, initialValues.miningSpeed, 2000);

  // Simulate slight fluctuations in mining progress
  setInterval(() => {
    const newPercentage = initialValues.minedPercentage + (Math.random() * 0.01);
    updateMiningProgress(parseFloat(newPercentage.toFixed(2)));
  }, 5000);

  // Update staking duration every minute
  if (stakingDuration && withdrawalCountdown) {
    setInterval(() => {
      const currentDuration = parseInt(stakingDuration.textContent);
      stakingDuration.textContent = `${currentDuration + 1} 小时`;
      
      const currentCountdown = parseInt(withdrawalCountdown.textContent);
      if (currentCountdown > 0) {
        withdrawalCountdown.textContent = `${currentCountdown - 1} 小时`;
        
        if (currentCountdown - 1 <= 0) {
          claimRewardsBtn.disabled = false;
          claimRewardsBtn.innerHTML = '<i data-lucide="award" class="w-4 h-4 mr-2"></i>提取收益';
          lucide.createIcons();
        }
      }
    }, 60000); // Every minute in real-time
  }
}

// Animate a counter from start to end value
function animateCounter(element, start, end, duration) {
  if (!element) return;
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Update estimated returns based on investment amount
function updateEstimatedReturns() {
  if (investAmountInput && estimatedReturn) {
    const investAmount = parseFloat(investAmountInput.value) || 0;
    // Cap at max investment amount
    const cappedAmount = Math.min(investAmount, 1);
    
    if (investAmount > 1) {
      investAmountInput.value = "1";
    }
    
    // Calculate return with activity bonus
    const estimatedJB = (cappedAmount * initialValues.currentRate).toFixed(2);
    estimatedReturn.textContent = `${estimatedJB} JB`;
  }
}

// Calculate and update staking returns
function calculateReturns() {
  const amount = parseFloat(document.getElementById('calc-amount').value) || 0;
  const duration = parseInt(document.getElementById('calc-duration').value) || 30;
  const isBoosted = document.getElementById('calc-boosted').checked;
  
  const baseAPR = 0.15; // 15% base APR
  const boostMultiplier = isBoosted ? 1.3 : 1; // 30% boost if enabled
  
  const effectiveAPR = baseAPR * boostMultiplier;
  document.getElementById('effective-apr').textContent = `${(effectiveAPR * 100).toFixed(1)}%`;
  
  // Calculate returns - (amount * APR * days/365)
  const returns = amount * effectiveAPR * (duration/365);
  document.getElementById('total-return').textContent = `${returns.toFixed(2)} JB`;
}

// Show a modal dialog
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show-modal');
    document.body.style.overflow = 'hidden';
  }
}

// Hide a modal dialog
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show-modal');
    document.body.style.overflow = '';
  }
}

// Animate earnings progress bar
function animateEarningsProgress() {
  const earningsProgress = document.getElementById('earnings-progress');
  if (!earningsProgress) return;
  
  // Gradually increase the width to simulate ongoing earnings
  let width = 67; // Initial width percentage
  setInterval(() => {
    width += 0.01;
    if (width > 100) width = 0;
    earningsProgress.style.width = `${width}%`;
    
    // Update the earnings amount
    const totalEarnings = document.getElementById('total-earnings');
    if (totalEarnings) {
      const currentEarnings = parseFloat(totalEarnings.textContent);
      totalEarnings.textContent = (currentEarnings + 0.01).toFixed(2) + ' JB';
    }
  }, 10000); // Update every 10 seconds
}

// Connect wallet
function connectWallet() {
  if (walletConnected) return;
  
  connectWalletBtn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 mr-2 animate-spin"></i>连接中...';
  
  // Simulate connection delay
  setTimeout(() => {
    walletConnected = true;
    connectWalletBtn.innerHTML = '<i data-lucide="wallet" class="w-4 h-4 mr-2"></i>已连接';
    connectWalletBtn.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-yellow-600');
    connectWalletBtn.classList.add('bg-green-600');
    
    // Update lucide icons
    lucide.createIcons();
  }, 1500);
}

// Start mining process
function startMining() {
  if (!walletConnected) {
    connectWallet();
    return;
  }
  
  // Check cooldown
  if (lastMiningTime) {
    const now = new Date();
    const timeDiff = now - lastMiningTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      const remainingHours = Math.ceil(24 - hoursDiff);
      nextMiningTime.textContent = `${remainingHours}小时后可用`;
      alert(`挖矿冷却中! 请等待 ${remainingHours} 小时后再试。`);
      return;
    }
  }
  
  // Show mining confirmation modal
  showModal('mining-modal');
}

// Confirm mining transaction
function confirmMining() {
  // Hide mining modal
  hideModal('mining-modal');
  
  // Show loading
  mineNowBtn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 mr-2 animate-spin"></i>处理中...';
  mineNowBtn.disabled = true;
  
  // Update lucide icons
  lucide.createIcons();
  
  // Simulate transaction processing
  setTimeout(() => {
    // Success!
    mineNowBtn.innerHTML = '<i data-lucide="check" class="w-5 h-5 mr-2"></i>挖矿成功';
    
    // Set cooldown
    lastMiningTime = new Date();
    nextMiningTime.textContent = '24小时后可用';
    
    // Update icons
    lucide.createIcons();
    
    // Show success modal
    showModal('success-modal');
    
    // Reset button after a delay
    setTimeout(() => {
      mineNowBtn.innerHTML = '<i data-lucide="pickaxe" class="w-5 h-5 mr-2"></i>开始挖矿';
      mineNowBtn.disabled = false;
      lucide.createIcons();
    }, 3000);
    
    // Update mining progress slightly
    const currentPercentage = parseFloat(minedPercentage.textContent);
    updateMiningProgress(currentPercentage + 0.01);
    
    // Simulate network update
    const currentMiners = parseInt(activeMinerCounter.textContent.replace(/,/g, ''));
    animateCounter(activeMinerCounter, currentMiners, currentMiners + 1, 500);
  }, 2000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initPage();
  
  // Connect wallet button
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', connectWallet);
  }
  
  // Mining buttons
  if (mineNowBtn) mineNowBtn.addEventListener('click', startMining);
  if (startMiningBtn) startMiningBtn.addEventListener('click', startMining);
  
  // Confirm mining button
  if (confirmMiningBtn) {
    confirmMiningBtn.addEventListener('click', confirmMining);
  }
  
  // Close modal buttons
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      hideModal('mining-modal');
      hideModal('success-modal');
    });
  });
  
  // Claim rewards button
  if (claimRewardsBtn) {
    claimRewardsBtn.addEventListener('click', function() {
      if (this.disabled) return;
      
      this.innerHTML = '<i data-lucide="loader" class="w-4 h-4 mr-2 animate-spin"></i>处理中...';
      lucide.createIcons();
      
      setTimeout(() => {
        this.innerHTML = '<i data-lucide="check" class="w-4 h-4 mr-2"></i>提取成功';
        lucide.createIcons();
        
        showModal('success-modal');
        successAmount.textContent = '5.24 JB';
      }, 1500);
    });
  }
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Prevent zoom on mobile
window.addEventListener("wheel", (e)=> {
  const isPinching = e.ctrlKey
  if(isPinching) e.preventDefault()
}, { passive: false })
