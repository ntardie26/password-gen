const lengthEl = document.getElementById('length');
const amountEl = document.getElementById('amount');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const excludeSimilarEl = document.getElementById('exclude-similar');
const excludeAmbiguousEl = document.getElementById('exclude-ambiguous');
const clipboardEl = document.getElementById('clipboard');
const passwordsOutputEl = document.getElementById('passwords-output');

const similarChars = '0OoLli1';
const ambiguousSymbols = '{}[]()/\'"`~,;:.<>';

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

document.addEventListener('DOMContentLoaded', generateAndDisplayPasswords);

[lengthEl, amountEl, uppercaseEl, lowercaseEl, numbersEl, symbolsEl, excludeSimilarEl, excludeAmbiguousEl].forEach(el => {
    el.addEventListener('input', generateAndDisplayPasswords);
});

clipboardEl.addEventListener('click', () => {
    const passwords = passwordsOutputEl.value;
    if (!passwords) return;
    copyToClipboard(passwords);
    alert('Passwords copied to clipboard');
});

function generateAndDisplayPasswords() {
    const length = +lengthEl.value;
    const amount = +amountEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    const excludeSimilar = excludeSimilarEl.checked;
    const excludeAmbiguous = excludeAmbiguousEl.checked;

    const passwords = [];

    for (let i = 0; i < amount; i++) {
        const password = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length, excludeSimilar, excludeAmbiguous);
        passwords.push(password);
    }

    passwordsOutputEl.value = passwords.join('\n');
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

function generatePassword(lower, upper, number, symbol, length, excludeSimilar, excludeAmbiguous) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return '';
    }

    for (let i = 0; i < length * 2; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            let char = randomFunc[funcName]();

            if (excludeSimilar && similarChars.includes(char)) {
                char = randomFunc[funcName]();
            }

            if (excludeAmbiguous && funcName === 'symbol' && ambiguousSymbols.includes(char)) {
                char = getRandomSymbol();
            }

            generatedPassword += char;
        });
    }

    let finalPassword = '';
    const availableChars = generatedPassword.split('');

    for (let i = 0; i < length; i++) {
        if (availableChars.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        finalPassword += availableChars[randomIndex];
        availableChars.splice(randomIndex, 1);
    }

    return finalPassword;
}

function getRandomLower() {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    return lowerChars[Math.floor(Math.random() * lowerChars.length)];
}

function getRandomUpper() {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return upperChars[Math.floor(Math.random() * upperChars.length)];
}

function getRandomNumber() {
    const numbers = '0123456789';
    return numbers[Math.floor(Math.random() * numbers.length)];
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    return symbols[Math.floor(Math.random() * symbols.length)];
}
