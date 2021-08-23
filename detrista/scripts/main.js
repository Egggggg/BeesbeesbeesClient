function logOut() {
	firebase.auth().signOut();
}

function convertError(message) {
	if (message === "xhr poll error") {
		return "Can't connect to server";
	}
	
	return message;
}

const header = document.querySelector("#header");

header.innerHTML = `
	<img src="img/logo.png" alt="Logo" width="64px" height="64px">
`