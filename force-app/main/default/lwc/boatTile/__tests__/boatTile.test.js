import { createElement } from 'lwc';
import BoatTile from 'c/boatTile';

const boatObject = {
  Id: 'a025e000003AQaWAAW',
  Name: 'Gallifrey Falls',
  Description__c: 'Being on a boat that is moving through the water is one of my favorite experiences ever. Totally recommended.',
  Geolocation__Latitude__s: 34.201658,
  Geolocation__Longitude__s: -83.987133,
  Picture__c: '/resource/Houseboats/fishingboat2.jpg',
  Contact__r: {Name: 'James August'},
  BoatType__c: 'a015e00000F8AXdAAN',
  BoatType__r: {Name: 'Fishing Boat'},
  Length__c: 21,
  Price__c: 133000
};
const otherId = 'a025e000003AQaYAAW';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
describe('c-boat-tile', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  describe('classes and markup', () => {
    it('has expected classes if selected boat matches', () => {
      const element = createElement('c-boat-tile', {
        is: BoatTile
      });
      element.boat = boatObject;
      element.selectedBoatId = boatObject.Id;
      document.body.appendChild(element);
      const boatDiv = element.shadowRoot.querySelector('div');
      const lowerThird = boatDiv.querySelector('div.lower-third');
      const boatNameHeader = lowerThird.querySelector('h1');
      const boatOwnerHeader = lowerThird.querySelector('h2');
      expect(boatDiv.className).toBe(TILE_WRAPPER_SELECTED_CLASS);
      expect(boatNameHeader.innerHTML).toBe('Gallifrey Falls');
      expect(boatOwnerHeader.innerHTML).toBe('James August');
    });
    it('has expected classes if selected boat does not match', () => {
      const element = createElement('c-boat-tile', {
        is: BoatTile
      });
      element.boat = boatObject;
      element.selectedBoatId = otherId;
      document.body.appendChild(element);
      const boatDiv = element.shadowRoot.querySelector('div');
      const lowerThird = boatDiv.querySelector('div.lower-third');
      expect(boatDiv.className).toBe(TILE_WRAPPER_UNSELECTED_CLASS);
    });
  });

  describe('boat selection', () => {
    it('dispatches selected event on click', () => {
      const element = createElement('c-boat-tile', {
        is: BoatTile

      });
      element.boat = boatObject;
      element.selectedBoatId = otherId;
      document.body.appendChild(element);
      let expectedDetail = false;
      element.addEventListener('boatselect', (event) => {
        expect(event.detail['boatId']).toBe(element.boat.Id);
        expectedDetail = true;
      });
      const boatDiv = element.shadowRoot.querySelector('div');
      expect(boatDiv.className).toBe(TILE_WRAPPER_UNSELECTED_CLASS);
      boatDiv.dispatchEvent(new CustomEvent('click'));
      return Promise.resolve().then(() => {
        expect(expectedDetail).toBe(true);
        expect(boatDiv.className).toBe(TILE_WRAPPER_SELECTED_CLASS);
      });
    });
  });
});
