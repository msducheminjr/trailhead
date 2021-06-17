import { createElement } from 'lwc';
import AccountFinder from 'c/accountFinder';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import queryAccountsByRevenue from '@salesforce/apex/AccountListControllerLwc.queryAccountsByRevenue';

// Realistic data with a list of accounts
const mockQueryAccountsByRevenue = require('./data/queryAccountsByRevenue.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockQueryAccountsByRevenueNoRecords = require('./data/queryAccountsByRevenueNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const queryAccountsByRevenueAdapter = registerApexTestWireAdapter(queryAccountsByRevenue);

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

  describe('queryAccountsByRevenue @wire data', () => {
    it('renders four records', () => {
      const element = createElement('c-account-finder', {
        is: AccountFinder
      });
      document.body.appendChild(element);

      // Emit data from @wire
      queryAccountsByRevenueAdapter.emit(mockQueryAccountsByRevenue);

      return Promise.resolve().then(() => {
        // Select elements for validation
        const accountElements = element.shadowRoot.querySelectorAll('p');
        expect(accountElements.length).toBe(mockQueryAccountsByRevenue.length);
        expect(accountElements[0].textContent).toBe(mockQueryAccountsByRevenue[0].Name);
      });
    });

    it('renders no items when no records are returned', () => {
      const element = createElement('c-account-finder', {
        is: AccountFinder
      });
      document.body.appendChild(element);

      // Emit data from @wire
      queryAccountsByRevenueAdapter.emit(mockQueryAccountsByRevenueNoRecords);

      return Promise.resolve().then(() => {
        // Select elements for validation
        const accountElements = element.shadowRoot.querySelectorAll('p');
        expect(accountElements.length).toBe(
          mockQueryAccountsByRevenueNoRecords.length
        );
      });
    });
  });

  describe('queryAccountsByRevenue @wire error', () => {
    it('shows error panel element', () => {
      const element = createElement('c-account-finder', {
        is: AccountFinder
      });
      document.body.appendChild(element);

      // Emit error from @wire
      queryAccountsByRevenueAdapter.error();

      return Promise.resolve().then(() => {
        const errorElement = element.shadowRoot.querySelector('p');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toBe('No accounts found.');
      });
    });
  });
});
