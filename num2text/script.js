
var saveSelection, restoreSelection; var charIndex = 1

if (window.getSelection && document.createRange) {
	saveSelection = function (containerEl) {
		var range = window.getSelection().getRangeAt(0);
		var preSelectionRange = range.cloneRange();
		preSelectionRange.selectNodeContents(containerEl);
		preSelectionRange.setEnd(range.startContainer, range.startOffset);
		var start = preSelectionRange.toString().length;

		return {
			start: start,
			end: start + range.toString().length
		};
	};
	restoreSelection = function (containerEl, savedSel) {
		range = document.createRange();
		range.setStart(containerEl, 0);
		range.collapse(true);
		var nodeStack = [containerEl], node, foundStart = false, stop = false;

		while (!stop && (node = nodeStack.pop())) {
			if (node.nodeType == 3) {
				var nextCharIndex = charIndex + node.length;
				if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
					range.setStart(node, savedSel.start - charIndex);
					foundStart = true;
				}
				if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
					range.setEnd(node, savedSel.end - charIndex);
					stop = true;
				}
				charIndex = nextCharIndex;
			} else {
				var i = node.childNodes.length;
				while (i--) {
					nodeStack.push(node.childNodes[i]);
				}
			}
		}

		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

addEventListener('input', (e) => {
	let t = e.target
	if (/^-?(?:0?|[1-9]\d{0,47})?(\.\d*)?$/.test(input.innerHTML)) {
		prevInput = t.innerHTML;
	} else {
		savedSelection = saveSelection(input);
		charIndex = t.innerHTML.length - prevInput.length
		t.innerHTML = prevInput;
		restoreSelection(t, savedSelection);
	}
	document.getElementById('output').innerHTML = convertNumToWds(t.innerHTML, 0, 'en')
})

function convertNumToWds(num, type = 0, lang = 'en', scpt = 'Latn') {
	let wds = '';
	const re = [
		/^(?:\s*)(?<num>(?<neg>-)?0*(?<wd>(?<who>(?:(?=\..)|0|[1-9] ?(?:(?:[0-9] ?){0,47})?))(?:\. ?(?<dec>([0-9] ?)*[1-9]))?))(?:(?:0 ?)*\s*)$/
	];
	function r(obj) {
		for (let a in obj) {
			wds = wds.replace(obj[a], a)
		}
	}
	function j(a, b = 0) {
		if (a[0] == ' ') {
			if (wds != '' && wds[wds.length - 1] != ' ') {
				wds += a
			}
		} else if (wds == '' || wds[wds.length - 1] == ' ' || b == 1) {
			wds += a
		} else if (b == 2) {
			wds += '-' + a
		} else {
			wds += ' ' + a
		}
	}
	function range(stop, start = 0) {
		return [...Array(stop - start).keys()].map(i => i + start)
	}
	function b(...arr) {
		return arr.includes(scpt)
	}
	if (type == 0) {
		let neg, who, dec, len, scale, grp, pv, x, i
		neg = num.includes('-')
		who = num.replace(re[0], '$<who>')
		who = !who&&num ? '0' : who
		dec = num.replace(re[0], '$<dec>')
		len = who.length
		scale = ['jp', 'ko', 'zh'].includes(lang) ? 4 : 3
		grp = (() => Math.ceil((len - i) / scale) - 2)()
		pv = (a = 0) => ((len - i + a) % scale)
		x = (a = 0, b = null) => {
			if (!b) {
				if (i + a < 0) {
					return 0
				} else if (0) {
					return parseInt(who[a + i])
				}
			} else {
				return parseInt(who.substring(a, b + 1))
			}
		}
		sx = (a = 0, b = a) => who.substring(a, b + 1)
		if (lang == 'en') {
			nv = {
				'Latn': {
					0: 'zero', '.>0': 'oh', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
					10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
					20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety', '1x': 'teen', 'x0': 'ty', 'x00': 'hundred', '-': 'negative', '.': 'point', '&': 'and'
				},
				'Kana': {
					0: 'ゼロ', '.>0': 'オ', 1: 'ワン', 2: 'ツー', 3: 'スリー', 4: 'フォー', 5: 'ファイブ', 6: 'シックス', 7: 'セブン', 8: 'エイト', 9: 'ナイン',
					10: 'テン', 11: 'イレブン', 12: 'トゥエルブ', 13: 'サーティーン', 14: 'フォーティーン', 15: 'フィフティーン', 16: 'シックスティーン', 17: 'セブンティーン', 18: 'エイティーン', 19: 'ナインティーン',
					20: 'トゥエンティー', 30: 'サーティー', 40: 'フォーティー', 50: 'フィフティー', 60: 'シックスティー', 70: 'セブンティー', 80: 'エイティー', 90: 'ナインティー', 'x00': 'ハンドレッド', '-': 'ネガティブ', '.': 'ポイント', '&': 'アンド'
				}
			}[scpt]
			dg = {
				'Latn': ['thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion'],
				'Kana': ['サウザンド', 'ミリオン', 'ビリオン', 'トリリオン', 'クワドリリオン', 'クインティリオン', 'セックスティリオン', 'セプティリオン', 'オクティリオン', 'ノニリオン', 'デシリオン', 'ウンデシリオン', 'デュオデシリオン', 'トレデシリオン', 'クワットーデシリオン']
			}[scpt]
			if (neg) {
				j(nv['-'])
			}
			if (who == '0') {
				j(nv[0])
			} else {
				for (let i in range(len)) {
					if (pv() == 2 && i != 0 && grp == -1 && x(0, 1)) {
						j(nv['&'])
					}
					if (x()) {
						if (pv() == 0) {
							j(nv[x()])
							j(nv['x00'])
						}
						else if (pv() == 2) {
							if (!(x() == 1 && x(1) != 0)) {
								j(nv[parseInt(sx() + '0')])
								if (x(1) != 0) {
									j('-', 1)
								}
							}
							else if (pv() == 1) {
								if (x(-1) == 1 && x() != 0) {
									j(nv[x(-1, 0)])
								} else {
									j(nv[x()])
								}
							}
							if (pv() == 1 && grp != -1 && x(-2, 0)) {
								j(dg[grp])
							}
						}
					}
				}
			}
			if (dec) {
				j(nv['.'])
				for (let i of dec) {
					j(nv[x == '0' ? '0>.' : parseInt(i)])
				}
			}
			r({ '-': /- /g })
			if (b('Kana')) {
				r({ '  ': / /, '  ': /-/ })
			}
		}
	}
	return wds ? wds : ''
}