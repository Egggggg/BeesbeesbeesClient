/**
 * Draws a board to display using the passed settings
 * @function drawBoard
 * @param {String[]} containers 
 * @param {number} width 
 * @param {number} height 
 * @param {number} padding 
 * @param {number} squareSize 
 */
function drawBoard(container, width, height, padding, squareSize) {
	const stage = new Konva.Stage({
		container: container,
		width: width + (padding * 2),
		height: height + (padding * 2)
	});

	const dotLayer = new Konva.Layer();
	const borderLayer = new Konva.Layer();
	const border = new Konva.Rect({
		x: 0,
		y: 0,
		width: stage.width(),
		height: stage.height(),
		stroke: "#310865",
		strokeWidth: 20,
		cornerRadius: 20
	});

	borderLayer.add(border);

	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 19; y++) {
			const dot = new Konva.Circle({
				x: (x * squareSize) + squareSize + padding,
				y: (y * squareSize) + squareSize + padding,
				radius: 2,
				fill: "#752f73"
			});

			dotLayer.add(dot);
		}
	}

	stage.add(borderLayer);
	stage.add(dotLayer);
}

/**
 * Draws a batch of boards using the same settings
 * @function batchDrawBoard
 * @param {String[]} containers 
 * @param {number} width 
 * @param {number} height 
 * @param {number} padding 
 * @param {number} squareSize 
 */
function batchDrawBoards(containers, width, height, padding, squareSize) {
	const stages = [];

	for (let i = 0; i < containers.length; i++) {
		stages.push(new Konva.Stage({
				container: containers[i],
				width: width + (padding * 2),
				height: height + (padding * 2)
			})
		);
	}

	const dotLayer = new Konva.Layer();
	const borderLayer = new Konva.Layer();
	const border = new Konva.Rect({
		x: 0,
		y: 0,
		width: stages[0].width,
		height: stages[0].height,
		stroke: "#310865",
		strokeWidth: 20,
		cornerRadius: 20
	});

	borderLayer.add(border);

	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 19; y++) {
			const dot = new Konva.Circle({
				x: (x * squareSize) + squareSize + padding,
				y: (y * squareSize) + squareSize + padding,
				radius: 2,
				fill: "#752f73"
			});

			dotLayer.add(dot);
		}
	}

	stages.forEach(stage => {
		stage.add(borderLayer.clone());
		stage.add(dotLayer.clone());
	});
}