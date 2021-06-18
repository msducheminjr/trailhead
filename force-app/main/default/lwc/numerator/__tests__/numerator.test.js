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
        const formattedNum = element.shadowRoot.querySelector('p.current lightning-formatted-number');
        const priorNum = element.shadowRoot.querySelector('p.prior lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('add'));
        controlsElement.dispatchEvent(new CustomEvent('add'));
        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(2);
            expect(priorNum.value).toBe(1);
        });
    });

    it('handles subtraction', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('p.current lightning-formatted-number');
        const priorNum = element.shadowRoot.querySelector('p.prior lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(-3);
            expect(priorNum.value).toBe(-2);
        });
    });

    it('handles combination of addition and subtraction', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('p.current lightning-formatted-number');
        const priorNum = element.shadowRoot.querySelector('p.prior lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        controlsElement.dispatchEvent(new CustomEvent('add'));
        controlsElement.dispatchEvent(new CustomEvent('subtract'));
        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(-1);
            expect(priorNum.value).toBe(0);
        });
    });

    it('handles multiplication', () => {
        const element = createElement('c-numerator', {
            is: Numerator
        });
        document.body.appendChild(element);
        const controlsElement = element.shadowRoot.querySelector('c-controls');
        const formattedNum = element.shadowRoot.querySelector('p.current lightning-formatted-number');
        const priorNum = element.shadowRoot.querySelector('p.prior lightning-formatted-number');
        expect(formattedNum.value).toBe(0);
        controlsElement.dispatchEvent(new CustomEvent('add')); // 1
        controlsElement.dispatchEvent(new CustomEvent('add')); // 2
        controlsElement.dispatchEvent(new CustomEvent('multiply', { detail: 2 })); // 4
        controlsElement.dispatchEvent(new CustomEvent('multiply', { detail: 3 })); // 12

        return Promise.resolve().then(() => {
            expect(formattedNum.value).toBe(12);
            expect(priorNum.value).toBe(4);
        });
    });
});
