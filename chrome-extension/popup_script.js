(function () {
	"use strict";

	const excludeMistakableCharIfNeeded = (() => {
		const type = "exclude-mistakable-char";
		const mistakableChars = "1lI0Oo";
		const name = `紛らわしい文字(${mistakableChars})を除外する`;

		const localStorageKey = `options.exclude-mistakable-char.enabled`;
		const label = document.createElement("label");
		label.classList.add("checkbox");

		const input = document.createElement("input");
		input.type = "checkbox";
		input.checked = (localStorage[localStorageKey] || "true") === "true";
		label.append(input);

		const span = document.createElement("span");
		span.innerText = name;
		label.append(span);

		const li = document.createElement("li");
		li.append(label);
		document.getElementById("options").append(li);

		input.addEventListener("change", evt => {
			displayNewRandomString();
			localStorage[localStorageKey] = input.checked;
		});
		return str => {
			if (!input.checked) return str;
			return Array.from(str).filter(char => !mistakableChars.includes(char)).join("");
		};
	})();

	const PasswordCharsSettings = [{
		type: "number",
		name: "数字",
		accesskey: "n",
		chars: "0123456789"
	}, {
		type: "lower-case-alphabet",
		name: "アルファベット（小文字）",
		accesskey: "a",
		chars: "abcdefghijklmnopqrstuvwxyz"
	}, {
		type: "upper-case-alphabet",
		name: "アルファベット（大文字）",
		accesskey: "u",
		chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	}, {
		type: "symbol",
		name: "記号",
		accesskey: "s",
		chars: "!#$%&()@[{;:]+*},./<>?"
	}];

	const getPasswordChars = PasswordCharsSettings.map(setting => {
		const localStorageKey = `char-type.${setting.type}.enabled`;
		const checkBox = document.createElement("check-box");
		checkBox.setAttribute("accesskey", setting.accesskey);
		checkBox.title = `ON/OFF ショートカットキー: Alt + ${setting.accesskey}`;
		checkBox.checked = (localStorage[localStorageKey] || "true") === "true";
		checkBox.innerText = setting.name;

		const li = document.createElement("li");
		li.append(checkBox);
		document.getElementById("settings").append(li);

		checkBox.addEventListener("change", evt => {
			displayNewRandomString();
			localStorage[localStorageKey] = checkBox.checked;
		});

		return () => {
			return checkBox.checked ? setting.chars : "";
		};
	});

	const randomStringInput = document.getElementById("random-string");
	const randomStringLengthInput = document.getElementById("random-string-length");
	const getRandomStringLength = () => parseInt(randomStringLengthInput.value);

	randomStringLengthInput.addEventListener("focus", () => {
		randomStringLengthInput.select();
	});
	const randomStringLengthMemory = {
		localStorageKey: "random-string-length",
		save: function (value) {
			localStorage[this.localStorageKey] = value;
		},
		load: function (defValue) {
			return parseInt(localStorage[this.localStorageKey]);
		}
	};
	randomStringLengthInput.value = randomStringLengthMemory.load() || randomStringLengthInput.value;
	randomStringLengthInput.addEventListener("change", evt => {
		displayNewRandomString();
		randomStringLengthMemory.save(randomStringLengthInput.value);
	});
	randomStringLengthInput.addEventListener("keydown", evt => {
		if (evt.key == "Enter") {
			displayNewRandomString();
		}
	});
	randomStringLengthInput.addEventListener("wheel", evt => {
		const deltaY = evt.deltaY;
		if (deltaY > 0) {
			// ↓方向
			randomStringLengthInput.stepDown()
		} else if (deltaY < 0) {
			// ↑方向
			randomStringLengthInput.stepUp()
		}
		displayNewRandomString();
		randomStringLengthMemory.save(randomStringLengthInput.value);
	});

	document.getElementById("re-create").addEventListener("click", displayNewRandomString);

	function displayNewRandomString() {
		randomStringInput.value = createRandomString(getRandomStringLength());
		randomStringInput.focus();
		randomStringInput.select();
	}
	displayNewRandomString();

	function createRandomString(len) {

		let target = getPasswordChars.map(fn => fn()).join("");
		if (target === "") return "";

		target = excludeMistakableCharIfNeeded(target);

		const target_len = target.length;

		let result = "";
		for (let i = 0; i < len; i++) {
			result += target[Math.random() * target_len | 0];
		}
		return result;
	}
})();

(function () {
	const dataKey = "data-show-accesskey";
	document.body.addEventListener("keydown", ({key}) => {
		if (key === "Alt") {
			document.body.setAttribute(dataKey, "true");
		}
	});
	document.body.addEventListener("keyup", ({key}) => {
		if (key === "Alt") {
			document.body.removeAttribute(dataKey);
		}
	});
})();
