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
					if (expected.includes([x, y])) {
						expect(engine.board[x][y].getColorIndex()).toBe(shapes.i.color);
					} else {
						if (engine.board[x][y].getColorIndex() !== 0) {
							console.log(x, y);
						}

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
			engine.spawn(shapes.i);
			
			engine.doSequence("aaaaa".split(""));

			for (let i = 0; i < 4; i++) {
				expect(engine.board[i][1].getColorIndex()).toBe(shapes.i.color);
			}
		});
	});

	describe("move J right", () => {
		test("standard", () => {
			engine.spawn(shapes.j);
			engine.moveLeftRight(engine, 1);

			expect(engine.board[4][0].getColorIndex()).toBe(shapes.j.color);

			for (let i = 4; i < 7; i++) {
				expect(engine.board[i][1].getColorIndex()).toBe(shapes.j.color);
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.j);
			engine.testMoveLeftRight(engine, 1);

			expect(engine.active.shape.test).toStrictEqual([4, 0])
		});

		test("out of bounds", () => {
			engine.spawn(shapes.j);
			engine.doSequence("dddddddd".split(""));

			expect(engine.board[7][0].getColorIndex()).toBe(shapes.j.color);

			for (let i = 7; i < 10; i++) {
				expect(engine.board[i][1].getColorIndex()).toBe(shapes.j.color);
			}
		});
	});

	describe("move L down", () => {
		test("standard", () => {
			engine.spawn(shapes.l);
			engine.moveUpDown(engine, 1);

			expect(engine.board[5][1].getColorIndex()).toBe(shapes.l.color);

			for (let i = 3; i < 6; i++) {
				expect(engine.board[i][2].getColorIndex()).toBe(shapes.l.color);
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.l);
			engine.testMoveUpDown(engine, 1);

			expect(engine.active.shape.test).toStrictEqual([3, 1]);
		});

		test("out of bounds", () => {
			engine.spawn(shapes.l);
			engine.doSequence("ws".split(""));

			expect(engine.board[5][18].getColorIndex()).toBe(shapes.l.color);

			for (let i = 3; i < 6; i++) {
				expect(engine.board[i][19].getColorIndex()).toBe(shapes.l.color);
			}
		});
	});

	describe("hard drop O", () => {
		test("standard", () => {
			engine.spawn(shapes.o);
			engine.hardDrop(engine);

			for (let x = 4; x < 6; x++) {
				for (let y = 18; y < 20; y++) {
					expect(engine.board[x][y].getColorIndex()).toBe(shapes.o.color);
				}
			}
		});

		test("test pos", () => {
			engine.spawn(shapes.o);
			engine.testHardDrop(engine);

			expect(engine.active.shape.test).toStrictEqual([4, 18]);
		});
	});
});
