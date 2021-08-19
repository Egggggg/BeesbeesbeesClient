function logOut() {
	firebase.auth().signOut();
}

function convertError(message) {
	if (message === "xhr poll error") {
		return "Can't connect to server";
	}
	
	return message;
}