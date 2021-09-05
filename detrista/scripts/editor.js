let currentOrientation = 0;

document.addEventListener("DOMContentLoaded", function() {
	const board = [];	
	const boardRows = new Array(20).fill(0);
	const colorButtons = document.querySelectorAll(".colorbutton");
	const colorPreview = document.querySelector("#colorpreview");
	const editorRows = new Array(5).fill(0);
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
		},
		{
			coords: []
		}
	];
	const orientationNames = [
		"0",
		"R",
		"2",
		"L"
	];
	const padding = 10;
	const squareSize = 24;

	let autorotate = true;
	let boardStart = [0, 0];
	let color = 1;
	let mouseDown = -1;

	const stages = [];

	stages.push(new Konva.Stage({
		container: "board",
		width: (squareSize * 10) + (padding * 2),
		height: (squareSize * 20) + (padding * 2)
	}));

	for (let i = 0; i < 5; i++) {
		stages.push(new Konva.Stage({
			container: `editor${i}`,
			width: (squareSize * 5) + (padding * 2),
			height: (squareSize * 5) + (padding * 2)
		}));
	}

	const boardDotLayer = new Konva.Layer();
	const boardBorderLayer = new Konva.Layer();
	const editorDotLayer = new Konva.Layer();
	const editorBorderLayer = new Konva.Layer();

	const boardBorder = new Konva.Rect({
		x: 0,
		y: 0,
		width: stages[0].width(),
		height: stages[0].height(),
		stroke: "#310865",
		strokeWidth: 20,
		cornerRadius: 20
	});
	const editorBorder = new Konva.Rect({
		x: 0,
		y: 0,
		width: stages[1].width(),
		height: stages[1].height(),
		stroke: "#310865",
		strokeWidth: 20,
		cornerRadius: 20
	});

	boardBorderLayer.add(boardBorder);
	editorBorderLayer.add(editorBorder.clone());

	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 19; y++) {
			const dot = new Konva.Circle({
				x: (x * squareSize) + squareSize + padding,
				y: (y * squareSize) + squareSize + padding,
				radius: 2,
				fill: "#752f73"
			});

			boardDotLayer.add(dot);

			if (x < 5 && y < 5) {
				editorDotLayer.add(dot.clone());
			}
		}
	}

	

	for (let x = 0; x < 10; x++) {
		board[x] = boardRows.map((e, y) => new Square(x, y, "#board"));
	}

	for (let i = 0; i < 5; i++) {
		for (let x = 0; x < 5; x++) {
			editors[i][x] = editorRows.map((e, y) => new Square(x, y, `#editor${i}`))
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

	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 20; y++) {
			board[x][y].node.onclick = (e) => {
				if (e.button === 0) {
					redrawBoard([-1, -1], [-1, -1], [x, y]);
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

	document.querySelector("#autorotate").addEventListener("change", () => {
		autorotate = document.querySelector("#autorotate").value;
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
				showStatus(`Orientation ${orientationNames[i]} has no shape data.`);
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
						data.push(current.coords[e][0]);
						data.push(current.coords[e][1]);
					}

					numCoords.push(current.coords.length);
				}

				socket.emit("upload shape", nameInput.value, SHA1.hex(currentUser.uid), data, color, boardStart, blob, numCoords);
			});
		});
	}

	function setColor(newColor) {
		color = newColor;
		colorPreview.style["background-color"] = colors[color];
	
		// color 0 only exists to erase
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
	
		for (let x = boardStart[0]; x < boardStart[0] + 4; x++) {
			for (let y = boardStart[1]; y < boardStart[1] + 4; y++) {
				if (board[x][y].color !== "white") {
					board[x][y].setColorFromIndex(color);
				}
			}
		}
	}
	
	function setSquare(i, x, y) {
		// if the preview editor was clicked
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
	
			if (i === 0 && autorotate) {
				const size = Math.max(newEnd) - Math.min(newOrigin);
	
				const x1 = size - y;
				const y1 = x;
				const x2 = size - y1;
				const y2 = x1;
				const x3 = size - y2;
				const y3 = x2;
	
				setSquare(1, x1, y1);
				setSquare(2, x2, y2);
				setSquare(3, x3, y3);
			}
	
			if (i === currentOrientation) {
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
	
		if (i === 0 && autorotate) {
			const size = Math.max(newEnd) - Math.min(newOrigin);
			const coords = [
				[size - y + newOrigin[0], x + newOrigin[1]],
				[size - x + newOrigin[0], size - y + newOrigin[1]],
				[y + newOrigin[0], size - x + newOrigin[1]]
			];
	
			for (let e = 1; e < 4; e++) {
				const index = orientations[e].coords.findIndex(e => e[0] === coords[e-1][0] && e[1] === coords[e-1][1]);
				orientations[i].coords.splice(index, 1);
			}
		}
	
		orientations[i].coords.splice(index, 1);
	
		if (i === currentOrientation || (i === 0 && autorotate)) {
			redrawBoard(newOrigin, newEnd);
		}
	}
	
	function redrawBoard(newOrigin=[-1, -1], newEnd=[-1, -1], newBoardStart=[-1, -1], newOrientation=-1) {
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 20; y++) {
				board[x][y].setColorFromIndex(0);
			}
		}
	
		if (newBoardStart[0] === -1 && newBoardStart[1] === -1) {
			newBoardStart = [...boardStart];
		}
	
		if (newOrientation === -1) {
			newOrientation = currentOrientation;
		}
	
		if (newOrigin[0] === -1 && newOrigin[1] === -1) {
			newOrigin = [...orientations[newOrientation].origin];
		}
	
		if (newEnd[0] === -1 && newEnd[1] === -1) {
			newEnd = [...orientations[newOrientation].end];
		}
	
		if ((newEnd[0] - newOrigin[0]) + newBoardStart[0] > 19) {
			newBoardStart[0] -= ((newEnd[0] - newOrigin[0]) + newBoardStart[0]) - 19;
		}
	
		if ((newEnd[1] - newOrigin[1]) + newBoardStart[1] > 9) {
			newBoardStart[1] -= ((newEnd[1] - newOrigin[1]) + newBoardStart[1]) - 9;
		}
	
		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				const boardY = y + newBoardStart[0] - newOrigin[0];
				const boardX = x + newBoardStart[1] - newOrigin[1];
	
				if (editors[newOrientation][x][y].getColorIndex() > 0) {
					board[boardX][boardY].setColorFromIndex(color);
				}
			}
		}
	
		boardStart = [...newBoardStart];
		currentOrientation = newOrientation;
	}
});