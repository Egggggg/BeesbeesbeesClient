const colors = [
	"rgba(0, 0, 0, 0)",
	"#8ecdc7", // light blue, I, 1
	"#6161e5", // blue, J, 2
	"#e3a34f", // orange, L, 3
	"#ede35a", // yellow, O, 4
	"#70d773", // green, S, 5
	"#ae49e9", // purple, T, 6
	"#d85a5a" // red, Z, 7
];

class Square {
	constructor(x, y, container=null) {
		this.x = x;
		this.y = y;
		
		this.color = colors[0];
		this.full = false;
		this.active = false;

		if (container !== null) {
			let span = document.createElement("span");
			span.setAttribute("id", `${x}x${y}y`);
			span.setAttribute("class", "block");

			this.test = false;
			this.node = document.querySelector(container).appendChild(span);
		} else {
			this.test = true;
		}
	}

	setColor(color) {
		this.full = color !== colors[0];
		this.color = color;
		
		if (!this.test) {
			this.node.style.backgroundColor = color;
		}
	}

	getColorIndex() {
		return colors.indexOf(this.color);
	}

	setColorFromIndex(index) {
		this.setColor(colors[index]);
	}
}

module.exports = {
	Square: Square
}
