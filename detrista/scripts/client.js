class Client {
    constructor() {
		const width = 240;
		const height = 480;

		this.padding = 10;
		this.squareSize = Math.floor(width / 10);
        this.playerNum = 1;
        this.engineP1 = null;
        this.engineP2 = null;
		this.p1Stage = new Konva.Stage({
			container: "p1board",
			width: width + (this.padding * 2),
			height: height + (this.padding * 2)
		});
		this.p2Stage = new Konva.Stage({
			container: "p2board",
			width: width + (this.padding * 2),
			height: height + (this.padding * 2)
		});
    }

    start() {
		const dotLayer = new Konva.Layer();
		const borderLayer = new Konva.Layer();
		const border = new Konva.Rect({
			x: 0,
			y: 0,
			width: this.p1Stage.width(),
			height: this.p1Stage.height(),
			stroke: "#310865",
			strokeWidth: 20,
			cornerRadius: 20
		})

		borderLayer.add(border);

		for (let y = 0; y < 19; y++) {
			for (let x = 0; x < 9; x++) {
				const dot = new Konva.Circle({
					x: (x * this.squareSize) + this.squareSize + this.padding,
					y: (y * this.squareSize) + this.squareSize + this.padding,
					radius: 2,
					fill: "#752f73"
				});

				dotLayer.add(dot);
			}
		}

		this.p1Stage.add(borderLayer);
		this.p2Stage.add(borderLayer.clone());
		this.p1Stage.add(dotLayer);
		this.p2Stage.add(dotLayer.clone());

        let p1Board = [];
        let p2Board = [];

        let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

        for (let y = 0; y < 20; y++) {
            p1Board[y] = columns.map(x => new Square(x, y, "p1board"));
            p2Board[y] = columns.map(x => new Square(x, y, "p2board"));
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