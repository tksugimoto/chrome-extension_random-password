(function () {
	"use strict";

	const PasswordCharsSettings = [{
		name: "数字",
		chars: "0123456789"
	}, {
		name: "アルファベット（小文字）",
		chars: "abcdefghijklmnopqrstuvwxyz"
	}, {
		name: "アルファベット（小文字）",
		chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	}, {
		name: "記号",
		chars: "!#$%&()@[{;:]+*},./<>?"
	}];

	const getPasswordChars = PasswordCharsSettings.map(setting => {
		const label = document.createElement("label");
		label.classList.add("checkbox");

		const input = document.createElement("input");
		input.type = "checkbox";
		input.checked = true;
		label.append(input);

		const span = document.createElement("span");
		span.innerText = setting.name;
		label.append(span);

		const li = document.createElement("li");
		li.append(label);
		document.getElementById("settings").append(li);

		input.addEventListener("change", evt => {
			displayNewRandomString();
		});

		return () => {
			return input.checked ? setting.chars : "";
		};
	});

	const randomStringInput = document.getElementById("random-string");
	const randomStringLengthInput = document.getElementById("random-string-length");
	const getRandomStringLength = () => parseInt(randomStringLengthInput.value);

	randomStringLengthInput.addEventListener("focus", () => {
		randomStringLengthInput.select();
	});
	randomStringLengthInput.addEventListener("keydown", evt => {
		if (evt.key == "Enter") {
			displayNewRandomString();
		}
	});
	randomStringLengthInput.addEventListener("wheel", evt => {
		// Chrome標準のホイールで値増減機能をOFF（フォーカスが当たっている時のみ）
		//evt.preventDefault();
		const deltaY = evt.deltaY;
		if (deltaY > 0) {
			// ↓方向
			randomStringLengthInput.stepDown()
		} else if (deltaY < 0) {
			// ↑方向
			randomStringLengthInput.stepUp()
		}
		displayNewRandomString();
	});

	function displayNewRandomString() {
		randomStringInput.value = createRandomString(getRandomStringLength());
		randomStringInput.focus();
		randomStringInput.select();
	}
	displayNewRandomString();

	function createRandomString(len) {

		const target = getPasswordChars.map(fn => fn()).join("");
		if (target === "") return "";

		const target_len = target.length;

		let result = "";
		for (let i = 0; i < len; i++) {
			result += target[Math.random() * target_len | 0];
		}
		return result;
	}
})();
