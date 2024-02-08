const socket = io();

document.addEventListener("DOMContentLoaded", () => {
	let username;

	let wordleSent = false;
	const statusMessage = document.getElementById("status-message")
	const chatBox = document.getElementById("chatBox");
	const messageSender = document.getElementById("message-sender");
	const setName = document.getElementById("set-name");

	const nameInput = document.getElementById("name-input");
	const nameForm = document.getElementById("name-form");
	const nameP = document.getElementById("name-p");

	const wordleScores = document.getElementById("wordle-scores");

	const messageContainer = document.getElementById("message-container");

	nameForm.addEventListener("submit", (event) => {
		event.preventDefault();
		if (nameInput.value) {
			username = nameInput.value;
			setName.disabled = true;
			nameInput.disabled = true;
			nameInput.placeholder = username;
			nameP.innerText = "You are: "

			socket.emit("new-user", {
				username: username
			});
		} else {
			username = "anonymous"
		}
	});

	chatBox.addEventListener("keydown", () => {
		if (chatBox.value.includes("/wordle")) {
			chatBox.classList.add("text-green-400")
		}
	});


	messageSender.addEventListener("submit", (event) => {
		event.preventDefault();
		let d = new Date();
		let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
		let hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		let fullDate = date + " " + hours;


		if (chatBox.value) {

			if (!wordleSent) {
				socket.emit("chat-message", {
					username: username !== undefined ? username : "anonymous",
					message: chatBox.value,
					time: fullDate
				});

				if (chatBox.value.includes("/wordle")) {
					wordleSent = true;
				}

				chatBox.value = "";
				chatBox.classList.remove("text-green-400");
			}else{
				statusMessage.textContent = "Only one wordle score per day!"
				statusMessage.classList.add("text-red-400");
				setTimeout(() => {
					statusMessage.textContent = "";
					statusMessage.classList.remove("text-red-400");
			}, 5000);
			}
		}
	});

	socket.on("chat-message", (message) => {
		let li = document.createElement("li");
		let span = document.createElement("span")
		let horizontal = document.createElement("span");
		horizontal.classList.add("bg-gray-300", "h-px", "w-full", "mb-2");
		let horizontal1 = document.createElement("span");
		horizontal1.classList.add("bg-gray-300", "h-px", "w-full", "mb-2");
		let p = document.createElement("p")
		p.classList.add("mb-2")
		let small = document.createElement("small");
		small.classList.add("text-xs")
		span.classList.add("text-xs")
		p.textContent = message.message;
		span.textContent = message.username
		small.textContent = message.time
		li.appendChild(span)
		li.appendChild(horizontal);
		li.appendChild(p)
		li.appendChild(horizontal1);
		li.appendChild(small)
		messageContainer.appendChild(li);

		li.classList.add("bg-blue-100", "flex", "flex-col", "mb-2", "rounded", "w-full", "rounded-2xl", "px-4", "py-2")

		window.scrollTo(0, messageContainer.scrollHeight);
	});

	socket.on("score-update", (messages) => {
		wordleScores.innerHTML = "";

		messages.forEach((message, index) => {
			let li = document.createElement("li");
			let span = document.createElement("span")
			let horizontal = document.createElement("span");
			horizontal.classList.add("bg-gray-300", "h-px", "w-full", "mb-2");
			let horizontal1 = document.createElement("span");
			horizontal1.classList.add("bg-gray-300", "h-px", "w-full", "mb-2");
			let p = document.createElement("p")
			p.classList.add("mb-2")
			let small = document.createElement("small");
			small.classList.add("text-xs")
			span.classList.add("text-xs")
			p.textContent = message.message;
			span.textContent = message.sender
			small.textContent = message.time
			li.appendChild(span)
			li.appendChild(horizontal);
			li.appendChild(p)
			li.appendChild(horizontal1);
			li.appendChild(small)
			wordleScores.appendChild(li);

			li.classList.add("flex", "flex-col", "mb-2", "rounded", "w-full", "rounded-2xl", "px-4", "py-2", "bg-gray-200");

			switch (index) {
				case 0: {
					li.classList.add("bg-yellow-200");
					break;
				}
				case 1: {
					li.classList.add("bg-zinc-200");
					break;
				}
				case 2: {
					li.classList.add("bg-orange-200");
					break;
				}
			}
		});
	});

	setInterval(() => { // just for demonstration purposes. In practice this would not work explain why...
		statusMessage.textContent = "You can send another wordle score";
		statusMessage.classList.add("text-green-400");
		setTimeout(()=>{
			statusMessage.textContent = "";
		}, 5000);
		wordleSent = false;
	}, 86400000);
});
