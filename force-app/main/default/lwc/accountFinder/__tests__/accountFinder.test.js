import { createElement } from 'lwc';
import AccountFinder from 'c/accountFinder';

describe('c-account-finder', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('handles change from lighning-input', () => {
    const element = createElement('c-account-finder', {
      is: AccountFinder
    });
    document.body.appendChild(element);
    // Trigger annual revenue input change
    const inputElement = element.shadowRoot.querySelector('lightning-input');
    inputElement.dispatchEvent(new CustomEvent('change', {detail: {value: 2000000}}));
    console.log('Before promise');
    return Promise.resolve().then(() => {
      expect(inputElement.value).toBe(2000000);
    });
  });

  it('handles reset button correctly', () => {
    const element = createElement('c-account-finder', {
      is: AccountFinder
    });
    document.body.appendChild(element);
    // Trigger annual revenue input change
    const inputElement = element.shadowRoot.querySelector('lightning-input');
    inputElement.dispatchEvent(new CustomEvent('change', {detail: {value: 2000000}}));

    // Hit the reset button
    const buttonElement = element.shadowRoot.querySelector('lightning-button');
    buttonElement.dispatchEvent(new CustomEvent('click'));
    return Promise.resolve().then(() => {
      expect(inputElement.value).toBe(null);
    });
  });
});
