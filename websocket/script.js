
class SingleWebSocket {

	static instance = SingleWebSocket;
	constructor(url) {
		if(SingleWebSocket.instance) {
			SingleWebSocket.instance = new WebSocket(url);
			return SingleWebSocket.instance;
		}
		return SingleWebSocket.instance;
	}
}

class Chat{
	constructor(url) {
		this.url = url;
		this.wrapper = document.querySelector('.wrapper');
		this.userName = document.querySelector('#userName');
		this.popUp = document.querySelector('.pop-up');
		this.chatTop = document.querySelector('.chat__top');
		this.chatWrap = document.querySelector('.chat');
		this.messageText = document.querySelector('#message');
	}

	messageTemplate({time, name, message}) {
		return `
			<div class="chat__message-item">
				<div class="chat__time">${time}</div>
				<div class="chat__name">${name}</div>
				<div class="chat__text">
					${message}
				</div>
			</div>
		`;
	}

	openHandler = (e) => {
		console.log(e.target);
	}

	getDate = () => {
		let date = new Date();
		let h = date.getHours();
		let m = date.getMinutes();
		return `${h}:${m}`;
	}

	sendHandler = (e) => {
		if (e.target.closest('.chat__btn')) {
			let date = this.getDate();
			let data = {
				time : date,
				name : this.name,
				message : this.messageText.value,
			}
			this.socket.send(JSON.stringify(data));
			this.messageText.value = '';
		} else return;
	}

	messageHandler = (e) => {
		let item = this.messageTemplate(JSON.parse(e.data));
		this.chatTop.innerHTML += item;
	}

	chat = (url) => {
		this.socket = new SingleWebSocket(url);
		this.socket.addEventListener('message', this.messageHandler);
		this.socket.addEventListener('open', this.openHandler);
		this.socket.addEventListener('close', (e) => console.log(e.code, e.reason));
		this.socket.addEventListener('error', (e) => console.log(e.message));
	}

	nameBtnHandler = (e) => {
		if (e.target.closest('#nameBtn')) {
			this.name = this.userName.value;
			this.wrapper.classList.add('wrapper_white');
			this.popUp.style.display = 'none';
			this.chatWrap.classList.add('chat_visible');
		} else return;
	}

	init () {
		document.addEventListener('click', (e) => {
			this.nameBtnHandler(e);
			this.sendHandler(e);
		});

		this.chat(this.url);
	}
}
// let url = "wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self";
let chat = new Chat("wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self");

chat.init();