(() => {
	'use strict';

	const mistakableChars = '1lIi![]0Oo@';
	const optionSettings = [{
		type: 'exclude-mistakable-char',
		name: `紛らわしい文字(${mistakableChars})を除外する`,
		defaultValue: 'true',
		filterChars: str => Array.from(str).filter(char => !mistakableChars.includes(char)).join(''),
	}, {
		type: 'use-mistakable-char-only',
		name: `紛らわしい文字(${mistakableChars})のみを使う（ジョーク機能）`,
		defaultValue: 'false',
		filterChars: str => Array.from(str).filter(char => mistakableChars.includes(char)).join(''),
	}];

	optionSettings.forEach(optionSetting => {
		const localStorageKey = `options.${optionSetting.type}.enabled`;
		const checkBox = document.createElement('check-box');
		const defaultValue = optionSetting.defaultValue;
		checkBox.checked = (localStorage[localStorageKey] || defaultValue) === 'true';
		checkBox.innerText = optionSetting.name;

		const li = document.createElement('li');
		li.append(checkBox);
		document.getElementById('options').append(li);

		checkBox.addEventListener('change', () => {
			displayNewRandomString();
			localStorage[localStorageKey] = checkBox.checked;
		});

		optionSetting.filterCharsIfNeeded = str => {
			if (!checkBox.checked) return str;
			return optionSetting.filterChars(str);
		};
	});

	const PasswordCharsSettings = [{
		type: 'number',
		name: '数字',
		accesskey: 'n',
		chars: '0123456789',
	}, {
		type: 'lower-case-alphabet',
		name: 'アルファベット（小文字）',
		accesskey: 'a',
		chars: 'abcdefghijklmnopqrstuvwxyz',
	}, {
		type: 'upper-case-alphabet',
		name: 'アルファベット（大文字）',
		accesskey: 'u',
		chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	}, {
		type: 'symbol',
		name: '記号',
		accesskey: 's',
		individualSelection: true,
		chars: '!#$%&()@[{;:]+*},./<>?',
	}];

	PasswordCharsSettings.forEach(setting => {
		const localStorageKey = `char-type.${setting.type}.enabled`;
		const checkBox = document.createElement('check-box');
		checkBox.setAttribute('accesskey', setting.accesskey);
		checkBox.title = `ON/OFF ショートカットキー: Alt + ${setting.accesskey}`;
		checkBox.checked = (localStorage[localStorageKey] || 'true') === 'true';
		checkBox.innerText = setting.name;

		const li = document.createElement('li');
		li.append(checkBox);
		document.getElementById('settings').append(li);

		checkBox.addEventListener('change', () => {
			displayNewRandomString();
			localStorage[localStorageKey] = checkBox.checked;
		});

		if (setting.individualSelection) {
			const details = document.createElement('details');
			details.classList.add('individual-selection');
			const summary = document.createElement('summary');
			summary.innerText = '個別設定';
			details.append(summary);

			const chars = Array.from(setting.chars).map(char => {
				const eachCharCheckBox = document.createElement('check-box');
				eachCharCheckBox.checked = checkBox.checked;
				eachCharCheckBox.innerText = char;
				eachCharCheckBox.addEventListener('change', () => {
					checkBox.checked = chars.some(({ selected }) => selected);
					displayNewRandomString();
				});
				details.append(eachCharCheckBox);

				return {
					char,
					get selected() {
						return eachCharCheckBox.checked;
					},
					setChecked: (checked) => eachCharCheckBox.checked = checked,
				};
			});

			li.append(details);

			checkBox.addEventListener('change', () => {
				chars.forEach(({ setChecked }) => {
					setChecked(checkBox.checked);
				});
				displayNewRandomString();
			});

			const getSelectedChars = () => {
				return chars.map(({ selected, char }) => {
					return selected ? char : '';
				}).join('');
			};

			setting.getCharsIfSelected = () => {
				return checkBox.checked ? getSelectedChars() : '';
			};
			return;
		}

		setting.getCharsIfSelected = () => {
			return checkBox.checked ? setting.chars : '';
		};
	});

	const randomStringInput = document.getElementById('random-string');
	const randomStringLengthInput = document.getElementById('random-string-length');
	const getRandomStringLength = () => parseInt(randomStringLengthInput.value);

	randomStringLengthInput.addEventListener('focus', () => {
		randomStringLengthInput.select();
	});
	const randomStringLengthMemory = {
		localStorageKey: 'random-string-length',
		save(value) {
			localStorage[this.localStorageKey] = value;
		},
		load() {
			return parseInt(localStorage[this.localStorageKey]);
		},
	};
	randomStringLengthInput.value = randomStringLengthMemory.load() || randomStringLengthInput.value;
	randomStringLengthInput.addEventListener('change', () => {
		displayNewRandomString();
		randomStringLengthMemory.save(randomStringLengthInput.value);
	});
	randomStringLengthInput.addEventListener('keydown', ({key}) => {
		if (key == 'Enter') {
			displayNewRandomString();
		}
	});
	randomStringLengthInput.addEventListener('wheel', ({deltaY}) => {
		if (deltaY > 0) {
			// ↓方向
			randomStringLengthInput.stepDown();
		} else if (deltaY < 0) {
			// ↑方向
			randomStringLengthInput.stepUp();
		}
		displayNewRandomString();
		randomStringLengthMemory.save(randomStringLengthInput.value);
	});

	const displayNewRandomString = () => {
		randomStringInput.value = createRandomString(getRandomStringLength());
		randomStringInput.focus();
		randomStringInput.select();
	};

	document.getElementById('re-create').addEventListener('click', displayNewRandomString);

	const createRandomString = (len) => {

		let target = '';

		PasswordCharsSettings.forEach(({ getCharsIfSelected }) => {
			target += getCharsIfSelected();
		});

		optionSettings.forEach(({ filterCharsIfNeeded }) => {
			target = filterCharsIfNeeded(target);
		});

		if (target === '') return '';

		const target_len = target.length;

		let result = '';
		for (let i = 0; i < len; i++) {
			result += target[Math.random() * target_len | 0];
		}
		return result;
	};

	displayNewRandomString();
})();

(() => {
	const dataKey = 'data-show-accesskey';
	document.body.addEventListener('keydown', ({key}) => {
		if (key === 'Alt') {
			document.body.setAttribute(dataKey, 'true');
		}
	});
	document.body.addEventListener('keyup', ({key}) => {
		if (key === 'Alt') {
			document.body.removeAttribute(dataKey);
		}
	});
})();
