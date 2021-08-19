const colors = [
	"white",
	"#8ecdc7", // light blue, I, 1
	"#6161e5", // blue, J, 2
	"#e3a34f", // orange, L, 3
	"#ede35a", // yellow, O, 4
	"#70d773", // green, S, 5
	"#ae49e9", // purple, T, 6
	"#d85a5a" // red, Z, 7
];

class Square {
	constructor(x, y, container) {
		this.x = x;
		this.y = y;
		
		this.color = "white";
		this.full = false;
		this.active = false;

		let span = document.createElement("span");
		span.setAttribute("id", `${x}x${y}y`);
		span.setAttribute("class", "block");

		this.node = document.querySelector(container).appendChild(span);
	}

	setColor(color) {
		this.full = color != "white";
		this.color = color;
		this.node.style.backgroundColor = color;
	}

	getColorIndex() {
		return colors.indexOf(this.color);
	}

	setColorFromIndex(index) {
		this.setColor(colors[index]);
	}
}