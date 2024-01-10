import { ui } from './ui.js';

const CHARACTERS = {
    uppercase: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26],
    lowercase: ['abcdefghijklmnopqrstuvwxyz', 26],
    numbers: ['1234567890', 10],
    symbols: ['!@#$%^&*()', 10]
}

class BusinessLogic {
    #passwordInfo = {
        length: 10,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false
    };

    constructor() { }

    initializeApp() {
        this.#markDifficultyBars(3);
        this.#setClipboardClickEvent();
        this.#setCheckboxChangeEvent();
        this.#setGenerateButtonClickEvent();
        this.#setCharacterLengthChangeEvent();
    }

    #setClipboardClickEvent() {
        const copiedElement = ui.getSingleElement('#copied');
        const outputElement = ui.getSingleElement('#output');
        const clipboardIconElement = ui.getSingleElement('#copy');

        clipboardIconElement.addEventListener('click', async () => {
            if (!outputElement.value) { return; }

            outputElement.select();

            await navigator.clipboard.writeText(outputElement.value);

            copiedElement.style.display = 'block';
            clipboardIconElement.classList.add('nohover');

            setTimeout(() => {
                copiedElement.style.display = 'none';
                clipboardIconElement.classList.remove('nohover');
            }, 500);
        });
    }

    #setCharacterLengthChangeEvent() {
        const rangeElement = ui.getSingleElement('#range');

        rangeElement.addEventListener('input', event => {
            const value = +event.target.value;

            rangeElement.style.backgroundSize = `${(value - 1) * 100 / (20 - 1) + '% 100%'}`;
            ui.setElementsTextContent(ui.getSingleElement('#count'), value);
            this.#passwordInfo = { ...this.#passwordInfo, length: value };
        });
    }

    #setCheckboxChangeEvent() {
        const rangeElements = ui.getMultipleElements('input[name="option"]');

        rangeElements.forEach(element => element.addEventListener('change', event => {
            const { value, checked } = event.target;

            this.#passwordInfo = { ...this.#passwordInfo, [value]: checked };
            this.#handleEnableButton();
        }));
    }

    #setGenerateButtonClickEvent() {
        const rangeElement = ui.getSingleElement('#range');
        const buttonElement = ui.getSingleElement('#generate');
        const difficultyElement = ui.getSingleElement('#difficulty');

        buttonElement.addEventListener('click', () => {
            const characterPool = this.#getAmountOfAvailableCharacters();
            const [textStrength, bars] = this.#calculateStrength(+rangeElement.value, characterPool);

            difficultyElement.textContent = textStrength;

            this.#clearDifficultyBars();
            this.#markDifficultyBars(bars);
            this.#setPassword();
        });
    }

    #clearDifficultyBars() {
        const ratingContainer = ui.getSingleElement('#rating-container');

        Array
            .from(ratingContainer.children)
            .forEach(child => child.style.backgroundColor = '#18171F');
    }

    #markDifficultyBars(bars) {
        const ratingContainer = ui.getSingleElement('#rating-container');

        Array
            .from(ratingContainer.children)
            .forEach((child, index) => {
                if (index >= bars) { return; }

                child.style.backgroundColor = this.#getBarColor(bars);
            });
    }

    #getBarColor(bars) {
        switch (bars) {
            case 1:
                return '#F64A4A';
            case 2:
                return '#FB7C58';
            case 3:
                return '#F8CD65';
            case 4:
                return '#A4FFAF';
        }
    }

    #handleEnableButton() {
        const { uppercase, lowercase, numbers, symbols } = this.#passwordInfo;
        const areAllUnchecked = [uppercase, lowercase, numbers, symbols].every(value => !value);

        const rangeElement = ui.getSingleElement('#generate');

        rangeElement.disabled = areAllUnchecked;
    }

    #setPassword() {
        const outputElement = ui.getSingleElement('#output');

        outputElement.value = this.#getPassword();
    }

    #getPassword() {
        const rangeElement = ui.getSingleElement('#range');
        const availableCharacters = this.#getAvailableCharacters();

        return Array
            .from({ length: +rangeElement.value })
            .map(() => {
                const index = Math.floor(Math.random() * availableCharacters.length);

                return availableCharacters[index];
            })
            .join('');
    }

    #getAmountOfAvailableCharacters() {
        return Object
            .keys(CHARACTERS)
            .reduce((accumulator, key) => !this.#passwordInfo[key] ? accumulator : accumulator + CHARACTERS[key][1], 0)
    }

    #getAvailableCharacters() {
        return Object
            .keys(CHARACTERS)
            .reduce((accumulator, key) => !this.#passwordInfo[key] ? accumulator : accumulator + CHARACTERS[key][0], '')
    }

    #calculateStrength(numberOfChars, characterPool) {
        const strength = numberOfChars * Math.log2(characterPool);

        if (strength < 25) {
            return ['Too Weak!', 1];
        }

        if (strength >= 25 && strength < 50) {
            return ['Weak', 2];
        }

        if (strength >= 50 && strength < 75) {
            return ['Medium', 3];
        }

        return ['Strong', 4];
    }
}

const businessLogic = new BusinessLogic();

export { businessLogic };