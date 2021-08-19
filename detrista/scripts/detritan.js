class Detritan {
	constructor(shape, board) {
		this.shape = shape;
		this.board = board;

		console.log(this.shape);

		this.draw();
	}

	moveLeftRight(dir, times=1, newOrient=-1) {
		if (this.checkMoveLeftRight(dir, "global", times, newOrient)) {
			this.erase();
			this.shape.orientation = newOrient === -1 ? this.shape.orientation : newOrient;
			this.shape.global[1] += dir * times;
			this.draw();

			return true;
		}

		return false;
	}

	checkMoveLeftRight(dir, from, times=1, newOrient=-1) {
		newOrient = newOrient === -1 ? this.shape.orientation : newOrient;
		
		const data = this.shape.orientations[newOrient];
		let testPos = [...this.shape[from]];
		let valid = true;

		for (let i = 0; i < times; i++) {
			data.forEach((square) => {
				const coords = [testPos[0] + square[0], testPos[1] + square[1] + dir];

				if (coords[1] <= -1 || coords[1] >= 10) {
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

	moveUpDown(dir, times=1, newOrient=-1) {
		if (this.checkMoveUpDown(dir, "global", times, newOrient)) {
			this.erase();
			this.shape.orientation = newOrient === -1 ? this.shape.orientation : newOrient;
			this.shape.global[0] += dir * times;
			this.draw();

			return true;
		}

		return false;
	}

	checkMoveUpDown(dir, from, times=1, newOrient=-1) {
		newOrient = newOrient === -1 ? this.shape.orientation : newOrient;
		
		const data = this.shape.orientations[newOrient];
		let testPos = [...this.shape[from]];
		let valid = true;

		for (let i = 0; i < times; i++) {
			data.forEach((square) => {
				const coords = [testPos[0] + square[0] + dir, testPos[1] + square[1]];

				if (coords[0] <= -1 || coords[0] >= 20) {
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

	hardDrop() {
		let valid = false;

		while (this.checkMoveUpDown(1, "global")) {
			this.moveUpDown(1);
			valid = true;
		}

		return valid;
	}

	testMoveLeftRight(dir, times=1, newOrient=-1) {
		if (this.checkMoveLeftRight(dir, "test", times)) {
			this.shape.test[1] += dir * times;

			return true;
		}

		return false;
	}

	testMoveUpDown(dir, times=1, newOrient=-1) {
		if (this.checkMoveUpDown(dir, "test", times)) {
			this.shape.test[0] += dir * times;
			
			return true;
		}

		return false;
	}

	testHardDrop() {
		let valid = false;

		while (this.checkMoveUpDown(1, "test")) {
			this.testMoveUpDown(1);
			valid = true;
		}

		return valid;
	}

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

	place() {
		this.erase();

		for (let square of this.shape.orientations[this.shape.orientation]) {
			const coord = [this.shape.global[0] + square[0], this.shape.global[1] + square[1]];

			this.board[coord[0]][coord[1]].setColorFromIndex(this.shape.color);
		};

		this.shape.global = [...this.shape.start];
	}

	erase() {
		for (let square of this.shape.orientations[this.shape.orientation]) {
			const coord = [this.shape.global[0] + square[0], this.shape.global[1] + square[1]];

			this.board[coord[0]][coord[1]].setColorFromIndex(0);
			this.board[coord[0]][coord[1]].active = false;
		};
	}

	draw() {
		for (let square of this.shape.orientations[this.shape.orientation]) {
			const coord = [this.shape.global[0] + square[0], this.shape.global[1] + square[1]];

			this.board[coord[0]][coord[1]].setColorFromIndex(this.shape.color);
			this.board[coord[0]][coord[1]].active = true;
		};
	}
}