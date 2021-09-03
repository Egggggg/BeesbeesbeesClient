const { Engine } = require("../../detrista/scripts/engine");
const { Square } = require("../../detrista/scripts/square");
const shapes = require("./shapes.json");

let engine;

describe("with empty board", () => {
	beforeEach(() => {
		let board = [];
		let columns = new Array(20).fill(0);

		for (let x = 0; x < 10; x++) {
			board[x] = columns.map((e, y) => new Square(x, y));
		}

		engine = new Engine(board);
	});

	describe("move I left", () => {
		test("standard", () => {
			const expected = [
				[2, 1],
				[3, 1],
				[4, 1],
				[5, 1]
			];

			engine.spawn(shapes.i);
			engine.moveLeftRight(engine, -1);

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.i.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.i);
			engine.testMoveLeftRight(engine, -1);

			expect(engine.active.shape.test).toStrictEqual([2, 0]);
		});

		test("out of bounds", () => {
			const expected = [
				[0, 1],
				[1, 1],
				[2, 1],
				[3, 1]
			];

			engine.spawn(shapes.i);
			engine.doSequence("aaaaa".split(""));

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.i.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});
	});

	describe("move J right", () => {
		test("standard", () => {
			const expected = [
				[4, 0],
				[4, 1],
				[5, 1],
				[6, 1]
			];

			engine.spawn(shapes.j);
			engine.moveLeftRight(engine, 1);

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.j.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.j);
			engine.testMoveLeftRight(engine, 1);

			expect(engine.active.shape.test).toStrictEqual([4, 0])
		});

		test("out of bounds", () => {
			const expected = [
				[7, 0],
				[7, 1],
				[8, 1],
				[9, 1]
			];

			engine.spawn(shapes.j);
			engine.doSequence("dddddddd".split(""));

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.j.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});
	});

	describe("move L down", () => {
		test("standard", () => {
			const expected = [
				[5, 1],
				[3, 2],
				[4, 2],
				[5, 2]
			];

			engine.spawn(shapes.l);
			engine.moveUpDown(engine, 1);

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.l.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.l);
			engine.testMoveUpDown(engine, 1);

			expect(engine.active.shape.test).toStrictEqual([3, 1]);
		});

		test("out of bounds", () => {
			const expected = [
				[5, 18],
				[3, 19],
				[4, 19],
				[5, 19]
			];

			engine.spawn(shapes.l);
			engine.doSequence("ws".split(""));

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.l.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});
	});

	describe("hard drop O", () => {
		test("standard", () => {
			const expected = [
				[4, 18],
				[5, 18],
				[4, 19],
				[5, 19]
			];

			engine.spawn(shapes.o);
			engine.hardDrop(engine);
			
			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.o.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.o);
			engine.testHardDrop(engine);

			expect(engine.active.shape.test).toStrictEqual([4, 18]);
		});
	});

	describe("rotate S", () => {
		test("standard clockwise", () => {
			const expected = [
				[4, 0],
				[4, 1],
				[5, 1],
				[5, 2]
			];

			engine.spawn(shapes.s);
			engine.rotate(engine, 1);

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;
							expect(engine.board[x][y].getColorIndex()).toBe(shapes.s.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});

		test("standard counterclockwise", () => {
			const expected = [
				[3, 0],
				[3, 1],
				[4, 1],
				[4, 2]
			];

			engine.spawn(shapes.s);
			engine.rotate(engine, -1);

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;

							expect(engine.board[x][y].getColorIndex()).toBe(shapes.s.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});

		test("counterclockwise kick", () => {
			const expected = [
				[1, 0],
				[2, 0],
				[0, 1],
				[1, 1]
			];

			engine.spawn(shapes.s);
			engine.doSequence("eaaaaq".split(""));

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 20; y++) {
					let colored = false;

					for (let i = 0; i < expected.length; i++) {
						if (expected[i][0] === x && expected[i][1] === y) {
							colored = true;

							expect(engine.board[x][y].getColorIndex()).toBe(shapes.s.color);
						}
					}

					if (!colored) {
						expect(engine.board[x][y].getColorIndex()).toBe(0);
					}
				}
			}
		});
	});
});
