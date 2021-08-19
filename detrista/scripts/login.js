document.addEventListener("DOMContentLoaded", function() {
	let googleLogin = document.querySelector("#googlelogin");

	googleLogin.addEventListener("mouseenter", function(event) {
		event.target.src = "/google_focus.png";
	});

	googleLogin.addEventListener("mouseleave", function(event) {
		event.target.src = "/google_normal.png";
	});

	googleLogin.addEventListener("mousedown", function(event) {
		event.target.src = "/google_pressed.png";
	});

	googleLogin.addEventListener("mouseup", function(event) {
		event.target.src = "/google_focus.png";
	});

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			window.location.href = "/detrista";
		}
	});

	const fullCheck = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/

	function createAccount(e) {
		e.preventDefault();
	
		let email = document.querySelector("#createemail").value;
		let password = document.querySelector("#createpassword").value;
		let repassword = document.querySelector("#verifypassword").value;

		if (repassword !== password) {
			showWarning("Passwords do not match")
			return;
		}
	
		if (!fullCheck.test(password)) {
			showWarning("Password is not strong enough")
			return;
		}

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.catch(function(error) {
				console.error(error)
			});
	}
	
	function login(e) {
		e.preventDefault();
	
		let email = document.querySelector("#loginemail").value;
		let password = document.querySelector("#loginpassword").value;
	
		firebase.auth().signInWithEmailAndPassword(email, password)
			.catch(function(error) {
				console.error(error)
			})
	}

	document.querySelector("#createaccount").onsubmit = createAccount;
	document.querySelector("#login").onsubmit = login;
});

function googleLogin() {
	let provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithRedirect(provider);
}