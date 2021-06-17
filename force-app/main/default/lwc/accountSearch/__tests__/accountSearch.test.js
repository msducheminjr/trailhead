import { createElement } from 'lwc';
import AccountSearch from 'c/accountSearch';

describe('c-account-search', () => {
  afterEach(() => {
      // The jsdom instance is shared across test cases in a single file so reset the DOM
      while (document.body.firstChild) {
          document.body.removeChild(document.body.firstChild);
      }
  });

  it('handles change from lighning-input', () => {
    const element = createElement('c-account-search', {
        is: AccountSearch
    });
    document.body.appendChild(element);
    // Trigger number of employees input change
    const inputElement = element.shadowRoot.querySelector('lightning-input');
    inputElement.dispatchEvent(new CustomEvent('change', {detail: {value: 5}}));
    return Promise.resolve().then(() => {
      expect(inputElement.value).toBe(5);
    });
  });

  it('handles reset button correctly', () => {
    const element = createElement('c-account-search', {
        is: AccountSearch
    });
    document.body.appendChild(element);
    // Trigger number of employees input change
    const inputElement = element.shadowRoot.querySelector('lightning-input');
    inputElement.dispatchEvent(new CustomEvent('change', {detail: {value: 5}}));

    // Hit the reset button
    const buttonElement = element.shadowRoot.querySelector('lightning-button');
    buttonElement.dispatchEvent(new CustomEvent('click'));
    return Promise.resolve().then(() => {
      expect(inputElement.value).toBe(null);
    });
  });
});
