const { Engine } = require("../../detrista/scripts/engine")
const shapes = require("shapes.json");

let engine;

beforeEach(() => {
	let board;
	let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

	for (let y = 0; y < 20; y++) {
		board[y] = columns.map(x => new Square(x, y));
	}

	engine = new Engine(board);
});

describe("test I detritan", () => {
	test("check move left", () => {

	});
});