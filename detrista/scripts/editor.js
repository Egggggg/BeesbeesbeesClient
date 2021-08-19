document.addEventListener("DOMContentLoaded", function() {
	const board = [];	
	const boardColumns = new Array(10).fill(0);
	const colorButtons = document.querySelectorAll(".colorbutton");
	const colorPreview = document.querySelector("#colorpreview");
	const editorColumns = new Array(5).fill(0);
	const editors = [[], [], [], [], []];
	const orientations = [
		{
			coords: [],
			end: [0, 0],
			origin: [4, 4]
		},
		{
			coords: [],
			end: [0, 0],
			origin: [4, 4]
		},
		{
			coords: [],
			end: [0, 0],
			origin: [4, 4]
		},
		{
			coords: [],
			end: [0, 0],
			origin: [4, 4]
		}
	];
	const SHA1 = new Hashes.SHA1;

	let autoadjust = true;
	let boardStart = [0, 0];
	let color = 1;
	let mouseDown = -1;
	let orientation = 0;

	for (let y = 0; y < 20; y++) {
		board[y] = boardColumns.map((e, x) => new Square(x, y, "#board"));
	}

	for (let i = 0; i < 5; i++) {
		for (let y = 0; y < 5; y++) {
			editors[i][y] = editorColumns.map((e, x) => new Square(x, y, `#editor${i}`))
		}
	}

	for (let i = 0; i < colorButtons.length; i++) {
		colorButtons[i].onclick = () => setColor(i);
	}

	document.body.onmouseup = () => {
		mouseDown = -1;
	}

	for (let i = 0; i < editors.length; i++) {
		for (let y = 0; y < editors[i].length; y++) {
			for (let x = 0; x < editors[i][y].length; x++) {
				editors[i][y][x].node.onmousedown = (e) => {
					e.preventDefault();

					if (e.button === 0) {
						if (color === 0) {
							clearSquare(i, x, y);
						} else {
							setSquare(i, x, y);
						}
						
						mouseDown = 0;
					} else if (e.button === 2) {
						clearSquare(i, x, y)
						mouseDown = 2
					}
				};

				editors[i][y][x].node.onmouseover = () => {
					if (mouseDown === 0) {
						if (color === 0) {
							clearSquare(i, x, y);
						} else {
							setSquare(i, x, y);
						}
					} else if (mouseDown === 2) {
						clearSquare(i, x, y);
					}
				}

				editors[i][y][x].node.oncontextmenu = (e) => {
					e.preventDefault();
				}
			}
		}
	}

	for (let y = 0; y < 20; y++) {
		for (let x = 0; x < 10; x++) {
			board[y][x].node.onclick = (e) => {
				if (e.button === 0) {
					redrawBoard([-1, -1], [-1, -1], [y, x]);
				}
			}
		}
	}

	let lastChoice = 0;

	document.querySelectorAll(".orientationradio").forEach((radio, i) => {
		radio.addEventListener("change", () => {
			if (lastChoice !== i) {
				lastChoice = i;

				redrawBoard([-1, -1], [-1, -1], [-1, -1], i);
			}
		});
	});

	document.querySelector("#autoadjust").addEventListener("change", () => {
		autoadjust = !autoadjust;
		redrawBoard();
	});

	const nameInput = document.querySelector("#name");
	const upload = document.querySelector("#upload");

	let lastName = "";

	nameInput.oninput = () => {
		if (nameInput.value.length > 15) {
			nameInput.value = lastName;
		}

		lastName = nameInput.value;
	}

	upload.onclick = () => {
		for (let i = 0; i < 4; i++) {
			if (orientations[i].coords.length === 0) {
				showStatus(`Orientation ${i+1} has no shape data.`);
				return;
			}
		}

		hideStatus();

		html2canvas(document.querySelector("#editor4")).then((canvas) => {
			canvas.toBlob((blob) => {
				const data = [];
				const numCoords = [];

				for (let i = 0; i < 4; i++) {
					const current = orientations[i];

					for (let e = 0; e < current.coords.length; e++) {
						if (autoadjust) {
							data.push(current.coords[e][0] - current.origin[0]);
							data.push(current.coords[e][1] - current.origin[1]);
						} else {
							data.push(current.coords[e][0]);
							data.push(current.coords[e][1]);
						}
					}

					numCoords.push(current.coords.length);
				}

				console.log(boardStart);


				socket.emit("upload shape", nameInput.value, SHA1.hex(currentUser.uid), data, color, boardStart, blob, numCoords);
			});
		});
	}

	function setColor(newColor) {
		color = newColor;
		colorPreview.style["background-color"] = colors[color];

		if (color === 0) {
			return;
		}

		for (let i = 0; i < editors.length; i++) {
			for (let y = 0; y < editors[i].length; y++) {
				for (let x = 0; x < editors[i][y].length; x++) {
					if (editors[i][y][x].color != "white") {
						editors[i][y][x].setColorFromIndex(color);
					}
				}
			}
		}

		for (let y = boardStart[0]; y < boardStart[0] + 4; y++) {
			for (let x = boardStart[1]; x < boardStart[1] + 4; x++) {
				if (board[y][x].color != "white") {
					board[y][x].setColorFromIndex(color);
				}
			}
		}
	}

	function setSquare(i, x, y) {
		if (i === 4) {
			editors[i][y][x].setColorFromIndex(color);
			return;
		}

		const index = orientations[i].coords.findIndex((e) => {
			return e[0] === y && e[1] === x;
		});

		if (index === -1) {
			let newOrigin = [...orientations[i].origin];
			let newEnd = [...orientations[i].end];

			editors[i][y][x].setColorFromIndex(color);
			orientations[i].coords.push([y, x]);

			if (y < orientations[i].origin[0]) {
				newOrigin[0] = y;
			}

			if (x < orientations[i].origin[1]) {
				newOrigin[1] = x;
			}

			if (y > orientations[i].end[0]) {
				newEnd[0] = y;
			}

			if (x > orientations[i].end[1]) {
				newEnd[1] = x;
			}

			if (i === orientation) {
				redrawBoard(newOrigin, newEnd);
			} else {
				orientations[i].origin = newOrigin;
				orientations[i].end = newEnd;
			}
		}
	}

	function clearSquare(i, x, y) {
		editors[i][y][x].setColorFromIndex(0);

		if (i === 4) {
			return;
		}

		const index = orientations[i].coords.findIndex(e => e[0] === y && e[1] === x);

		if (index === -1) {
			return;
		}

		let newOrigin = [...orientations[i].origin];
		let newEnd = [...orientations[i].end];

		if (y === orientations[i].origin[0]) {
			let square = false;

			for (let e = y; e < 5; e++) {
				const row = editors[i][e].map(j => j.getColorIndex());

				if (Math.max(...row) > 0) {
					newOrigin[0] = e;
					square = true;
					break;
				}
			}

			if (!square) {
				newOrigin[0] = 4;
			}
		}

		if (x === orientations[i].origin[1]) {
			let square = false;

			for (let e = x; e < 5; e++) {
				const column = editors[i].map(j => j[e].getColorIndex());

				if (Math.max(...column) > 0) {
					newOrigin[1] = e;
					square = true;
					break;
				}
			}

			if (!square) {
				newOrigin[1] = 4;
			}
		}

		if (y === orientations[i].end[0]) {
			let square = false;

			for (let e = y; e >= 0; e--) {
				const row = editors[i][e].map(j => j.getColorIndex());

				if (Math.max(...row) > 0) {
					newEnd[0] = e;
					square = true;
					break;
				}
			}

			if (!square) {
				newEnd[0] = 0;
			}
		}

		if (x === orientations[i].end[1]) {
			let square = false;

			for (let e = x; e >= 0; e--) {
				const column = editors[i].map(j => j[e].getColorIndex());

				if (Math.max(...column) > 0) {
					newEnd[1] = e;
					square = true;
					break;
				}
			}

			if (!square) {
				newEnd[1] = 0;
			}
		}

		orientations[i].coords.splice(index, 1);

		if (i === orientation) {
			redrawBoard(newOrigin, newEnd);
		}
	}

	function redrawBoard(newOrigin=[-1, -1], newEnd=[-1, -1], newBoardStart=[-1, -1], newOrientation=-1) {
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				board[y][x].setColorFromIndex(0);
			}
		}

		if (newBoardStart[0] === -1 && newBoardStart[1] === -1) {
			newBoardStart = [...boardStart];
		}

		if (newOrientation === -1) {
			newOrientation = orientation;
		}

		if (newOrigin[0] === -1 && newOrigin[1] === -1) {
			newOrigin = [...orientations[newOrientation].origin];
		}

		if (newEnd[0] === -1 && newEnd[1] === -1) {
			newEnd = [...orientations[newOrientation].end];
		}

		if (!autoadjust) {
			newOrigin = [0, 0];
			newEnd = [4, 4];
		}

		if ((newEnd[0] - newOrigin[0]) + newBoardStart[0] > 19) {
			newBoardStart[0] -= ((newEnd[0] - newOrigin[0]) + newBoardStart[0]) - 19;
		}

		if ((newEnd[1] - newOrigin[1]) + newBoardStart[1] > 9) {
			newBoardStart[1] -= ((newEnd[1] - newOrigin[1]) + newBoardStart[1]) - 9;
		}

		for (let y = 0; y < 5; y++) {
			for (let x = 0; x < 5; x++) {
				const boardY = y + newBoardStart[0] - newOrigin[0];
				const boardX = x + newBoardStart[1] - newOrigin[1];

				if (editors[newOrientation][y][x].getColorIndex() > 0) {
					board[boardY][boardX].setColorFromIndex(color);
				}
			}
		}

		if (autoadjust) {
			orientations[newOrientation].origin = [...newOrigin];
			orientations[newOrientation].end = [...newEnd];
		}

		boardStart = [...newBoardStart];
		orientation = newOrientation;
	}
});