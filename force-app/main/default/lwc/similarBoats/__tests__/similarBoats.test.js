import { createElement } from 'lwc';
import SimilarBoats from 'c/similarBoats';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { getNavigateCalledWith } from 'lightning/navigation';

// Mock getBoatTypes Apex wire adapter for BoatDataService.getSimilarBoats
jest.mock(
  '@salesforce/apex/BoatDataService.getSimilarBoats',
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

const mockSimilarBoatsData = require('./data/getSimilarBoats.json');

const BOAT_ID = 'a025e000003AQaoAAG';

describe('c-similar-boats', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  // Helper function to resolve promises instead of using nested Promise.resolve() calls.
  async function flushPromises() {
    return Promise.resolve();
  }

  it('says no similar boats found if no data returned', async () => {
    const element = createElement('c-similar-boats', {
      is: SimilarBoats
    });
    element.recordId = BOAT_ID;
    element.similarBy = 'Price'
    document.body.appendChild(element);
    getSimilarBoats.emit([]);

    // await promise resolution
    await flushPromises();

    // expect no boat tiles
    const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
    expect(boatTiles.length).toBe(0);

    // card reflects similar By
    const mainCard = element.shadowRoot.querySelector('lightning-card');
    expect(mainCard.title).toBe('Similar boats by Price');

    // no similar boats message
    const noBoats = element.shadowRoot.querySelector('p.slds-align_absolute-center');
    expect(noBoats.innerHTML).toBe('There are no related boats by Price!');
  });


  it('gets and displays the correct number of boat tiles and allows navigation', async () => {
    const element = createElement('c-similar-boats', {
      is: SimilarBoats
    });
    element.recordId = BOAT_ID;
    element.similarBy = 'Type';
    document.body.appendChild(element);
    getSimilarBoats.emit(mockSimilarBoatsData);

    // await promise resolution
    await flushPromises();

    // expect three boat tiles
    const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
    expect(boatTiles.length).toBe(mockSimilarBoatsData.length);
    // card reflects similar By
    const mainCard = element.shadowRoot.querySelector('lightning-card');
    expect(mainCard.title).toBe('Similar boats by Type');

    // test getter
    expect(element.recordId).toBe(BOAT_ID);
    // dispatch boatselect to initiate navigation event
    const navBoat = boatTiles[1];
    expect(navBoat.boat.Id).toBe(mockSimilarBoatsData[1].Id);
    navBoat.dispatchEvent(new CustomEvent('boatselect', {
      detail: { boatId: navBoat.recordId }
    }));

    // await promise resolution
    await flushPromises();

    const navResults = getNavigateCalledWith();
    // getNavigateCalledWith() isn't providing the recordId
    expect(navResults.pageReference.type).toBe('standard__recordPage');
    expect(navResults.pageReference.attributes.objectApiName).toBe('Boat__c');
    expect(navResults.pageReference.attributes.actionName).toBe('view');
  });

  it('handles data error', async () => {
    // TODO: Not required by badge but should dispatch a toast
    const element = createElement('c-similar-boats', {
      is: SimilarBoats
    });
    element.recordId = BOAT_ID;
    element.similarBy = 'Length'
    document.body.appendChild(element);
    getSimilarBoats.emitError();

    // await promise resolution
    await flushPromises();

    // expect no boat tiles
    const boatTiles = element.shadowRoot.querySelectorAll('c-boat-tile');
    expect(boatTiles.length).toBe(0);

    // card reflects similar By
    const mainCard = element.shadowRoot.querySelector('lightning-card');
    expect(mainCard.title).toBe('Similar boats by Length');

    // no similar boats message
    const noBoats = element.shadowRoot.querySelector('p.slds-align_absolute-center');
    expect(noBoats.innerHTML).toBe('There are no related boats by Length!');
  });
});
