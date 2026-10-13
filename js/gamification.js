// ASMR Animal Colors - Gamification & Progression Engine
import { playables } from './playables-sdk.js';
import { sounds } from './audio.js';

export class GamificationManager {
  constructor() {
    this.storageKey = 'animal_coloring_gamification_v2';
    this.coins = 100; // Welcome gift: 100 Coins for every new user
    this.colorsUsedInCurrentLevel = new Set();
    this.giftCooldownMs = 120 * 1000; // Gift every 2 minutes
    this.lastGiftTime = 0;

    // Progression state per category: { [catId]: { unlockedLevel: 1, levels: { [lvl]: { completed: bool, stars: int } } } }
    this.progress = {
      farm: { unlockedLevel: 1, levels: {} },
      jungle: { unlockedLevel: 1, levels: {} },
      aquatic: { unlockedLevel: 1, levels: {} },
      birds: { unlockedLevel: 1, levels: {} },
      dinosaurs: { unlockedLevel: 1, levels: {} },
      insects: { unlockedLevel: 1, levels: {} }
    };

    // Daily & Achievement Challenges
    this.challenges = [
      {
        id: 'first_level',
        title: 'First Masterpiece',
        desc: 'Finish any 1 coloring level',
        reward: 50,
        current: 0,
        target: 1,
        claimed: false,
        icon: '🎨'
      },
      {
        id: 'rainbow_artist',
        title: 'Rainbow Artist',
        desc: 'Use 5 different vibrant crayons in one drawing',
        reward: 40,
        current: 0,
        target: 5,
        claimed: false,
        icon: '🌈'
      },
      {
        id: 'dino_explorer',
        title: 'Dino Tamer',
        desc: 'Complete Level 1 of Dinosaurs',
        reward: 60,
        current: 0,
        target: 1,
        claimed: false,
        icon: '🦖'
      },
      {
        id: 'ocean_diver',
        title: 'Ocean Explorer',
        desc: 'Complete Level 1 of Aquatic World',
        reward: 60,
        current: 0,
        target: 1,
        claimed: false,
        icon: '🐬'
      },
      {
        id: 'triple_champion',
        title: 'Triple Champion',
        desc: 'Complete 3 total coloring levels',
        reward: 100,
        current: 0,
        target: 3,
        claimed: false,
        icon: '🏆'
      }
    ];

    this.listeners = [];
  }

  async init() {
    await this.loadState();
    this.updateCoinDisplay();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.updateCoinDisplay();
    this.listeners.forEach(cb => cb(this));
  }

  async loadState() {
    try {
      const saved = await playables.loadData(this.storageKey);
      if (saved) {
        if (typeof saved.coins === 'number') {
          const hasCompletedLevels = saved.progress && Object.values(saved.progress).some(cat => cat.levels && Object.keys(cat.levels).length > 0);
          this.coins = (!hasCompletedLevels && saved.coins < 100) ? 100 : saved.coins;
        }
        if (saved.progress) {
          Object.keys(saved.progress).forEach(cat => {
            if (this.progress[cat]) {
              this.progress[cat] = { ...this.progress[cat], ...saved.progress[cat] };
            }
          });
        }
        if (Array.isArray(saved.challenges)) {
          saved.challenges.forEach(sc => {
            const match = this.challenges.find(c => c.id === sc.id);
            if (match) {
              match.current = sc.current || 0;
              match.claimed = !!sc.claimed;
            }
          });
        }
        if (saved.lastGiftTime) this.lastGiftTime = saved.lastGiftTime;
        if (saved.lastPlayedAnimal) this.lastPlayedAnimal = saved.lastPlayedAnimal;
      }
    } catch (e) {
      console.warn('Failed to load gamification data:', e);
    }
  }

  async saveState() {
    try {
      const payload = {
        coins: this.coins,
        progress: this.progress,
        challenges: this.challenges.map(c => ({ id: c.id, current: c.current, claimed: c.claimed })),
        lastGiftTime: this.lastGiftTime,
        lastPlayedAnimal: this.lastPlayedAnimal || null
      };
      await playables.saveData(this.storageKey, payload);
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
      playables.sendScore(this.coins);
    } catch (e) {
      console.warn('Failed to save gamification data:', e);
    }
  }

  setLastPlayedAnimal(categoryId, animal) {
    if (!animal) return;
    this.lastPlayedAnimal = {
      categoryId,
      animal: {
        id: animal.id || animal.name,
        name: animal.name,
        path: animal.path,
        file: animal.file
      }
    };
    this.saveState();
  }

  getLastPlayedAnimal() {
    return this.lastPlayedAnimal || null;
  }

  addCoins(amount, animate = true) {
    const prev = this.coins;
    this.coins += amount;
    sounds.playCoin();
    this.saveState();
    this.notify();

    if (animate) {
      this.animateCoinCounter(prev, this.coins);
    }
  }

  spendCoins(amount) {
    if (this.coins < amount) return false;
    this.coins -= amount;
    sounds.playClick();
    this.saveState();
    this.notify();
    return true;
  }

  animateCoinCounter(start, end) {
    const elements = document.querySelectorAll('.coin-count-val');
    elements.forEach(el => {
      el.classList.add('bouncing');
      let current = start;
      const step = Math.max(1, Math.round((end - start) / 10));
      const timer = setInterval(() => {
        current = Math.min(end, current + step);
        el.textContent = current;
        if (current >= end) {
          clearInterval(timer);
          setTimeout(() => el.classList.remove('bouncing'), 400);
        }
      }, 40);
    });
  }

  updateCoinDisplay() {
    document.querySelectorAll('.coin-count-val').forEach(el => {
      el.textContent = this.coins;
    });
  }

  // Level Management
  getCategoryProgress(categoryId) {
    if (!this.progress[categoryId]) {
      this.progress[categoryId] = { unlockedLevel: 1, levels: {} };
    }
    return this.progress[categoryId];
  }

  isLevelUnlocked(categoryId, levelNumber) {
    if (levelNumber <= 1) return true;
    const cat = this.getCategoryProgress(categoryId);
    return levelNumber <= (cat.unlockedLevel || 1);
  }

  getLevelInfo(categoryId, levelNumber) {
    const cat = this.getCategoryProgress(categoryId);
    return cat.levels[levelNumber] || { completed: false, stars: 0 };
  }

  unlockLevelWithCoins(categoryId, levelNumber, cost = 50) {
    if (this.spendCoins(cost)) {
      const cat = this.getCategoryProgress(categoryId);
      if (levelNumber > cat.unlockedLevel) {
        cat.unlockedLevel = levelNumber;
      }
      sounds.playLevelUnlock();
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  skipLevelWithCoins(categoryId, nextLevelNumber, cost = 50) {
    if (this.spendCoins(cost)) {
      const cat = this.getCategoryProgress(categoryId);
      if (nextLevelNumber > cat.unlockedLevel) {
        cat.unlockedLevel = nextLevelNumber;
      }
      sounds.playLevelUnlock();
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  skipChallengeWithCoins(challengeId, cost = 50) {
    const ch = this.challenges.find(c => c.id === challengeId);
    if (!ch || ch.claimed) return false;
    if (this.spendCoins(cost)) {
      ch.current = ch.target;
      ch.claimed = true;
      this.addCoins(ch.reward, true);
      sounds.playLevelUnlock();
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  completeLevel(categoryId, levelNumber, totalAnimalsInCategory) {
    const cat = this.getCategoryProgress(categoryId);
    const existing = cat.levels[levelNumber] || {};
    const firstTimeCompletion = !existing.completed;

    // Grant 3 stars on celebration
    cat.levels[levelNumber] = {
      completed: true,
      stars: 3,
      completedAt: Date.now()
    };

    // Unlock next level
    const nextLevelNumber = levelNumber + 1;
    let unlockedNew = false;
    if (nextLevelNumber <= totalAnimalsInCategory) {
      if (nextLevelNumber > cat.unlockedLevel) {
        cat.unlockedLevel = nextLevelNumber;
        unlockedNew = true;
      }
    }

    // Award Coins: grant 20 coins every time a drawing is completed!
    const coinsEarned = 20;
    this.addCoins(coinsEarned, true);

    // Update Challenges
    this.updateChallengeProgress('first_level', 1);
    if (categoryId === 'dinosaurs' && levelNumber === 1) {
      this.updateChallengeProgress('dino_explorer', 1);
    }
    if (categoryId === 'aquatic' && levelNumber === 1) {
      this.updateChallengeProgress('ocean_diver', 1);
    }

    // Count total completed levels
    let totalCompleted = 0;
    Object.values(this.progress).forEach(c => {
      Object.values(c.levels || {}).forEach(l => {
        if (l.completed) totalCompleted++;
      });
    });
    const tripleChamp = this.challenges.find(c => c.id === 'triple_champion');
    if (tripleChamp && !tripleChamp.claimed) {
      tripleChamp.current = Math.min(tripleChamp.target, totalCompleted);
    }

    this.saveState();
    this.notify();

    return {
      coinsEarned,
      stars: 3,
      firstTime: firstTimeCompletion,
      unlockedNew,
      hasNextLevel: nextLevelNumber <= totalAnimalsInCategory,
      nextLevelNumber
    };
  }

  recordColorUsed(hex) {
    this.colorsUsedInCurrentLevel.add(hex.toLowerCase());
    const count = this.colorsUsedInCurrentLevel.size;
    const challenge = this.challenges.find(c => c.id === 'rainbow_artist');
    if (challenge && !challenge.claimed) {
      challenge.current = Math.min(challenge.target, Math.max(challenge.current, count));
      this.saveState();
      this.notify();
    }
  }

  resetCurrentLevelColors() {
    this.colorsUsedInCurrentLevel.clear();
  }

  setLastPlayedAnimal(categoryId, animal) {
    this.lastPlayedAnimal = { categoryId, animal };
    this.saveState();
  }

  getLastPlayedAnimal() {
    return this.lastPlayedAnimal || null;
  }

  // Challenges
  updateChallengeProgress(id, countToAdd) {
    const ch = this.challenges.find(c => c.id === id);
    if (ch && !ch.claimed) {
      ch.current = Math.min(ch.target, ch.current + countToAdd);
      this.saveState();
      this.notify();
    }
  }

  claimChallengeReward(id) {
    const ch = this.challenges.find(c => c.id === id);
    if (ch && !ch.claimed && ch.current >= ch.target) {
      ch.claimed = true;
      this.addCoins(ch.reward, true);
      sounds.playFanfare();
      this.saveState();
      this.notify();
      return ch.reward;
    }
    return 0;
  }

  hasUnclaimedChallenges() {
    return this.challenges.some(c => !c.claimed && c.current >= c.target);
  }

  // Mystery Gift
  getGiftRemainingSeconds() {
    const elapsed = Date.now() - this.lastGiftTime;
    const remaining = Math.max(0, Math.ceil((this.giftCooldownMs - elapsed) / 1000));
    return remaining;
  }

  isGiftReady() {
    return this.getGiftRemainingSeconds() === 0;
  }

  claimMysteryGift() {
    if (!this.isGiftReady()) return 0;
    // Award between 60 and 150 coins randomly
    const prize = Math.floor(Math.random() * 8) * 10 + 60;
    this.lastGiftTime = Date.now();
    this.addCoins(prize, true);
    sounds.playGift();
    this.saveState();
    this.notify();
    return prize;
  }
}

export const gamification = new GamificationManager();
