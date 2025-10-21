/**
 * QUANTUM TRAIL - GAME CONTROLLER UI
 * Handles game UI interactions
 */

class GameController {
    constructor() {
        this.engine = null;
    }

    /**
     * Start game with mode
     */
    startMode(mode) {
        // Hide mode selection
        document.getElementById('mode-selection').style.display = 'none';
        document.getElementById('game-area').style.display = 'flex';

        // Initialize engine
        const canvas = document.getElementById('game-canvas');
        this.engine = new GameCore();
        this.engine.init(canvas, mode);
        this.engine.start();
    }

    /**
     * Pause game
     */
    pause() {
        if (this.engine) {
            this.engine.togglePause();
        }
    }

    /**
     * Resume game
     */
    resume() {
        if (this.engine) {
            this.engine.togglePause();
        }
    }

    /**
     * Restart game
     */
    restart() {
        if (this.engine) {
            // Hide screens
            document.getElementById('game-over-screen').classList.remove('active');
            document.getElementById('pause-menu').classList.remove('active');
            
            // Restart
            this.engine.reset();
            this.engine.start();
        }
    }

    /**
     * Quit to menu
     */
    quit() {
        if (this.engine) {
            this.engine.stop();
        }

        // Show mode selection
        document.getElementById('game-area').style.display = 'none';
        document.getElementById('mode-selection').style.display = 'block';
        
        // Hide screens
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('pause-menu').classList.remove('active');
        
        // Navigate to play page
        App.navigateTo('play');
    }
}

// Create global game controller
window.Game = new GameController();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}
