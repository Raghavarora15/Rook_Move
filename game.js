const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', // Specify the id of the game canvas container
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);


function preload() {
    // Load game assets like chessboard and rook sprite
}
// Implement Socket.io events for player moves and game outcomes
let playerTurn = 0; // 0 for player 1, 1 for player 2
let rook; // Rook sprite
const BOARD_SIZE = 8;
const TILE_SIZE = 80;
const BOARD_OFFSET = 50;

function create() {
    // Create chessboard
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            let tileColor = (i + j) % 2 === 0 ? 0xFFFFFF : 0x000000;
            let tile = this.add.rectangle(
                j * TILE_SIZE + BOARD_OFFSET,
                i * TILE_SIZE + BOARD_OFFSET,
                TILE_SIZE,
                TILE_SIZE,
                tileColor
            );

            tile.setOrigin(0, 0);
        }
    }

    // Create rook sprite at the top-right corner
    rook = this.add.sprite(
        BOARD_SIZE * TILE_SIZE + BOARD_OFFSET,
        BOARD_OFFSET,
        'rook'
    );
    rook.setOrigin(0, 0);

    // Set interactive for rook sprite
    rook.setInteractive();
    this.input.setDraggable(rook);

    // Handle drag events for rook movement
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = Phaser.Math.Snap.Floor(dragX, TILE_SIZE, BOARD_OFFSET);
        gameObject.y = Phaser.Math.Snap.Floor(dragY, TILE_SIZE, BOARD_OFFSET);
    });

    // Handle rook movement logic
    this.input.on('dragend', function (pointer, gameObject) {
        let x = Math.floor((gameObject.x - BOARD_OFFSET) / TILE_SIZE);
        let y = Math.floor((gameObject.y - BOARD_OFFSET) / TILE_SIZE);

        // Check valid moves (left or down)
        if (x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE) {
            if ((x <= rook.x / TILE_SIZE && y >= rook.y / TILE_SIZE) || (y >= rook.y / TILE_SIZE && x <= rook.x / TILE_SIZE)) {
                // Valid move
                // TODO: Emit Socket.io event to update opponent about the move
                // TODO: Check win condition
                // TODO: Switch player turn
            } else {
                // Invalid move, revert the rook to the previous position
                gameObject.x = Phaser.Math.Snap.Floor(rook.x, TILE_SIZE, BOARD_OFFSET);
                gameObject.y = Phaser.Math.Snap.Floor(rook.y, TILE_SIZE, BOARD_OFFSET);
            }
        } else {
            // Invalid move, revert the rook to the previous position
            gameObject.x = Phaser.Math.Snap.Floor(rook.x, TILE_SIZE, BOARD_OFFSET);
            gameObject.y = Phaser.Math.Snap.Floor(rook.y, TILE_SIZE, BOARD_OFFSET);
        }
    });
}
