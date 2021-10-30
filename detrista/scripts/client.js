class Client {
    constructor() {
		this.width = 240;
		this.height = 480;
		this.padding = 10;
		this.squareSize = Math.floor(width / 10);
        this.playerNum = 1;
        this.engineP1 = null;
        this.engineP2 = null;
    }

    start() {
		let p1Board;
		let p2Board;

		[p1Board, p2Board] = batchDrawBoards(["p1board", "p2board"], this.width, this.height, this.padding, this.squareSize);

		let columns = new Array(20).fill(0);

        for (let x = 0; x < 10; y++) {
            p1Board[x] = columns.map((e, y) => new Square(x, y, "p1board"));
            p2Board[x] = columns.map((e, y) => new Square(x, y, "p2board"));
        }

        this.engineP1 = new Engine(p1Board, 1);
        this.engineP2 = new Engine(p2Board, 2);

		socket.on("room joined", () => this.onJoined);
		socket.on("move valid", () => this.onValid);
		socket.on("move invalid", () => this.onInvalid);
    }

	/**
	 * Fires on "room joined" event
	 * Syncs the boards and Detritans with the server response
	 * @function onJoined
	 * @param {number[][]} p1Board 
	 * @param {number[][]} p2Board 
	 * @param {Object} p1Detritan 
	 * @param {Object} p2Detritan 
	 */
	onJoined(p1Board, p2Board, p1Detritan, p2Detritan) {
		this.engineP1.sync(p1Board, p1Detritan);
		this.engineP2.sync(p2Board, p2Detritan);
	}

	/**
	 * Fires on "move valid" event
	 * Performs the move and sets the new Detritan
	 * @function onValid
	 * @param {string} sequence 
	 * @param {Object} detritan 
	 * @param {Object} next 
	 * @param {number} playerNum 
	 * @param {number} clearedLines 
	 * @param {number} points 
	 */
	onValid(sequence, detritan, next, playerNum, clearedLines, points) {
		const engine = this[`engineP${playerNum}`];

		engine.sequenceInput.value = "";

		engine.active.erase();
		engine.spawn(detritan);
		
		engine.doSequence(sequence, 50).then(() => {
			engine.spawn(next);

			console.log(clearedLines);

			if (clearedLines.length > 0) {
				engine.clear(clearedLines);
				engine.setPoints(engine.points + points);
			}
		});
	}

	/**
	 * Fires on "move invalid" event
	 * Displays the error message and resets the Detritan and board
	 * @function onInvalid
	 * @param {string} message 
	 * @param {Object} detritan 
	 * @param {number[][]} board 
	 * @param {number} playerNum 
	 */
	onInvalid(message, detritan, board, playerNum) {
		showWarning(message);

		const engine = this[`engineP${playerNum}`];

		engine.sync(board, detritan);
	}
}