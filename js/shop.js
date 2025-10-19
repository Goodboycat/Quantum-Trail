/**
 * QUANTUM TRAIL - SHOP SYSTEM
 * Buy skins, trails, themes, effects, and bundles
 */

const SHOP_ITEMS = {
    skins: [
        { id: 'default', name: 'Classic Orb', preview: '🔵', price: 0, owned: true },
        { id: 'neon_pink', name: 'Neon Pink', preview: '🌸', price: 500, rarity: 'common' },
        { id: 'cyber_blue', name: 'Cyber Blue', preview: '💠', price: 500, rarity: 'common' },
        { id: 'golden', name: 'Golden Sphere', preview: '🟡', price: 1000, rarity: 'rare' },
        { id: 'emerald', name: 'Emerald Gem', preview: '💚', price: 1000, rarity: 'rare' },
        { id: 'ruby', name: 'Ruby Crystal', preview: '❤️', price: 1200, rarity: 'rare' },
        { id: 'plasma', name: 'Plasma Core', preview: '⚡', price: 2000, rarity: 'epic' },
        { id: 'galaxy', name: 'Galaxy Orb', preview: '🌌', price: 2500, rarity: 'epic' },
        { id: 'rainbow', name: 'Rainbow Burst', preview: '🌈', price: 3000, rarity: 'epic' },
        { id: 'black_hole', name: 'Black Hole', preview: '⚫', price: 5000, rarity: 'legendary' },
        { id: 'quantum', name: 'Quantum Flux', preview: '✨', price: 7500, rarity: 'legendary' },
        { id: 'dimensional', name: 'Dimensional Rift', preview: '🔮', price: 10000, rarity: 'legendary' },
    ],
    
    trails: [
        { id: 'default', name: 'Classic Trail', preview: '➖', price: 0, owned: true },
        { id: 'dotted', name: 'Dotted Line', preview: '•••', price: 300, rarity: 'common' },
        { id: 'dashed', name: 'Dashed Path', preview: '---', price: 300, rarity: 'common' },
        { id: 'glow', name: 'Glowing Trail', preview: '✨', price: 600, rarity: 'rare' },
        { id: 'fire', name: 'Fire Trail', preview: '🔥', price: 800, rarity: 'rare' },
        { id: 'ice', name: 'Ice Trail', preview: '❄️', price: 800, rarity: 'rare' },
        { id: 'lightning', name: 'Lightning Trail', preview: '⚡', price: 1500, rarity: 'epic' },
        { id: 'cosmic', name: 'Cosmic Dust', preview: '✨', price: 2000, rarity: 'epic' },
        { id: 'rainbow', name: 'Rainbow Path', preview: '🌈', price: 2500, rarity: 'epic' },
        { id: 'nebula', name: 'Nebula Trail', preview: '🌟', price: 4000, rarity: 'legendary' },
        { id: 'aurora', name: 'Aurora Borealis', preview: '🎆', price: 5000, rarity: 'legendary' },
    ],
    
    themes: [
        { id: 'default', name: 'Quantum Dark', preview: '🌃', price: 0, owned: true },
        { id: 'cyber', name: 'Cyberpunk', preview: '🌆', price: 1000, rarity: 'rare' },
        { id: 'neon', name: 'Neon Nights', preview: '🌉', price: 1000, rarity: 'rare' },
        { id: 'space', name: 'Deep Space', preview: '🚀', price: 1500, rarity: 'epic' },
        { id: 'matrix', name: 'Matrix Code', preview: '💻', price: 2000, rarity: 'epic' },
        { id: 'underwater', name: 'Underwater', preview: '🌊', price: 2000, rarity: 'epic' },
        { id: 'sunset', name: 'Sunset Paradise', preview: '🌅', price: 2500, rarity: 'epic' },
        { id: 'forest', name: 'Mystic Forest', preview: '🌲', price: 3000, rarity: 'legendary' },
        { id: 'void', name: 'The Void', preview: '🕳️', price: 5000, rarity: 'legendary' },
    ],
    
    effects: [
        { id: 'sparkles', name: 'Sparkle Effect', preview: '✨', price: 500, rarity: 'common' },
        { id: 'smoke', name: 'Smoke Trail', preview: '💨', price: 500, rarity: 'common' },
        { id: 'stars', name: 'Star Particles', preview: '⭐', price: 800, rarity: 'rare' },
        { id: 'hearts', name: 'Heart Particles', preview: '💖', price: 800, rarity: 'rare' },
        { id: 'lightning_bolt', name: 'Lightning Bolts', preview: '⚡', price: 1200, rarity: 'epic' },
        { id: 'confetti', name: 'Confetti', preview: '🎊', price: 1500, rarity: 'epic' },
        { id: 'energy_field', name: 'Energy Field', preview: '⚡', price: 2000, rarity: 'epic' },
        { id: 'portal', name: 'Portal Effect', preview: '🌀', price: 3000, rarity: 'legendary' },
    ],
    
    bundles: [
        {
            id: 'starter_pack',
            name: 'Starter Pack',
            preview: '📦',
            description: '3 Skins + 3 Trails',
            items: ['neon_pink', 'cyber_blue', 'golden', 'dotted', 'dashed', 'glow'],
            price: 2000,
            originalPrice: 3400,
            rarity: 'rare'
        },
        {
            id: 'pro_pack',
            name: 'Pro Pack',
            preview: '🎁',
            description: '5 Skins + 5 Trails + 2 Themes',
            items: ['plasma', 'galaxy', 'rainbow', 'fire', 'ice', 'lightning', 'cosmic', 'cyber', 'neon'],
            price: 8000,
            originalPrice: 15000,
            rarity: 'epic'
        },
        {
            id: 'ultimate_pack',
            name: 'Ultimate Pack',
            preview: '🎉',
            description: 'Everything Unlocked!',
            items: 'all',
            price: 50000,
            originalPrice: 100000,
            rarity: 'legendary'
        }
    ]
};

class ShopSystem {
    constructor() {
        this.currentCategory = 'skins';
        this.items = SHOP_ITEMS;
    }

    /**
     * Initialize shop system
     */
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.updateCurrency();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });
    }

    /**
     * Switch category
     */
    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        this.updateDisplay();
    }

    /**
     * Update display
     */
    updateDisplay() {
        const container = document.getElementById('shop-items');
        if (!container) return;

        container.innerHTML = '';
        
        const items = this.items[this.currentCategory] || [];
        
        items.forEach(item => {
            const isOwned = this.isOwned(this.currentCategory, item.id);
            const canAfford = Storage.getUser().coins >= item.price;
            
            const card = document.createElement('div');
            card.className = 'shop-item';
            
            if (this.currentCategory === 'bundles') {
                card.innerHTML = `
                    <div class="shop-item-preview">${item.preview}</div>
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    ${item.originalPrice ? `
                        <div style="text-decoration: line-through; opacity: 0.5; font-size: 0.9rem;">
                            <i class="fas fa-coins"></i> ${Utils.formatNumber(item.originalPrice)}
                        </div>
                    ` : ''}
                    <div class="shop-item-price">
                        <i class="fas fa-coins"></i> ${Utils.formatNumber(item.price)}
                    </div>
                    ${isOwned ? `
                        <div class="shop-item-owned">OWNED</div>
                        <button class="btn btn-secondary" disabled>Purchased</button>
                    ` : `
                        <button class="btn btn-primary" onclick="Shop.purchase('${this.currentCategory}', '${item.id}')" ${!canAfford ? 'disabled' : ''}>
                            ${canAfford ? 'Purchase' : 'Not Enough Coins'}
                        </button>
                    `}
                    <div class="achievement-rarity rarity-${item.rarity}">${item.rarity ? item.rarity.toUpperCase() : 'BUNDLE'}</div>
                `;
            } else {
                card.innerHTML = `
                    <div class="shop-item-preview">${item.preview}</div>
                    <h4>${item.name}</h4>
                    <div class="shop-item-price">
                        <i class="fas fa-coins"></i> ${Utils.formatNumber(item.price)}
                    </div>
                    ${isOwned ? `
                        <div class="shop-item-owned">OWNED</div>
                        <button class="btn btn-secondary" onclick="Shop.equip('${this.currentCategory}', '${item.id}')">
                            Equip
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="Shop.purchase('${this.currentCategory}', '${item.id}')" ${!canAfford ? 'disabled' : ''}>
                            ${canAfford ? 'Purchase' : 'Not Enough Coins'}
                        </button>
                    `}
                    ${item.rarity ? `<div class="achievement-rarity rarity-${item.rarity}">${item.rarity.toUpperCase()}</div>` : ''}
                `;
            }
            
            container.appendChild(card);
        });
    }

    /**
     * Check if item is owned
     */
    isOwned(category, itemId) {
        if (category === 'bundles') {
            const bundle = this.items.bundles.find(b => b.id === itemId);
            if (!bundle) return false;
            
            if (bundle.items === 'all') {
                // Check if all items are owned
                const allOwned = Object.keys(this.items).every(cat => {
                    if (cat === 'bundles') return true;
                    return this.items[cat].every(item => Storage.hasItem(cat, item.id));
                });
                return allOwned;
            }
            
            // Check if all bundle items are owned
            return bundle.items.every(itemId => {
                // Find which category this item belongs to
                for (const [cat, items] of Object.entries(this.items)) {
                    if (cat === 'bundles') continue;
                    if (items.some(i => i.id === itemId)) {
                        return Storage.hasItem(cat, itemId);
                    }
                }
                return false;
            });
        }
        
        return Storage.hasItem(category, itemId);
    }

    /**
     * Purchase item
     */
    purchase(category, itemId) {
        const items = this.items[category] || [];
        const item = items.find(i => i.id === itemId);
        
        if (!item) {
            Utils.notify('Item not found!', 'error');
            return;
        }
        
        if (this.isOwned(category, itemId)) {
            Utils.notify('You already own this item!', 'warning');
            return;
        }
        
        const user = Storage.getUser();
        if (user.coins < item.price) {
            Utils.notify('Not enough coins!', 'error');
            AudioManager.playSound('error');
            return;
        }
        
        // Handle bundle purchase
        if (category === 'bundles') {
            this.purchaseBundle(item);
            return;
        }
        
        // Deduct coins
        if (Storage.spendCoins(item.price)) {
            // Unlock item
            Storage.unlockItem(category, itemId);
            
            // Auto-equip if first of category
            const unlocks = Storage.get('unlocks');
            if (unlocks[category].length === 1) {
                Storage.equipItem(category, itemId);
            }
            
            Utils.notify(`Purchased: ${item.name}!`, 'success');
            AudioManager.playSound('success');
            
            this.updateDisplay();
            this.updateCurrency();
            
            // Check achievements
            AchievementSystem.checkProgress(`${category}_unlocked`, unlocks[category].length);
        }
    }

    /**
     * Purchase bundle
     */
    purchaseBundle(bundle) {
        const user = Storage.getUser();
        if (user.coins < bundle.price) {
            Utils.notify('Not enough coins!', 'error');
            AudioManager.playSound('error');
            return;
        }
        
        // Deduct coins
        if (!Storage.spendCoins(bundle.price)) return;
        
        // Unlock all items
        if (bundle.items === 'all') {
            // Unlock everything
            Object.keys(this.items).forEach(category => {
                if (category === 'bundles') return;
                this.items[category].forEach(item => {
                    Storage.unlockItem(category, item.id);
                });
            });
            
            Utils.notify('🎉 EVERYTHING UNLOCKED! 🎉', 'success');
            AudioManager.playSound('achievement');
            
            // Check complete collection achievement
            AchievementSystem.unlock('complete_collection');
        } else {
            // Unlock bundle items
            bundle.items.forEach(itemId => {
                // Find which category this item belongs to
                for (const [cat, items] of Object.entries(this.items)) {
                    if (cat === 'bundles') continue;
                    const item = items.find(i => i.id === itemId);
                    if (item) {
                        Storage.unlockItem(cat, itemId);
                    }
                }
            });
            
            Utils.notify(`Purchased: ${bundle.name}!`, 'success');
            AudioManager.playSound('success');
        }
        
        this.updateDisplay();
        this.updateCurrency();
    }

    /**
     * Equip item
     */
    equip(category, itemId) {
        if (!this.isOwned(category, itemId)) {
            Utils.notify('You don\'t own this item!', 'error');
            return;
        }
        
        Storage.equipItem(category, itemId);
        
        const items = this.items[category] || [];
        const item = items.find(i => i.id === itemId);
        
        Utils.notify(`Equipped: ${item.name}!`, 'success');
        AudioManager.playSound('click');
        
        this.updateDisplay();
    }

    /**
     * Update currency display
     */
    updateCurrency() {
        const user = Storage.getUser();
        
        document.getElementById('shop-coins').textContent = Utils.formatNumber(user.coins);
        document.getElementById('shop-gems').textContent = Utils.formatNumber(user.gems || 0);
        document.getElementById('user-coins').textContent = Utils.formatNumber(user.coins);
    }

    /**
     * Get featured items (daily rotation)
     */
    getFeaturedItems() {
        const today = new Date().toDateString();
        const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        
        // Use seed to randomly select featured items
        const featured = [];
        Object.keys(this.items).forEach(category => {
            if (category === 'bundles') return;
            const items = this.items[category];
            const index = seed % items.length;
            featured.push({ category, item: items[index] });
        });
        
        return featured;
    }
}

// Create global shop system
window.Shop = new ShopSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SHOP_ITEMS, ShopSystem };
}
