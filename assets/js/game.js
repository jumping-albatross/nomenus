let beginner;
let intermediate;
let advanced;
let fullList;

let currentRow = 0; let nextRowBlock = 0; let remNotification = 0;

let gameFin = 0;

let maxBlock = 5;

// https://codeburst.io/javascript-double-equals-vs-triple-equals-61d4ce5a121a
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
// https://www.w3schools.com/js/js_arrow_function.asp

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

let container = document.createElement('div');
container.id = 'container';
document.body.append(container);

startMenu();

function startMenu() {
	if (document.getElementById('wordscript') != null) {
		document.getElementById('wordscript').remove();
	}
	let script = document.createElement('script');
	script.id = 'wordscript';
	script.src = './assets/js/words/' + maxBlock + '.js';
	document.body.prepend(script);
	setGlobal();
	container.innerHTML = '';
	addLogo();

	// TO DO What does this section do that blocks execution?
	let menu = document.createElement('div');
	menu.id = 'menu';

	let menuBtn = document.createElement('button');
	menuBtn.className = 'menuBtn';
	menuBtn.innerText = 'start game';
	menuBtn.j = 0;

	menuBtn.addEventListener("click", menuClick);
	menu.append(menuBtn);

	container.append(menu);
}

function openModal(type, notification) {
	let modal = document.createElement('div');
	modal.id = 'modal';
	if (type == 'endScore') {
		let message = document.createElement('span');
		message.className = 'modalMessage';
		message.innerHTML = notification;
		modal.append(message);

		setTimeout(function () {
			document.addEventListener('click', restartClick);
			document.addEventListener('keyup', restart);
		}, 100);
	}


	container.prepend(modal);
	setTimeout(function () {
		modal.style.cssText = 'opacity: 1';
	}, 1);

	let shadowBack = document.createElement('div');
	shadowBack.id = 'shadowBack';
	container.prepend(shadowBack);
	setTimeout(function () {
		shadowBack.style.cssText = 'opacity: .35';
	}, 1);

	let modalClose = document.createElement('button');
	modalClose.id = 'modalClose';
	modalClose.innerText = 'Close \u23CE';
	modalClose.modal = modal;
	modalClose.shadowBack = shadowBack;
	modalClose.addEventListener('click', closeModal);
	modal.prepend(modalClose);
}

function openWindow(url, windowName) {
	window.open(url, windowName, 'width=550,height=450,left=150,top=200,toolbar=0,status=0,data-action=share/whatsapp/share')
}

function addLogo() {
	let logo = document.createElement('div');
	logo.className = 'logo';
	logo.addEventListener("click", logoClick);

	let domName = 'WORDLED';
	for (i = 0; i < domName.length; i++) {
		let spanClass = (i == 0 || i % 2 == 0) ? 'logo_green' : 'logo_gold';
		let logoSpan = document.createElement('span');
		logoSpan.className = spanClass;
		logoSpan.innerText = domName[i];
		logo.append(logoSpan);
	}

	container.append(logo);
}

function setGlobal() {

	gameFin = 0;
	currentRow = 0;
	nextRowBlock = 0;
	remNotification = 0;
}



function gameOver() {
	gameFin = 1;
	document.removeEventListener('keyup', deleteClick, false);
	document.removeEventListener('keyup', keyPress, false);
	document.removeEventListener('keyup', restart, false);
	document.removeEventListener('click', logoClick, false);
	document.removeEventListener('click', menuClick, false);
	document.removeEventListener('click', enterClick, false);
	document.removeEventListener('click', levelModal, false);
	document.removeEventListener('click', closeModal, false);
}

function gameStart() {
	setGlobal();
	container.innerHTML = '';
	// let wordType = (level == 'beginner') ? beginner : ((level == 'intermediate') ? intermediate : ((level == 'advanced') ? advanced : ((level == 'godmode') ? fullList : custom)));
	let wordType = advanced;
	console.log(advanced.length, wordType.length);
	let rand = Math.floor(Math.random() * wordType.length);
	chosenWord = wordType[rand].toUpperCase();
	console.log(chosenWord)
	addLogo();

	let navBar = document.createElement('div');
	navBar.className = 'nav_bar';


	let levelSelect = document.createElement('button');
	levelSelect.id = 'levelSelectBtn';
	levelSelect.className = 'btn';
	levelSelect.innerText = 'does nothing';
	levelSelect.addEventListener('click', levelModal = function (event) {
		openModal('charSelect');
	})
	navBar.append(levelSelect);
	container.append(navBar);

	let gameArea = document.createElement('div');
	gameArea.className = 'game_area';
	for (i = 0; i < 6; i++) {
		let row = document.createElement('div');
		row.className = 'row';
		for (j = 0; j < maxBlock; j++) {
			let rowBlock = document.createElement('div');
			rowBlock.className = 'row_block';
			row.append(rowBlock);
		}
		gameArea.append(row);
	}
	container.append(gameArea);

	let notification = document.createElement('div');
	notification.id = 'notification';
	notification.innerText = 'Start guessing!'
	container.append(notification);

	let keyLayoutTop = 'ABCDEFGHIJ';
	let keyLayoutMid = 'KLMNOPQRS';
	let keyLayoutBot = 'TUVWXYZ';
	// let keyLayoutTop = 'QWERTYUIOP';
	// let keyLayoutMid = 'ASDFGHJKL';
	// let keyLayoutBot = 'ZXCVBNM';

	let keyboard = document.createElement('div');
	keyboard.id = 'keyboard';

	let topKeys = document.createElement('div');
	topKeys.id = 'topKeys';
	addKeys(topKeys, keyLayoutTop, 'keyboardKey_s');
	keyboard.append(topKeys);

	let midKeys = document.createElement('div');
	midKeys.id = 'midKeys';
	addKeys(midKeys, keyLayoutMid, 'keyboardKey_m');
	keyboard.append(midKeys);

	let botKeys = document.createElement('div');
	botKeys.id = 'botKeys';

	let deleteKey = document.createElement('span');
	deleteKey.className = 'keyboardKey_l';
	deleteKey.innerHTML = '&#x2190;';
	deleteKey.addEventListener("click", deleteClick);
	botKeys.append(deleteKey);
	addKeys(botKeys, keyLayoutBot, 'keyboardKey_s');

	let enterKey = document.createElement('span');
	enterKey.className = 'keyboardKey_l';
	enterKey.innerText = 'Enter';
	enterKey.addEventListener("click", enterClick);
	botKeys.append(enterKey);
	keyboard.append(botKeys);

	container.append(keyboard);

	// addSocial(container);

	document.addEventListener('keyup', keyPress);
}

function keyPress(event) {
	if (gameFin == 0) {
		let alphabet = 'abcdefghijklmnopqrstuvwxyz';
		let wordRow = document.getElementsByClassName('row')[currentRow];
		let rowBlockEl = wordRow.childNodes;
		for (i = 0; i < alphabet.length; i++) {
			if ((event.key === alphabet[i] || event.key === alphabet[i].toUpperCase())) {
				addLetter(rowBlockEl, alphabet[i]);
			}
		}
		if (event.key === 'Enter') {
			submitWord(wordRow, keyPress);
		}
		if (event.key === 'Backspace') {
			deleteLetter(rowBlockEl);
		}
	}
}


function enterClick() {
	if (gameFin == 0) {
		let wordRow = document.getElementsByClassName('row')[currentRow];
		let rowBlockEl = wordRow.childNodes;
		submitWord(wordRow);
	}
}

function logoClick(event) {
	container.innerHTML = '';
	gameStart()
	// startMenu();
}

function menuClick(event) {

		gameStart();
}

function restart(event) {
	if (event.key === 'Enter') {
		document.removeEventListener('keyup', restart, false);
		document.removeEventListener('click', restartClick, false);
		gameStart();
	}
}

function restartClick() {
	document.removeEventListener('keyup', restart, false);
	document.removeEventListener('click', restartClick, false);
	gameStart();
}


function closeModal() {
	let modal = event.currentTarget.modal;
	let shadowBack = event.currentTarget.shadowBack;
	modal.style.cssText = 'opacity:0';
	shadowBack.style.cssText = 'opacity:0';
	setTimeout(function () {
		modal.remove();
		shadowBack.remove();
	}, 355);
}

function deleteClick() {
	if (gameFin == 0) {
		let wordRow = document.getElementsByClassName('row')[currentRow];
		let rowBlockEl = wordRow.childNodes;
		deleteLetter(rowBlockEl);
	}
}

function keyboardPress() {
	if (gameFin == 0) {
		let layout = event.currentTarget.layout;
		let wordRow = document.getElementsByClassName('row')[currentRow];
		let rowBlockEl = wordRow.childNodes;
		addLetter(rowBlockEl, layout);
	}
}

function deleteLetter(rowBlockEl) {
	if (nextRowBlock > 0) {
		nextRowBlock--;
		rowBlockEl[nextRowBlock].innerText = '';
	}
}

function count(str, find) {
	return (str.split(find)).length - 1;
}

function checkAnswer(wordRow, answer) {
	let score = 0;

	console.log(wordRow, answer)
	let answerArray = [];

	for (i = 0; i < answer.length; i++) {
		let letter = answer[i].toUpperCase();
		answerArray.push(letter);
		let blockClass = 'blockGrey';
		if (chosenWord.toUpperCase().includes(letter)) {
			if (chosenWord[i].toUpperCase() === letter) {
				score++;
				blockClass = ' blockGreen';
				if (count(answer, letter) > count(chosenWord, letter)) {
					for (j = 0; j < wordRow.childNodes.length; j++) {
						if (wordRow.childNodes[j].innerText == letter && wordRow.childNodes[j].className == 'row_block  blockGold') {
							wordRow.childNodes[j].className = 'row_block  blockGrey';
							let index = answerArray.indexOf(letter);
							if (index !== -1) {
								answerArray.splice(index, 1);
							}
						}
					}
				}
			} else {
				if (countOccurrences(answerArray, letter) <= count(chosenWord, letter)) {
					blockClass = ' blockGold';
				}
				else {
					blockClass = ' blockGrey';
				}
			}
		}
		wordRow.childNodes[i].className = 'row_block ' + blockClass;
		let keyboard = document.getElementById('keyboard_' + letter);
		if (chosenWord.toUpperCase().includes(letter)) {
			if (letter == chosenWord[i]) {
				if (!keyboard.className.includes('blockGreen')) {
					keyboard.classList.remove('blockGold');
					keyboard.className += ' blockGreen';
				}
			} else {
				if (!keyboard.className.includes('blockGreen') && !keyboard.className.includes('blockGold')) {
					keyboard.className += ' blockGold';
				}
			}
		}
		else {
			if (!keyboard.className.includes('blockGrey')) {
				keyboard.className += ' blockGrey';
			}
		}
	}

	if (score === maxBlock) {


		let url = '<a href="https://duckduckgo.com/' + chosenWord + '+definition&ia=definition" target="_blank">' + chosenWord + '</a>';
		let notification = url;
		gameOver();

		setTimeout(function () {
			openModal('endScore', notification);
		}, 250);
	}
	else if (currentRow == 5) {
		let url = '<a href="https://duckduckgo.com/?q=%22' + chosenWord + '%22+%22definition%22&ia=definition" target="_blank">' + chosenWord + '</a>';
		let notification = url;
		// currentStreak = 0;
		gameOver();

		setTimeout(function () {
			openModal('endScore', notification);
		}, 250);
	}
	else {
		nextRowBlock = 0;
		currentRow++;
	}
}

function submitWord(wordRow) {
	if (nextRowBlock > 0 && nextRowBlock % maxBlock == 0) {
		let answer = wordRow.innerText.replace(/[\n\r]/g, '');
		if (fullList.includes(answer)) {
			checkAnswer(wordRow, answer);
		} else {
			remNotification = 0;
			document.getElementById('notification').innerText = 'Word not in list';
		}
	} else {
		remNotification = 0;
		document.getElementById('notification').innerText = 'You must enter ' + maxBlock + ' characters';
	}
}

function addKeys(el, layout, keyClass) {
	for (i = 0; i < layout.length; i++) {
		let key = document.createElement('span');
		key.className = keyClass;
		key.id = 'keyboard_' + layout[i];
		key.innerText = layout[i];
		key.layout = layout[i];
		key.addEventListener("click", keyboardPress);
		el.append(key);
	}
}

function addLetter(rowBlockEl, letter) {
	if (remNotification == 0) {
		remNotification = 1;
		document.getElementById('notification').innerText = '';
	}
	if (nextRowBlock < maxBlock) {
		rowBlockEl[nextRowBlock].innerText = letter.toUpperCase();
		nextRowBlock++;
	}
}
