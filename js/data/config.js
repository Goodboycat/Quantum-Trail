/**
 * QUANTUM TRAIL - CONFIGURATION
 * Game settings and constants
 */

const CONFIG = {
    // Canvas settings
    canvas: {
        width: 800,
        height: 800,
        defaultBgColor: '#050a1a'
    },
    
    // Player settings
    player: {
        radius: 12,
        defaultSpeed: 4,
        boostedSpeed: 7.5,
        startX: 400,
        startY: 400
    },
    
    // Trail settings
    trail: {
        length: 60,
        minDistance: 10,
        fadeOpacity: 0.2,
        maxOpacity: 0.8,
        minSize: 8,
        maxSize: 16
    },
    
    // Gameplay settings
    gameplay: {
        initialTime: 8.0,
        timeAttackDuration: 120,
        scoringRate: 25,
        minComboDistance: 20,
        maxCombo: 50,
        comboIncrement: 0.1
    },
    
    // Spawning settings
    spawning: {
        obstacleRate: 3000,
        powerUpRate: 5000,
        maxObstacles: 10,
        maxPowerUps: 3
    },
    
    // Power-up settings
    powerUps: {
        shieldDuration: 10000,
        speedDuration: 10000,
        magnetDuration: 10000,
        timeBonus: 2.0
    },
    
    // Collision settings
    collision: {
        playerWallBuffer: 12,
        trailSelfBuffer: 10,
        powerUpRange: 25,
        obstacleRange: 20
    },
    
    // Visual settings
    visual: {
        particleCount: 10,
        particleLife: 30,
        particleSpeed: { min: 2, max: 5 },
        gridSize: 50,
        gridOpacity: 0.1
    },
    
    // Performance settings
    performance: {
        targetFPS: 60,
        frameTime: 16.67,
        maxDeltaTime: 100
    },
    
    // API endpoints (for future online features)
    api: {
        baseUrl: 'https://api.quantumtrail.game',
        endpoints: {
            stats: '/api/stats',
            leaderboard: '/api/leaderboard',
            submit: '/api/submit'
        }
    },
    
    // Storage keys
    storage: {
        prefix: 'qt_',
        version: '1.0.0'
    }
};

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
