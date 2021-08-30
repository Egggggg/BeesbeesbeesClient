const { Engine } = require("../../detrista/scripts/engine");
const { Square } = require("../../detrista/scripts/square");
const shapes = require("./shapes.json");

let engine;

describe("with empty board", () => {
	beforeEach(() => {
		let board = [];
		let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

		for (let y = 0; y < 20; y++) {
			board[y] = columns.map(x => new Square(x, y));
		}

		engine = new Engine(board);
	});

	describe("move I left", () => {
		test("check move I left", () => {
			engine.spawn(shapes.i);
			engine.moveLeftRight(engine, -1);

			for (let i = 2; i < 6; i++) {
				expect(engine.board[1][i].getColorIndex()).toBe(shapes.i.color);
			}
		});

		test("check test move I left", () => {
			engine.spawn(shapes.i);
			engine.testMoveLeftRight(engine, -1);

			expect(engine.active.shape.test).toStrictEqual([0, 2]);
		});

		test("check move I left out of bounds", () => {
			engine.spawn(shapes.i);
			
			engine.doSequence("aaaaa".split(""));

			for (let i = 0; i < 4; i++) {
				expect(engine.board[1][i].getColorIndex()).toBe(shapes.i.color);
			}
		});
	});

	describe("move J right", () => {
		test("check move J right", () => {
			engine.spawn(shapes.j);
			engine.moveLeftRight(engine, 1);

			expect(engine.board[0][4].getColorIndex()).toBe(shapes.j.color);

			for (let i = 4; i < 7; i++) {
				expect(engine.board[1][i].getColorIndex()).toBe(shapes.j.color);
			}
		});

		test("check test move J right", () => {
			engine.spawn(shapes.j);
			engine.testMoveLeftRight(engine, 1);

			expect(engine.active.shape.test).toStrictEqual([0, 4])
		});

		test("check move J right out of bounds", () => {
			engine.spawn(shapes.j);
			engine.doSequence("dddddddd".split(""));

			expect(engine.board[0][7].getColorIndex()).toBe(shapes.j.color);

			for (let i = 7; i < 10; i++) {
				expect(engine.board[1][i].getColorIndex()).toBe(shapes.j.color);
			}
		});
	});

	describe("move L down", () => {
		test("check move L down", () => {
			engine.spawn(shapes.l);
			engine.moveUpDown(engine, 1);

			expect(engine.board[1][5].getColorIndex()).toBe(shapes.l.color);

			for (let i = 3; i < 6; i++) {
				expect(engine.board[2][i].getColorIndex()).toBe(shapes.l.color);
			}
		});

		test("check test move L down", () => {
			engine.spawn(shapes.l);
			engine.testMoveUpDown(engine, 1);

			expect(engine.active.shape.test).toStrictEqual([1, 3]);
		});

		test("check move L down out of bounds", () => {
			engine.spawn(shapes.l);
			engine.doSequence("ws".split(""));

			expect(engine.board[18][5].getColorIndex()).toBe(shapes.l.color);

			for (let i = 3; i < 6; i++) {
				expect(engine.board[19][i].getColorIndex()).toBe(shapes.l.color);
			}
		});
	});

	describe("hard drop O", () => {
		test("check hard drop O", () => {
			engine.spawn(shapes.o);
			engine.hardDrop(engine);

			for (let x = 4; x < 6; x++) {
				for (let y = 18; y < 20; y++) {
					expect(engine.board[y][x].getColorIndex()).toBe(shapes.o.color);
				}
			}
		});

		test("check test hard drop O", () => {
			engine.spawn(shapes.o);
			engine.testHardDrop(engine);

			expect(engine.active.shape.test).toStrictEqual([18, 4]);
		});
	});
});
