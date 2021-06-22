import { createElement } from 'lwc';
import BoatsNearMe from 'c/boatsNearMe';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

// Realistic data with a list of boats
const mockGetBoatsByLocation = require('./data/getBoatsByLocation.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetBoatsByLocationNoRecords = require('./data/getBoatsByLocationNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getBoatsByLocationAdapter = registerApexTestWireAdapter(getBoatsByLocation);

const mockApexWireError = {
  body: { message: 'An internal server error has occurred' },
  ok: false,
  status: 500,
  statusText: 'Internal server error'
};

/* BEGIN MOCKING OF GEOLOCATION */
const mockGeolocation = {
  getCurrentPosition: jest.fn()
      .mockImplementation(success => Promise.resolve(success({
          coords: {
              latitude: 43.000000,
              longitude: 87.000000,
          },
      }))),
  watchPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation
/* END MOCKING OF GEOLOCATION */

const BOAT_TYPE_ID = 'a015e00000F8AXdAAN';

describe('c-boats-near-me', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  describe('getBoatsByLocation @wire data', () => {
    it('adds four pins to the map if three records', () => {
      const element = createElement('c-boats-near-me', {
        is: BoatsNearMe
      });
      element.boatTypeId = BOAT_TYPE_ID;
      document.body.appendChild(element);

      // Emit data from @wire
      getBoatsByLocationAdapter.emit(JSON.stringify(mockGetBoatsByLocation));
      return Promise.resolve().then(() => {
        // Select elements for validation
        const mapElement = element.shadowRoot.querySelector('lightning-map');
        expect(mapElement.mapMarkers).toStrictEqual([
          {
            location: {
              Latitude: 43,
              Longitude: 87
            },
            title: 'You are here!',
            icon: 'standard:user'
          },
          {
            location: {
              Latitude: mockGetBoatsByLocation[0].Geolocation__Latitude__s,
              Longitude: mockGetBoatsByLocation[0].Geolocation__Longitude__s
            },
            title: mockGetBoatsByLocation[0].Name
          },
          {
            location: {
              Latitude: mockGetBoatsByLocation[1].Geolocation__Latitude__s,
              Longitude: mockGetBoatsByLocation[1].Geolocation__Longitude__s
            },
            title: mockGetBoatsByLocation[1].Name
          },
          {
            location: {
              Latitude: mockGetBoatsByLocation[2].Geolocation__Latitude__s,
              Longitude: mockGetBoatsByLocation[2].Geolocation__Longitude__s
            },
            title: mockGetBoatsByLocation[2].Name
          }
        ]);
      });
    });

    it('adds just the user location if no records', () => {
      const element = createElement('c-boats-near-me', {
        is: BoatsNearMe
      });
      element.boatTypeId = BOAT_TYPE_ID;
      document.body.appendChild(element);

      // Emit data from @wire
      getBoatsByLocationAdapter.emit(JSON.stringify(mockGetBoatsByLocationNoRecords));
      return Promise.resolve().then(() => {
        // Select elements for validation
        const mapElement = element.shadowRoot.querySelector('lightning-map');
        expect(mapElement.mapMarkers).toStrictEqual(
          [{
            location: {
              Latitude: 43,
              Longitude: 87
            },
            title: 'You are here!',
            icon: 'standard:user'
          }]);
      });
    });

    it('handles wire errors', () => {
      const element = createElement('c-boats-near-me', {
        is: BoatsNearMe
      });
      element.boatTypeId = BOAT_TYPE_ID;
      document.body.appendChild(element);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error loading Boats Near Me');
        expect(event.detail.message).toBe('Error message: An internal server error has occurred')
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });
      // Emit data from @wire
      getBoatsByLocationAdapter.emitError(mockApexWireError);
      return Promise.resolve().then(() => {
        // Select elements for validation
        const mapElement = element.shadowRoot.querySelector('lightning-map');
        expect(mapElement).toBeNull();
        expect(correctToast).toBe(true);
      });
    });
  });
});
