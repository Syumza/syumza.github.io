prevInput = ''; 
input = document.getElementById('input');
re = [/^-?(?:0?|[1-9]\d{0,47})(?:\.\d*)?$/,/^(?:[\s]*)(?<num>(?<neg>-)?0*(?<wd>(?<who>(?:(?=\..)|0|[1-9] ?(?:(?:[0-9] ?){0,47})?))(?:\. ?(?<dec>([0-9] ?)*[1-9]))?))(?:(?:0 ?)*\s*)$/];

function inputCheck() {
	if (re[0].test(input.innerHTML)) {
		prevInput = input.innerHTML;
	} else {
		input.focus()
		input.innerHTML = '';
		input.innerHTML = prevInput;
	}
}
