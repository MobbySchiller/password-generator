import './sass/style.scss';

let requirements = {
    length: 10,
    uppercase: false,
    lowercase: true,
    numbers: false,
    symbols: false,
};

let results = {
    pickedOptions: 0,
    strength: null,
    maxRandom: null,
    maxRandomLowercase: null,
    drawedCharacters: [],
    password: [],
}

const htmlElements = {
    passwordSign: document.querySelector('.result__password'),
    passwordCopyBtn: document.querySelector('.result__copy'),
    inputRange: document.querySelector('.form__range'),
    inputsCheckbox: [...document.querySelectorAll('[data-key]')],
    lengthSign: document.querySelector('.length__value'),
    strengthSign: document.querySelector('.strength__level-name'),
    strengthIndicators: [...document.querySelectorAll('.strength__level-point')],
    generateBtn: document.querySelector('.generate-btn'),
};

htmlElements.inputRange.addEventListener('input', (e) => getCharacterLength(e));
htmlElements.inputsCheckbox.forEach(input => input.addEventListener('input', (e) => getCharacterType(e)));
htmlElements.generateBtn.addEventListener('click', () => displayPassword());
htmlElements.passwordCopyBtn.addEventListener('click', () => copyPassword());


// LENGTH
const getCharacterLength = (e) => {
    requirements.length = parseInt(e.target.value);
    displayLength();
    checkRequirements();
};

const displayLength = () => {
    htmlElements.lengthSign.textContent = requirements.length;
};

// CHECKBOXES

const getCharacterType = (e) => {
    const type = e.target.dataset.key;
    requirements[type] = !requirements[type];
    checkRequirements();
};

const checkRequirements = () => {
    results.pickedOptions = 0;
    for (const property in requirements) {
        if (requirements[property] == true) {
            results.pickedOptions++;
        };
    };
    checkStrength();
};

const checkStrength = () => {
    const value = results.pickedOptions * 0.5 + requirements.length / 8;
    results.strength = Math.round(value, 0);
    displayStrength();
};

const displayStrength = () => {
    if (results.strength == 4) {
        resetStrengthColor('red');
        resetStrengthColor('yellow');
        setStrengthColor(4, 'green');
        htmlElements.strengthSign.textContent = "HARD";
    } else if (results.strength == 2 || results.strength == 3) {
        resetStrengthColor('red');
        resetStrengthColor('green');
        setStrengthColor(2, 'yellow');
        htmlElements.strengthSign.textContent = "MEDIUM";
    } else if (results.strength == 1) {
        resetStrengthColor('red');
        resetStrengthColor('yellow');
        setStrengthColor(1, 'red');
        htmlElements.strengthSign.textContent = "EASY";
    }
    if (results.pickedOptions == 0) {
        resetStrengthColor('red');
        resetStrengthColor('green');
        resetStrengthColor('yellow');
        htmlElements.strengthSign.textContent = "";
    }
};

const setStrengthColor = (number, color) => {
    for (let i = 0; i < number; i++) {
        htmlElements.strengthIndicators[i].classList.add(`strength__level-point--${color}`);
    };
};

const resetStrengthColor = (color) => {
    htmlElements.strengthIndicators.forEach(indicator => indicator.classList.remove(`strength__level-point--${color}`));
};


// GENERATE AND DISPLAY PASSWORD
const displayPassword = () => {
    generatePassword();
    htmlElements.passwordSign.textContent = results.password;
};


const generatePassword = () => {
    if (results.pickedOptions > 0) {
        resetPassword();
        countMaxRandoms();
        drawPassword();
        changeOrder();
        results.password = results.drawedCharacters.join('');
    } else {
        resetPassword();
        alert("Include at least 1 character type.")
    }
};

const resetPassword = () => {
    results.drawedCharacters = [];
    results.password = '';
};

const changeOrder = () => {
    for (let i = results.drawedCharacters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = results.drawedCharacters[i];
        results.drawedCharacters[i] = results.drawedCharacters[j];
        results.drawedCharacters[j] = temp;
    };
};

const drawPassword = () => {
    if (requirements.uppercase) {
        drawUppercases(results.maxRandom);
    }
    if (requirements.lowercase) {
        drawLowercases(results.maxRandomLowercase);
    }
    if (requirements.numbers) {
        drawNumbers(results.maxRandom);
    }
    if (requirements.symbols) {
        drawSymbols(results.maxRandom);
    }
};

const countMaxRandoms = () => {
    results.maxRandom = Math.floor(requirements.length / results.pickedOptions);
    if (requirements.length % results.pickedOptions != 0) {
        results.maxRandomLowercase = results.maxRandom + requirements.length % results.pickedOptions;
    } else {
        results.maxRandomLowercase = results.maxRandom;
    }
};

const drawCharacters = (from, to, amount) => {
    const length = to - from;
    for (let i = 0; i < amount; i++) {
        const index = (Math.floor(Math.random() * length)) + from;
        results.drawedCharacters.push(String.fromCharCode(index));
    }
};

const drawUppercases = (amount) => {
    drawCharacters(65, 90, amount);
};

const drawLowercases = (amount) => {
    drawCharacters(97, 122, amount);
};

const drawNumbers = (amount) => {
    drawCharacters(48, 57, amount);
};

const drawSymbols = (amount) => {
    drawCharacters(33, 47, amount);
};

// COPY PASSWORD
const copyPassword = () => {
    htmlElements.passwordSign.select();
    // document.execCommand("copy");
}


// INIT
const init = () => {
    checkRequirements();
}

init();


