import { createElement } from 'lwc';
import AccountSearch from 'c/accountSearch';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import queryAccountsByEmployeeNumber from '@salesforce/apex/AccountListControllerLwc.queryAccountsByEmployeeNumber';

// Realistic data with a list of accounts
const mockQueryAccountsByEmployeeNumber = require('./data/queryAccountsByEmployeeNumber.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockQueryAccountsByEmployeeNumberNoRecords = require('./data/queryAccountsByEmployeeNumberNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const queryAccountsByEmployeeNumberAdapter = registerApexTestWireAdapter(queryAccountsByEmployeeNumber);

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

  describe('queryAccountsByEmployeeNumber @wire data', () => {
    it('renders four records', () => {
      const element = createElement('c-account-search', {
        is: AccountSearch
      });
      document.body.appendChild(element);

      // Emit data from @wire
      queryAccountsByEmployeeNumberAdapter.emit(mockQueryAccountsByEmployeeNumber);

      return Promise.resolve().then(() => {
        // Select elements for validation
        const accountElements = element.shadowRoot.querySelectorAll('p');
        expect(accountElements.length).toBe(mockQueryAccountsByEmployeeNumber.length);
        expect(accountElements[0].textContent).toBe(mockQueryAccountsByEmployeeNumber[0].Name);
      });
    });

    it('renders no items when no records are returned', () => {
      const element = createElement('c-account-search', {
        is: AccountSearch
      });
      document.body.appendChild(element);

      // Emit data from @wire
      queryAccountsByEmployeeNumberAdapter.emit(mockQueryAccountsByEmployeeNumberNoRecords);

      return Promise.resolve().then(() => {
        // Select elements for validation
        const accountElements = element.shadowRoot.querySelectorAll('p');
        expect(accountElements.length).toBe(
          mockQueryAccountsByEmployeeNumberNoRecords.length
        );
      });
    });
  });

  describe('queryAccountsByEmployeeNumber @wire error', () => {
    it('shows error panel element', () => {
      const element = createElement('c-account-search', {
        is: AccountSearch
      });
      document.body.appendChild(element);

      // Emit error from @wire
      queryAccountsByEmployeeNumberAdapter.error();

      return Promise.resolve().then(() => {
        const errorElement = element.shadowRoot.querySelector('p');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toBe('No accounts found.');
      });
    });
  });
});
