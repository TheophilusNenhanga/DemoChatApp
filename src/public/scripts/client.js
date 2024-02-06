const socket = io();

document.addEventListener("DOMContentLoaded", () => {
	let username;
	const chatBox = document.getElementById("chatBox");
	const messageSender = document.getElementById("message-sender");
	const setName = document.getElementById("set-name");

	const nameInput = document.getElementById("name-input");
	const nameForm = document.getElementById("name-form");
	const nameP = document.getElementById("name-p");

	const messageContainer = document.getElementById("message-container");

	nameForm.addEventListener("submit", (event) => {
		event.preventDefault();
		if (nameInput.value) {
			username = nameInput.value;
			setName.disabled = true;
			nameInput.disabled = true;
			nameInput.placeholder = username;
			nameP.innerText = "You are: "
		} else {
			username = "anonymous"
		}
	});

	messageSender.addEventListener("submit", (event) => {
		event.preventDefault();
		let d = new Date();
		let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
		let hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		let fullDate = date + " " + hours;
		if (chatBox.value) {
			socket.emit("chat-message", {
				username: username !== undefined ? username : "anonymous",
				message: chatBox.value,
				time: fullDate
			});
			chatBox.value = "";
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
})