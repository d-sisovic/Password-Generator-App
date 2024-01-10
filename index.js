import { businessLogic } from './modules/businessLogic.js';

(() => {
    document.addEventListener('DOMContentLoaded', () => businessLogic.initializeApp());
})();