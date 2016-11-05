(function () {
	"use strict";
	const randomStringInput = document.getElementById("random-string");
	randomStringInput.value = create(30);


	randomStringInput.focus();
	randomStringInput.select();

	function create(len) {
		const nums = "0123456789";
		const chars_uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const chars_lc = "abcdefghijklmnopqrstuvwxyz";
		const symbols = "!#$%&()@[{;:]+*},./<>?";
		
		const target = nums + chars_uc + chars_lc + symbols;
		const target_len = target.length;
		
		let result = "";
		for (let i = 0; i < len; i++) {
			result += target[Math.random() * target_len | 0];
		}
		return result;
	}
})();
