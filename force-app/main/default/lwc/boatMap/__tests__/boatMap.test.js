import { createElement } from 'lwc';
import BoatMap from 'c/boatMap';
import { getRecord } from 'lightning/uiRecordApi';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

const BOAT_ID = 'a025e000003AQbNAAW';

describe('c-boat-map', () => {
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

  it('renders contact details', async () => {
    const element = createElement('c-boat-map', {
      is: BoatMap
    });
    document.body.appendChild(element);
    const selectBoat = element.shadowRoot.querySelector('span.slds-align_absolute-center');
    expect(selectBoat.innerHTML).toBe('Please select a boat to see its location!');
    element.recordId = BOAT_ID;
    // Emit data from @wire
    getRecord.emit(mockGetRecord);

    // await promise resolution
    await flushPromises();

    const mapElement = element.shadowRoot.querySelector('lightning-map');
    expect(mapElement.mapMarkers).toStrictEqual(
      [{
        location: {
          Latitude: mockGetRecord.fields.Geolocation__Latitude__s.value,
          Longitude: mockGetRecord.fields.Geolocation__Longitude__s.value
        }
      }]
    );
  });

  it('reacts to message service', async () => {
    const element = createElement('c-boat-map', {
      is: BoatMap
    });
    document.body.appendChild(element);
    const selectBoat = element.shadowRoot.querySelector('span.slds-align_absolute-center');
    expect(selectBoat.innerHTML).toBe('Please select a boat to see its location!');
    element.recordId = BOAT_ID;
    const otherId = 'a025e000003AQbNAAZ';
    // publish
    publish(MessageContext, BOATMC, { recordId: otherId });
    getRecord.emit(mockGetRecord);

    // await promise resolution
    await flushPromises();

    expect(element.recordId).toBe(otherId);
  });

  it('handles error from wire', async () => {
    const element = createElement('c-boat-map', {
      is: BoatMap
    });
    document.body.appendChild(element);
    element.recordId = BOAT_ID;
    // Emit data from @wire
    getRecord.emitError();

    // await promise resolution
    await flushPromises();

    // Select elements for validation
    const mapElement = element.shadowRoot.querySelector('lightning-map');
    expect(element.recordId).toBeUndefined();
    // still has the select a boat message
    const selectBoat = element.shadowRoot.querySelector('span.slds-align_absolute-center');
    expect(selectBoat.innerHTML).toBe('Please select a boat to see its location!');
  });
});
