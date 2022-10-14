import words from '../data.json'

const ABC_ARRAY = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z'
]

function getUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26 + 65))
}

function getLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26 + 97))
}

function getNumber() {
	return Math.floor(Math.random() * 10)
}

function getSymbol() {
	const symbols = [33, 42, 45, 46, 64, 95]
	return String.fromCharCode(symbols[Math.floor(Math.random() * symbols.length)])
}

export function randomPassword({ length = 8, includeNumbers, includeSymbols }) {
	let password = ''
	length = setMinMaxLength({ length, min: 8, max: 100 })

	for (let i = 0; i < parseInt(length); i++) {
		const x = Math.random()

		if (includeNumbers && includeSymbols) {
			if (x < 0.3) {
				password += getUpper()
			} else if (x >= 0.3 && x < 0.6) {
				password += getLower()
			} else if (x >= 0.6 && x < 0.8) {
				password += getNumber()
			} else {
				password += getSymbol()
			}
		} else if (includeNumbers) {
			if (x < 0.33) {
				password += getUpper()
			} else if (x >= 0.33 && x < 0.66) {
				password += getLower()
			} else if (x >= 0.66) {
				password += getNumber()
			}
		} else if (includeSymbols) {
			if (x < 0.33) {
				password += getUpper()
			} else if (x >= 0.33 && x < 0.66) {
				password += getLower()
			} else if (x >= 0.66) {
				password += getSymbol()
			}
		} else {
			if (x < 0.5) {
				password += getUpper()
			} else {
				password += getLower()
			}
		}
	}

	// This ensure there is at least one number or symbol in the password
	if (includeNumbers && includeSymbols) {
		if (!/\d/.test(password)) {
			password = password.replace(
				password[Math.floor(Math.random() * password.length)],
				getNumber()
			)
		}

		if (!/[!@*_\-/.]/.test(password)) {
			password = password.replace(
				password[Math.floor(Math.random() * password.length)],
				getSymbol()
			)
		}
	}

	return [...password]
}

export function smartPassword() {
	let password = ''
	let upper = false

	for (let i = 0; i < 5; i++) {
		const randUpper = Math.random()
		const rdm = Math.random()

		if (randUpper < 0.5 && !upper) {
			password += getUpper() + getUpper() + getUpper()
			upper = true
		} else {
			password += getLower() + getLower() + getLower()
		}

		if (i < 4) {
			if (rdm < 0.5) {
				password += getSymbol()
			} else {
				password += getNumber()
			}
		}
	}

	if (!upper) {
		const textPositon = [0, 4, 8, 12, 16]
		const randomPosition = textPositon[Math.floor(Math.random() * textPositon.length)]
		const fixUpper = getUpper() + getUpper() + getUpper()

		password =
			password.substring(0, randomPosition) +
			fixUpper +
			password.substring(randomPosition + 3, password.length)
	}

	const positions = [3, 7, 11, 15]
	const position = positions[Math.floor(Math.random() * positions.length)]

	if (!/\d/.test(password)) {
		password = password.replace(password[position], getNumber())
	}

	if (!/[!@*_\-/.]/.test(password)) {
		password = password.replace(password[position], getSymbol())
	}

	return [...password]
}

export function pinCode({ length = 4 }) {
	let password = ''
	length = setMinMaxLength({ length, min: 4, max: 12 })

	for (let i = 0; i < parseInt(length); i++) {
		password += getNumber()
	}

	return [...password]
}

export function memorablePassword({
	wordsNumber = 3,
	separator = 'Hyphens',
	capitalize = false,
	fullWords = true
}) {
	let wordsArray = []
	wordsNumber = setMinMaxLength({ length: wordsNumber, min: 3, max: 5 })

	if (fullWords) {
		wordsArray = words.sort(() => 0.5 - Math.random()).splice(0, wordsNumber)
	} else {
		for (let i = 0; i < wordsNumber; i++) {
			wordsArray.push(makeRandomString(ABC_ARRAY))
		}
	}

	if (capitalize) {
		const randNumber = Math.floor(Math.random() * wordsNumber)
		wordsArray[randNumber] = wordsArray[randNumber].toUpperCase()
	}

	if (separator === 'Numbers') {
		let position = 1
		wordsArray.forEach((_val, _idx, arr) => {
			if (position < arr.length) {
				arr.splice(position, 0, getNumber())
				position += 2
			}
		})
		return wordsArray
	}

	if (separator === 'Numbers and Symbols') {
		let position = 1

		wordsArray.forEach((_val, _idx, arr) => {
			if (position < arr.length) {
				const prob = Math.random()

				if (prob < 0.5) {
					arr.splice(position, 0, getNumber())
				} else {
					arr.splice(position, 0, getSymbol())
				}

				position += 2
			}
		})

		// This ensure there is at least one number or symbol in the password
		const password = wordsArray.join('')
		const arrLength = wordsArray.length

		if (!/\d/.test(password)) {
			wordsArray[randomOddIntFromInterval(0, arrLength)] = getNumber()
		}

		if (!/[!@*_\-/.]/.test(password)) {
			wordsArray[randomOddIntFromInterval(0, arrLength)] = getSymbol()
		}

		return wordsArray
	}

	return [...wordsArray.join(setSeparator(separator))]
}

function setMinMaxLength({ length, min, max }) {
	return length < min ? min : length > max ? max : length
}

function setSeparator(separator) {
	if (separator === 'Hyphens') {
		return '-'
	} else if (separator === 'Spaces') {
		return ' '
	} else if (separator === 'Periods') {
		return '.'
	} else if (separator === 'Commas') {
		return ','
	} else if (separator === 'Underscores') {
		return '_'
	}
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomOddIntFromInterval(min, max) {
	if (min % 2 === 0) ++min
	return min + 2 * randomIntFromInterval(0, (max - min) / 2)
}

function makeRandomString(arr) {
	const stringLength = Math.random() < 0.5 ? 3 : 4
	return [...arr]
		.sort(() => 0.5 - Math.random())
		.splice(0, stringLength)
		.join('')
}
