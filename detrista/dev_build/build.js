const replace = require("replace-in-file");

const options = {
	files: "../*.html",
	from: /https:\/\/socket.beesbeesbees.me/g,
	to: "https://socket.beesbeesbees.me:3000"
}

try {
	let changedFiles = replace.sync(options);
	console.log(`Modified ${changedFiles.length} files`);
} catch (error) {
	console.error("An error occurred: ", error);
}