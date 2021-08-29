const { Engine } = require("../../detrista/scripts/engine");
const { Square } = require("../../detrista/scripts/square");
const shapes = require("./shapes.json");

let engine;

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

		expect(engine.active.shape.test[1]).toBe(2);
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
});