import { createElement } from 'lwc';
import BoatSearchResults from 'c/boatSearchResults';
import { registerApexTestWireAdapter, registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

// Realistic data with a list of boats
const mockGetBoats = require('./data/getBoats.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetBoatsNoRecords = require('./data/getBoatsNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getBoatsAdapter = registerApexTestWireAdapter(getBoats);

const SEARCH_BOAT_TYPES_ID = 'a015e00000F8AXdAAN';

const imperativeResult = require('./data/getBoatsImperative.json');

const updateBoatResult = 'Success: Boats updated successfully';

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
const messageContextWireAdapter = registerTestWireAdapter(MessageContext);

const mockApexError = {
  body: { message: 'An internal server error has occurred' },
  ok: false,
  status: 500,
  statusText: 'Internal server error'
};

// mock imperative getBoats call
jest.mock(
  '@salesforce/apex/BoatDataService.getBoats', () => {
    return { default: jest.fn(), };
  },
  { virtual: true }
);

jest.mock(
  '@salesforce/apex/BoatDataService.updateBoatList', () => {
    return { default: jest.fn(), };
  },
  { virtual: true }
);

describe('c-boat-search-results', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  // wired Apex refresh event
  describe('wired Apex refresh method', () => {
    it('returns the list of boats with data', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      document.body.appendChild(element);
      element.refresh();
      getBoatsAdapter.emit(mockGetBoats);
      return Promise.resolve().then(() => {
        // test correct number of boat tiles
        const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        expect(boatTiles.length).toBe(mockGetBoats.length);
        // test datatable
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data.length).toBe(mockGetBoats.length);
      });
    });
    it('has no tiles or rows if no data', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      document.body.appendChild(element);
      element.refresh();
      getBoatsAdapter.emit(mockGetBoatsNoRecords);
      return Promise.resolve().then(() => {
        // test correct number of boat tiles
        const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        expect(boatTiles.length).toBe(0);
        // test datatable
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data.length).toBe(0);
      });
    });
  });

  // searchBoats with imperative Apex
  describe('searchBoats method', () => {
    it('returns the list of boats with imperative data', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      getBoats.mockResolvedValue(imperativeResult);
      document.body.appendChild(element);
      element.searchBoats(SEARCH_BOAT_TYPES_ID);
      // chained resolve because of the mocked getBoats imperative value
      return Promise.resolve().then(() => {
        return Promise.resolve();
      }).then(() => {
        // test correct number of boat tiles
        const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        expect(boatTiles.length).toBe(imperativeResult.length);
        // test datatable
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data.length).toBe(imperativeResult.length);
      });
    });
    it('handles server error', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      getBoats.mockRejectedValue(mockApexError);
      document.body.appendChild(element);
      element.searchBoats(SEARCH_BOAT_TYPES_ID);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error');
        expect(event.detail.message).toBe('Error Retrieving Boats: An internal server error has occurred')
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });
      // chained resolve because of the mocked getBoats imperative value
      return Promise.resolve().then(() => {
        return Promise.resolve();
      }).then(() => {
        // test correct number of boat tiles
        const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        expect(boatTiles.length).toBe(0);
        // test datatable
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable).toBeNull();
        expect(correctToast).toBe(true);
      });
    });
  });

  // handling the boatselect event
  describe('handling boatselect event to updateSelectedTile', () => {
    it('handles boatselect, updates the value, and publishes', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      document.body.appendChild(element);
      getBoatsAdapter.emit(mockGetBoats);
      let subscriptionRecordId;
      // test message service emitted
      subscribe(
        messageContextWireAdapter,
        BOATMC,
        (message) => subscriptionRecordId = message.recordId,
        { scope: APPLICATION_SCOPE }
      );
      let boatTiles;
      let secondBoatId;
      return Promise.resolve().then(() => {
        // first promise chain to emit data
        boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        const secondBoat = boatTiles[1];
        secondBoatId = secondBoat.boat.Id;
        let selectedDiv = secondBoat.querySelector('div.selected');
        expect(secondBoatId).not.toBe(secondBoat.selectedBoatId);
        secondBoat.dispatchEvent(new CustomEvent('boatselect', {
          detail: { boatId: secondBoatId }
        }));

        return Promise.resolve();
      }).then(() => {
        // second set of promises after event is fired
        boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        const selectedBoatId = boatTiles[0].selectedBoatId;
        for(let i = 0; i < boatTiles.length; i++) {
          const boat = boatTiles[i].boat;
        }
        expect(selectedBoatId).toBe(secondBoatId);
        // test message service emitted correct ID
        expect(subscriptionRecordId).toBe(secondBoatId);
      });

    });
  });

  // handling save on lightning datatable
  describe('updating data in the lightning datatable', () => {
    it('updates the data and succeeds', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      getBoats.mockResolvedValue(imperativeResult);
      let expectedData = JSON.parse(JSON.stringify(imperativeResult));
      expectedData[0].Name = 'All in the Family';
      expectedData[0].Length__c = 15
      expectedData[1].Price__c = 145000;
      // listen for Ship It! toast
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Success');
        expect(event.detail.message).toBe('Ship it!')
        expect(event.detail.variant).toBe('success');
        correctToast = true;
      });
      document.body.appendChild(element);
      element.searchBoats(SEARCH_BOAT_TYPES_ID);
      // chained resolve because of the mocked getBoats imperative value
      return Promise.resolve().then(() => {
        return Promise.resolve();
      }).then(() => {
        updateBoatList.mockResolvedValue(updateBoatResult);
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data.length).toBe(imperativeResult.length);
        // fire the save event
        dataTable.dispatchEvent(new CustomEvent('save', {
          detail: {
            draftValues: [
              {
                "Name": expectedData[0].Name,
                "Length__c": expectedData[0].Length__c,
                "Id": imperativeResult[0].Id
              },
              {
                "Price__c": expectedData[1].Price__c,
                "Id": imperativeResult[1].Id}
            ]
          }
        }));
        getBoatsAdapter.emit(expectedData);
        return Promise.resolve();
      }).then(() =>{
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data[0].Name).toBe(expectedData[0].Name);
        expect(dataTable.data[0].Length__c).toBe(expectedData[0].Length__c);
        expect(dataTable.data[1].Price__c).toBe(expectedData[1].Price__c);
        expect(correctToast).toBe(true);
      });
    });

    it('handles server error', () => {
      const element = createElement('c-boat-search-results', {
        is: BoatSearchResults
      });
      getBoats.mockResolvedValue(imperativeResult);
      let expectedData = JSON.parse(JSON.stringify(imperativeResult));
      expectedData[0].Name = 'All in the Family';
      expectedData[0].Length__c = 15
      expectedData[1].Price__c = 145000;
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error');
        expect(event.detail.message).toBe('Error Saving Boats: An internal server error has occurred')
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });
      document.body.appendChild(element);
      element.searchBoats(SEARCH_BOAT_TYPES_ID);
      // chained resolve because of the mocked getBoats imperative value
      return Promise.resolve().then(() => {
        return Promise.resolve();
      }).then(() => {
        updateBoatList.mockRejectedValue(mockApexError);
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data.length).toBe(imperativeResult.length);
        // fire the save event
        dataTable.dispatchEvent(new CustomEvent('save', {
          detail: {
            draftValues: [
              {
                "Name": expectedData[0].Name,
                "Length__c": expectedData[0].Length__c,
                "Id": imperativeResult[0].Id
              },
              {
                "Price__c": expectedData[1].Price__c,
                "Id": imperativeResult[1].Id}
            ]
          }
        }));
        return Promise.resolve();
      }).then(() => {
        // test correct number of boat tiles should not be reset to 0
        const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
        expect(boatTiles.length).toBe(imperativeResult.length);
        // test datatable
        const dataTable = element.shadowRoot.querySelector('lightning-datatable');
        expect(dataTable.data.length).toBe(imperativeResult.length);
        expect(correctToast).toBe(true);
      });
    });
  });
});
