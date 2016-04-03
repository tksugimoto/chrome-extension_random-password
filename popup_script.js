(function () {
	"use strict";
	var randomStringInput = document.getElementById("random-string");
	randomStringInput.value = create(30);


	randomStringInput.focus();
	randomStringInput.select();

	function create(len) {
		var nums = "0123456789";
		var chars_uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var chars_lc = "abcdefghijklmnopqrstuvwxyz";
		
		var target = nums + chars_uc + chars_lc;
		var target_len = target.length;
		
		var result = "";
		for (var i = 0; i < len; i++) {
			result += target[Math.random() * target_len | 0];
		}
		return result;
	}
})();