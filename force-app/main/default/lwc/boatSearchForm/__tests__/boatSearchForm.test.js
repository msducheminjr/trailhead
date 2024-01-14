import { createElement } from 'lwc';
import BoatSearchForm from 'c/boatSearchForm';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

// Realistic data with a list of boat types
const mockGetBoatTypes = require('./data/getBoatTypes.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetBoatTypesNoRecords = require('./data/getBoatTypesNoRecords.json');

// Mock getBoatTypes Apex wire adapter
jest.mock(
  '@salesforce/apex/BoatDataService.getBoatTypes',
  () => {
      const {
          createApexTestWireAdapter
      } = require('@salesforce/sfdx-lwc-jest');
      return {
          default: createApexTestWireAdapter(jest.fn())
      };
  },
  { virtual: true }
);

describe('c-boat-search-form', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });

  // Helper function to resolve promises instead of using nested Promise.resolve() calls.
  async function flushPromises() {
    return Promise.resolve();
  }

  describe('getBoatTypes @wire data', () => {
    it('adds four records to the combobox', async () => {
      const element = createElement('c-boat-search-form', {
        is: BoatSearchForm
      });
      document.body.appendChild(element);

      // Emit data from @wire
      getBoatTypes.emit(mockGetBoatTypes);
      const boatTypeDropdown = element.shadowRoot.querySelector('lightning-combobox');
      expect(boatTypeDropdown.options.length).toBe(1);

      // await promise resolution
      await flushPromises();

      // Select elements for validation
      expect(boatTypeDropdown.options.length).toBe(mockGetBoatTypes.length + 1);
      expect(boatTypeDropdown.options[1].label).toBe(mockGetBoatTypes[0].Name);
      expect(boatTypeDropdown.options[1].value).toBe(mockGetBoatTypes[0].Id);
    });

    it('only has 1 record in combobox if no records', async () => {
      const element = createElement('c-boat-search-form', {
        is: BoatSearchForm
      });
      document.body.appendChild(element);

      const boatTypeDropdown = element.shadowRoot.querySelector('lightning-combobox');
      expect(boatTypeDropdown.options.length).toBe(1);

      // Emit data from @wire
      getBoatTypes.emit(mockGetBoatTypesNoRecords);

      // await promise resolution
      await flushPromises();

      expect(boatTypeDropdown.options.length).toBe(1);
      expect(boatTypeDropdown.options[0].label).toBe('All Types');
      expect(boatTypeDropdown.options[0].value).toBe('');
    });

    it('handles error', async () => {
      const element = createElement('c-boat-search-form', {
        is: BoatSearchForm
      });
      document.body.appendChild(element);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error');
        expect(event.detail.message).toBe('An error occurred when trying to search for boat types.');
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });

      const boatTypeDropdown = element.shadowRoot.querySelector('lightning-combobox');
      expect(boatTypeDropdown.options.length).toBe(1);

      // Emit data from @wire
      getBoatTypes.emitError();

      // await promise resolution
      await flushPromises();

      // Select elements for validation
      expect(correctToast).toBe(true);
      expect(boatTypeDropdown.options.length).toBe(1);
      expect(boatTypeDropdown.options[0].label).toBe('All Types');
      expect(boatTypeDropdown.options[0].value).toBe('');
    });
  });

  describe('boatType selected', () => {
    it('fires the search event in combobox value changes', async () => {
      const element = createElement('c-boat-search-form', {
        is: BoatSearchForm
      });
      document.body.appendChild(element);
      let expectedDetail = false;
      const selectedId = 'a015e00000F8AXXAA3';
      element.addEventListener('search', (event) => {
        expect(event.detail['boatTypeId']).toBe(selectedId);
        expectedDetail = true;
      });
      const boatTypeDropdown = element.shadowRoot.querySelector('lightning-combobox');
      boatTypeDropdown.value = selectedId;
      boatTypeDropdown.dispatchEvent(new CustomEvent('change'));

      // await promise resolution
      await flushPromises();

      expect(expectedDetail).toBe(true);
    });
  });
});
