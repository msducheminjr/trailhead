import { createElement } from 'lwc';
import BoatMap from 'c/boatMap';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

const BOAT_ID = 'a025e000003AQbNAAW';
// Register as an LDS wire adapter
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

// Register as a standard wire adapter because the component under test requires this adapter.
const messageContextWireAdapter = registerTestWireAdapter(MessageContext);

describe('c-boat-map', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders contact details', () => {
    const element = createElement('c-boat-map', {
      is: BoatMap
    });
    document.body.appendChild(element);
    const selectBoat = element.shadowRoot.querySelector('span.slds-align_absolute-center');
    expect(selectBoat.innerHTML).toBe('Please select a boat to see its location!');
    element.recordId = BOAT_ID;
    // Emit data from @wire
    getRecordAdapter.emit(mockGetRecord);

    return Promise.resolve().then(() => {
      // Select elements for validation
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
  });

  it('reacts to message service', () => {
    const element = createElement('c-boat-map', {
      is: BoatMap
    });
    document.body.appendChild(element);
    const selectBoat = element.shadowRoot.querySelector('span.slds-align_absolute-center');
    expect(selectBoat.innerHTML).toBe('Please select a boat to see its location!');
    element.recordId = BOAT_ID;
    const otherId = 'a025e000003AQbNAAZ';
    // publish
    publish(messageContextWireAdapter, BOATMC, { recordId: otherId });
    getRecordAdapter.emit(mockGetRecord);

    return Promise.resolve().then(() => {
      expect(element.recordId).toBe(otherId);
    });
  });

  it('handles error from wire', () => {
    const element = createElement('c-boat-map', {
      is: BoatMap
    });
    document.body.appendChild(element);
    element.recordId = BOAT_ID;
    // Emit data from @wire
    getRecordAdapter.emitError();

    return Promise.resolve().then(() => {
      // Select elements for validation
      const mapElement = element.shadowRoot.querySelector('lightning-map');
      expect(element.recordId).toBeUndefined();
      // still has the select a boat message
      const selectBoat = element.shadowRoot.querySelector('span.slds-align_absolute-center');
      expect(selectBoat.innerHTML).toBe('Please select a boat to see its location!');
    });
  });

});
