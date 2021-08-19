class Client {
    constructor() {
        this.playerNum = 1;
        this.engineP1 = null;
        this.engineP2 = null;
    }

    start() {
        let p1Board = [];
        let p2Board = [];

        let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

        for (let y = 0; y < 20; y++) {
            p1Board[y] = columns.map(x => new Square(x, y, "#p1 #board"));
            p2Board[y] = columns.map(x => new Square(x, y, "#p2 #board"));
        }

        this.engineP1 = new Engine(p1Board, 1);
        this.engineP2 = new Engine(p2Board, 2);

		socket.on("room joined", (p1Board, p2Board, p1Detritan, p2Detritan) => {
			this.engineP1.sync(p1Board, p1Detritan);
			this.engineP2.sync(p2Board, p2Detritan);
		});

		socket.on("move valid", (sequence, detritan, next, playerNum, clearedLines, points) => {
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
		});

		socket.on("move invalid", (message, detritan, board, playerNum) => {
			showWarning(message);

			const engine = this[`engineP${playerNum}`];

			engine.sync(board, detritan);
		});
    }
}