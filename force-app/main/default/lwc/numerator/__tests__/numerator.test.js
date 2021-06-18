import { createElement } from 'lwc';
import Numerator from 'c/numerator';

describe('c-numerator', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('handles addition', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('add'));
        controlsElement.dispatchEvent(new CustomEvent('add'));
        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(2);
        });
    });

    it('handles subtraction', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(-3);
        });
    });

    it('handles combination of addition and subtraction', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        controlsElement.dispatchEvent(new CustomEvent('add'));
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(-1);
        });
    });

    it('handles multiplication', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('add')); // 1
        controlsElement.dispatchEvent(new CustomEvent('add')); // 2
        controlsElement.dispatchEvent(new CustomEvent('multiply', { detail: 2 })); // 6
        controlsElement.dispatchEvent(new CustomEvent('multiply', { detail: 3 })); // 12

        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(12);
        });
    });
});
