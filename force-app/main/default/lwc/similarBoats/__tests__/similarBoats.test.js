import { createElement } from 'lwc';
import SimilarBoats from 'c/similarBoats';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { getNavigateCalledWith } from 'lightning/navigation';

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getSimilarBoatsAdapter = registerApexTestWireAdapter(getSimilarBoats);

const mockSimilarBoatsData = require('./data/getSimilarBoats.json');

const BOAT_ID = 'a025e000003AQaoAAG';

describe('c-similar-boats', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('says no similar boats found if no data returned', () => {
    const element = createElement('c-similar-boats', {
      is: SimilarBoats
    });
    element.recordId = BOAT_ID;
    element.similarBy = 'Price'
    document.body.appendChild(element);
    getSimilarBoatsAdapter.emit([]);
    return Promise.resolve().then(() => {
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
  });


  it('gets and displays the correct number of boat tiles and allows navigation', () => {
    const element = createElement('c-similar-boats', {
      is: SimilarBoats
    });
    element.recordId = BOAT_ID;
    element.similarBy = 'Type'
    document.body.appendChild(element);
    getSimilarBoatsAdapter.emit(mockSimilarBoatsData);
    return Promise.resolve().then(() => {
      // expect no boat tiles
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

      return Promise.resolve();
    }).then(() => {
      const navResults = getNavigateCalledWith();
      // getNavigateCalledWith() isn't providing the recordId
      expect(navResults.pageReference.type).toBe('standard__recordPage');
      expect(navResults.pageReference.attributes.objectApiName).toBe('Boat__c');
      expect(navResults.pageReference.attributes.actionName).toBe('view');
    });
  });

  it('handles data error', () => {
    // TODO: Not required by badge but should dispatch a toast
    const element = createElement('c-similar-boats', {
      is: SimilarBoats
    });
    element.recordId = BOAT_ID;
    element.similarBy = 'Length'
    document.body.appendChild(element);
    getSimilarBoatsAdapter.emitError();
    return Promise.resolve().then(() => {
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
});
