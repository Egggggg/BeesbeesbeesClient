document.addEventListener("DOMContentLoaded", function() {
	let codeInput = document.querySelector("#gamecode");

	function checkCodeLength() {
		if (codeInput.value.length > 20) {
			codeInput.value = codeInput.value.substr(0, 20);
		}
	}

	codeInput.oninput = checkCodeLength;

	let warning = document.querySelector("#warning");
	let warningtext = document.querySelector("#warningtext")
	let warningclear = document.querySelector("#warningclear");

	warningclear.onclick = function() {
		warning.style.display = "none";
	}

	function join(e) {
		e.preventDefault();

		let code = codeInput.value;

		socket.emit("check room", code);
	}

	document.querySelector("#gamecodeform").onsubmit = join;

	firebase.auth().onAuthStateChanged((user) => {
		if (user && !user.emailVerified) {
			user.sendEmailVerification().then(() => {
				showWarning(`Email verification link sent to ${user.email}.`);
			});
		}
	});
});

function create() {
	firebase.auth().currentUser.getIdToken().then((token) => {
		socket.emit("create room", token);
	});
}
