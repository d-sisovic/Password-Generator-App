class UI {
    constructor() { }

    getSingleElement(elementSelector) {
        return document.querySelector(elementSelector);
    }

    getMultipleElements(elementSelector) {
        return document.querySelectorAll(elementSelector);
    }

    setElementsTextContent(element, content) {
        element.textContent = content;
    }
}

const ui = new UI();

export { ui };