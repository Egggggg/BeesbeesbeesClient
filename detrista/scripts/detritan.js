class Detritan {
	constructor(shape, board) {
		this.shape = shape;
		this.board = board;

		this.draw();
	}

	/**
	 * Moves the Detritan left (dir=-1) or right (dir=1)
	 * @function moveLeftRight
	 * @param {(-1 | 1)} dir          Direction to move
	 * @param {number}   times=1      Times to move in direction
	 * @param {number}   newOrient=-1 New orientation (for kicks)
	 * @returns {boolean}
	 */
	moveLeftRight(dir, times=1, newOrient=-1) {
		if (this.checkMoveLeftRight(dir, "global", times, newOrient)) {
			this.erase();
			this.shape.orientation = newOrient === -1 ? this.shape.orientation : newOrient;
			this.shape.global[0] += dir * times;
			this.draw();

			return true;
		}

		return false;
	}

	/**
	 * Checks if the Detritan can move left (dir=-1) or right (dir=1)
	 * @function checkMoveLeftRight
	 * @param {(-1 | 1)}            dir       Direction to move (left: -1, right: 1) 
	 * @param {("global" | "test")} from      Property to check
	 * @param {number}              times     Times to move in direction
	 * @param {number}              newOrient New orientation (for kicks)
	 * @returns {boolean}
	 */
	checkMoveLeftRight(dir, from, times=1, newOrient=-1) {
		newOrient = newOrient === -1 ? this.shape.orientation : newOrient;
		
		const data = this.shape.orientations[newOrient];
		let testPos = [...this.shape[from]];
		let valid = true;

		for (let i = 0; i < times; i++) {
			data.forEach((square) => {
				const coords = [testPos[0] + square[0], testPos[1] + square[1] + dir];

				if (coords[0] <= -1 || coords[0] >= 10) {
					valid = false;
					return;
				}
				
				if (this.board[coords[0]][coords[1]].full && !this.board[coords[0]][coords[1]].active) {
					valid = false;
					return;
				}
			});

			if (!valid) {
				return false;
			}

			testPos[0] += dir;
		}

		return true;
	}

	/**
	 * Moves the Detritan up (dir=-1) or down (dir=1)
	 * @function moveUpDown
	 * @param {(-1 | 1)} dir          Direction to move (up: -1, down: 1)
	 * @param {number}   times=1      Times to move
	 * @param {number}   newOrient=-1 New orientation (for kicks)
	 * @returns {boolean}
	 */
	moveUpDown(dir, times=1, newOrient=-1) {
		if (this.checkMoveUpDown(dir, "global", times, newOrient)) {
			this.erase();
			this.shape.orientation = newOrient === -1 ? this.shape.orientation : newOrient;
			this.shape.global[1] += dir * times;
			this.draw();

			return true;
		}

		return false;
	}

	/**
	 * Checks if the Detritan can move up (dir=-1) or down(dir=1)
	 * @function checkMoveUpDown
	 * @param {(-1 | 1)}            dir          Direction to move (up: -1, down: 1)
	 * @param {("global" | "test")} from         Property to check
	 * @param {number}              times=1      Times to move
	 * @param {number}              newOrient=-1 New orientation (for kicks)
	 * @returns {boolean}
	 */
	checkMoveUpDown(dir, from, times=1, newOrient=-1) {
		newOrient = newOrient === -1 ? this.shape.orientation : newOrient;
		
		const data = this.shape.orientations[newOrient];
		let testPos = [...this.shape[from]];
		let valid = true;

		for (let i = 0; i < times; i++) {
			data.forEach((square) => {
				const coords = [testPos[0] + square[0] + dir, testPos[1] + square[1]];

				if (coords[1] <= -1 || coords[1] >= 20) {
					valid = false;
					return;
				}

				if (this.board[coords[0]][coords[1]].full && !this.board[coords[0]][coords[1]].active) {
					valid = false;
					return;
				}
			});

			if (!valid) {
				return false;
			}

			testPos[1] += dir;
		}

		return true;
	}

	/**
	 * Rotates the Detritan by <by> orientations (multiples of 90 degrees clockwise)
	 * @function rotate
	 * @param {number} by Number of orientations to rotate by
	 * @returns {boolean}
	 */
	rotate(by) {
		while (by < 0) {
			by += 4;
		}

		if (this.checkRotate(by, "global")) {
			this.erase();
			this.shape.orientation = (this.shape.orientation + by) % 4;
			this.draw();

			return true;
		};

		return false;
	}

	/**
	 * Checks if the Detritan can rotate by <by> orientations (multiples of 90 degrees clockwise)
	 * @param {number}              by   Number of orientations to rotate by
	 * @param {("global" | "test")} from Property to check
	 * @returns {boolean}
	 */
	checkRotate(by, from) {
		const newOrient = (this.shape.orientation + by) % 4;

		console.log(newOrient);

		const data = this.shape.orientations[newOrient];
		let valid = true;

		console.log(data);

		data.forEach((square) => {
			const coords = [this.shape[from][0] + square[0], this.shape[from][1] + square[1]];

			if (coords[0] < 0 || coords[0] > 19 || coords[1] < 0 || coords[1] > 9) {
				valid = false;
				return;
			}

			if (this.board[coords[0]][coords[1]].full && !this.board[coords[0]][coords[1]].active) {
				valid = false;
				return;
			}
		});

		return valid;
	}

	/**
	 * Drops the Detritan as many times as possible
	 * Returns false only if it can't drop at all
	 * @function hardDrop
	 * @returns {boolean}
	 */
	hardDrop() {
		let valid = false;

		while (this.checkMoveUpDown(1, "global")) {
			this.moveUpDown(1);
			valid = true;
		}

		return valid;
	}

	/**
	 * Moves the test Detritan left (dir=-1) or right (dir=1)
	 * @function testMoveLeftRight
	 * @param {(-1 | 1)} dir          Direction to move
	 * @param {number}   times=1      Times to move in direction
	 * @param {number}   newOrient=-1 New orientation (for kicks)
	 * @returns {boolean}
	 */
	testMoveLeftRight(dir, times=1, newOrient=-1) {
		newOrient = newOrient === -1 ? this.shape.orientation : newOrient;

		if (this.checkMoveLeftRight(dir, "test", times, newOrient)) {
			this.shape.test[0] += dir * times;
			this.shape.testOrientation = newOrient

			return true;
		}

		return false;
	}

	/**
	 * Moves the test Detritan up (dir=-1) or down (dir=1)
	 * @function testMoveUpDown
	 * @param {(-1 | 1)} dir          Direction to move (up: -1, down: 1)
	 * @param {number}   times=1      Times to move
	 * @param {number}   newOrient=-1 New orientation (for kicks)
	 * @returns {boolean}
	 */
	testMoveUpDown(dir, times=1, newOrient=-1) {
		newOrient = newOrient === -1 ? this.shape.orientation : newOrient;

		if (this.checkMoveUpDown(dir, "test", times, newOrient)) {
			this.shape.test[1] += dir * times;
			this.shape.testOrientation = newOrient;

			return true;
		}

		return false;
	}

	/**
	 * Drops the test Detritan as many times as possible
	 * Returns false only if it can't drop at all
	 * @function hardDrop
	 * @returns {boolean}
	 */
	testHardDrop() {
		let valid = false;

		while (this.checkMoveUpDown(1, "test")) {
			this.testMoveUpDown(1);
			valid = true;
		}

		return valid;
	}

	/**
	 * Rotates the test Detritan by <by> orientations (multiples of 90 degrees clockwise)
	 * @function rotate
	 * @param {number} by Number of orientations to rotate by
	 * @returns {boolean}
	 */
	testRotate(by) {
		while (by < 0) {
			by += 4;
		}

		if (this.checkRotate(by, "test")) {
			this.shape.testOrientation = (this.shape.testOrientation + by) % 4;

			return true;
		}

		return false;
	}
	
	/**
	 * Places the Detritan on the board
	 * Sets the corresponding cells of the board to the Detritan's color
	 * @function place
	 */
	place() {
		this.erase();

		for (let square of this.shape.orientations[this.shape.orientation]) {
			const coord = [this.shape.global[0] + square[0], this.shape.global[1] + square[1]];

			this.board[coord[0]][coord[1]].setColorFromIndex(this.shape.color);
		};

		this.shape.global = [...this.shape.start];
	}

	/**
	 * Erases the Detritans coordinates
	 * Used before redrawing the Detritan
	 * @function erase
	 */
	erase() {
		for (let square of this.shape.orientations[this.shape.orientation]) {
			const coord = [this.shape.global[0] + square[0], this.shape.global[1] + square[1]];

			this.board[coord[0]][coord[1]].setColorFromIndex(0);
			this.board[coord[0]][coord[1]].active = false;
		};
	}

	/**
	 * Draws the Detritans coordinates in the Detritans color
	 * @function draw
	 */
	draw() {
		for (let square of this.shape.orientations[this.shape.orientation]) {
			const coord = [this.shape.global[0] + square[0], this.shape.global[1] + square[1]];

			this.board[coord[0]][coord[1]].setColorFromIndex(this.shape.color);
			this.board[coord[0]][coord[1]].active = true;
		};
	}
}

module.exports = {
	Detritan: Detritan
}