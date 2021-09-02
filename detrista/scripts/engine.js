const { Detritan } = require("./detritan");

class Engine {
	constructor(board, playerNum=-1) {
		this.board = board;
		this.playerNum = playerNum;

		this.active = null;
		this.lastSequence = "";
		this.otherPlayerNum = playerNum === 1 ? 2 : 1;
		this.points = 0;

		if (this.playerNum !== -1) {
			this.pointsNode = document.querySelector(`#p${this.playerNum} #score`);

			this.sequenceInput = document.querySelector(`#p${this.playerNum} #sequence`)
			this.sequenceInput.oninput = () => {
				if (this.sequenceInput.value != "") {
					if (this.sequenceInput.value.length > 30) {
						this.sequenceInput.value = this.lastSequence;
						return;
					}

					if (this.checkInput(this.sequenceInput.value)) {
						if (this.checkMove(this.sequenceInput.value)) {
							this.doSequence(this.sequenceInput.value.split(""), 0);
							this.lastSequence = this.sequenceInput.value;

							return;
						}
					}

					this.sequenceInput.value = this.lastSequence;
				} else {
					this.active.erase();
					this.active.shape.global = [...this.active.shape.start];
					this.active.shape.orientation = 0;
					this.active.draw();
					this.lastSequence = this.sequenceInput.value;
				}
			}

			document.querySelector(`#p${this.playerNum} #confirm`).onclick = () => {
				if (this.sequenceInput.value === "") {
					return;
				}

				socket.emit("submit move", this.playerNum, this.sequenceInput.value)
			}
		}

		this.controls = {
			"a": [this.moveLeftRight, this, -1],
			"A": [this.moveLeftRight, this, -1, 2],
			"d": [this.moveLeftRight, this, 1],
			"D": [this.moveLeftRight, this, 1, 2],
			"s": [this.moveUpDown, this, 1],
			"S": [this.moveUpDown, this, 1, 2],
			"w": [this.hardDrop, this],
			"W": [this.hardDrop, this],
			"q": [this.rotate, this, -1],
			"Q": [this.rotate, this, 2],
			"e": [this.rotate, this, 1],
			"E": [this.rotate, this, 2]
		};

		this.testControls = {
			"a": [this.testMoveLeftRight, this, -1],
			"A": [this.testMoveLeftRight, this, -1, 2],
			"d": [this.testMoveLeftRight, this, 1],
			"D": [this.testMoveLeftRight, this, 1, 2],
			"s": [this.testMoveUpDown, this, 1],
			"S": [this.testMoveUpDown, this, 1, 2],
			"w": [this.testHardDrop, this],
			"W": [this.testHardDrop, this],
			"q": [this.testRotate, this, -1],
			"Q": [this.testRotate, this, 2],
			"e": [this.testRotate, this, 1],
			"E": [this.testRotate, this, 2]
		}
	}

	invoke(data) {
		if (data === undefined) {
			return false;
		}

		if (!data[0](...data.slice(1))) {
			return false;
		}

		return true;
	}

	moveLeftRight(parent, dir, times=1) {
		return parent.active.moveLeftRight(dir, times);
	}

	moveUpDown(parent, dir, times=1) {
		return parent.active.moveUpDown(dir, times);
	}

	hardDrop(parent) {
		return parent.active.hardDrop()
	}

	rotate(parent, by) {
		return parent.active.rotate(by);
	}

	testMoveLeftRight(parent, dir, times=1) {
		return parent.active.testMoveLeftRight(dir, times);
	}

	testMoveUpDown(parent, dir, times=1) {
		return parent.active.testMoveUpDown(dir, times);
	}

	testHardDrop(parent) {
		return parent.active.testHardDrop();
	}

	testRotate(parent, by) {
		return parent.active.testRotate(by);
	}

	spawn(shape) {
		this.active = new Detritan(shape, this.board);
		this.active.erase();
		this.active.shape.global = [...this.active.shape.start];
		this.active.draw();
		this.active.shape.test = [...this.active.shape.start];
		this.active.shape.testOrientation = this.active.shape.orientation;
	}

	checkInput(sequence) {
		const validChars = Object.keys(this.controls);
		let valid = true;

		sequence.split("").forEach((char) => { 
			if (!validChars.includes(char)) {
				valid = false;
				return;
			}
		});

		return valid;
	}

	checkMove(sequence) {
		let valid = true;

		this.active.shape.test = [...this.active.shape.start]

		sequence.split("").forEach((char) => {
			valid = this.invoke(this.testControls[char]);

			if (!valid) {
				return false;
			}
		});
		
		return valid;
	}

	timedSequence(sequence, time) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.invoke(this.controls[sequence[0]]);

				if (sequence.length > 1) {
					this.timedSequence(sequence.slice(1), time).then(() => {
						resolve();
					});
				} else {
					resolve();
				}
			}, time);
		});
	}

	doSequence(sequence, time=0) {
		this.active.erase();
		this.active.shape.global = [...this.active.shape.start];
		this.active.shape.orientation = 0;
		this.active.draw();
		
		if (sequence.length === 0) {
			return Promise.resolve();
		}

		if (time === 0) {
			return new Promise((resolve, reject) => {
				sequence.forEach((char) => {
					this.invoke(this.controls[char]);
				});
	
				resolve()
			});
		} else {
			return new Promise((resolve, reject) => {
				this.timedSequence(sequence, time).then(() => {
					this.active.place();
					resolve();
				});
			})
		}
	}

	sync(board, detritan) {
		for (let x = 0; x < board.length; x++) {
			for (let x = 0; y < board[x].length; y++) {
				this.board[x][y].setColorFromIndex(board[x][y]);
			}
		}

		this.spawn(detritan);
	}

	clear(lines) {
		this.lower(Math.min(...lines), lines.length);
	}

	lower(top, times) {
		console.log(top, times);

		let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

		for (let y = top - 1; y >= 0; y--) {
			for (let x = 0; x < 10; x++) {
				if (!this.board[x][y].active) {
					this.board[x][y + times].setColor(this.board[x][y].color);
					this.board[x][y].setColorFromIndex(0);
				}
			}
		}
	}

	setPoints(newPoints) {
		this.points = newPoints;

		if (this.playerNum !== -1) {
			this.pointsNode.innerHTML = `${this.points} Points`;
		}
	}
}

module.exports = {
	Engine: Engine
}

