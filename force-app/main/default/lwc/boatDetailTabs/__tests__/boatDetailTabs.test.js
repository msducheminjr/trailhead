import { createElement } from 'lwc';
import BoatDetailTabs from 'c/boatDetailTabs';
import { getRecord } from 'lightning/uiRecordApi';
import { getNavigateCalledWith } from 'lightning/navigation';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const wiredBoat = require('./data/getRecord.json');

// Use the mock version of fiveStarRating defined in the __mocks__ directory of that LWC
jest.mock( 'c/fiveStarRating' );

describe('c-boat-detail-tabs', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  // Helper function to wait until the microtask queue is empty.
  // This is needed for promise timing
  async function flushPromises() {
    return Promise.resolve();
  }

  it('has expected wired response and navigates correctly on Full Details click', async () => {
    const element = createElement('c-boat-detail-tabs', {
      is: BoatDetailTabs
    });
    document.body.appendChild(element);
    publish(MessageContext, BOATMC, { recordId: wiredBoat.id });
    getRecord.emit(wiredBoat);

    // await promise resolution
    await flushPromises();

    const reviews = element.shadowRoot.querySelector('c-boat-reviews');
    expect(reviews.recordId).toBe(wiredBoat.id);
    const tabCards = element.shadowRoot.querySelectorAll('lightning-tab lightning-card');
    expect(tabCards[0].title).toBe(wiredBoat.fields.Name.value);
    const cardButton = tabCards[0].querySelector('lightning-button');
    // the API name of the custom label
    expect(cardButton.label).toBe('c.Full_Details');
    cardButton.dispatchEvent(new CustomEvent('click'));

    // await promise resolution
    await flushPromises();

    const navResults = getNavigateCalledWith();
    // getNavigateCalledWith() isn't providing the recordId
    expect(navResults.pageReference.type).toBe('standard__recordPage');
    expect(navResults.pageReference.attributes.objectApiName).toBe('Boat__c');
    expect(navResults.pageReference.attributes.actionName).toBe('view');
  });

  it('handles the createreview event', async () => {
    const element = createElement('c-boat-detail-tabs', {
      is: BoatDetailTabs
    });
    document.body.appendChild(element);
    publish(MessageContext, BOATMC, { recordId: wiredBoat.id });
    getRecord.emit(wiredBoat);

    // Wait for any asynchronous DOM updates
    await flushPromises();

    const reviewsRefresh = jest.fn();
    const resultTabset = element.shadowRoot.querySelector('lightning-tabset');
    expect(resultTabset.activeTabValue).not.toBe('c.Reviews');
    const  reviews = element.shadowRoot.querySelector('c-boat-reviews');
    expect(reviews.recordId).toBe(wiredBoat.id);
    reviews.refresh = reviewsRefresh;
    const reviewForm = element.shadowRoot.querySelector('c-boat-add-review-form');
    expect(reviewForm.recordId).toBe(wiredBoat.id);
    reviewForm.dispatchEvent(new CustomEvent('createreview'));

    // Wait for any asynchronous DOM updates
    await flushPromises();

    expect(reviewsRefresh).toHaveBeenCalled();
    expect(resultTabset.activeTabValue).toBe('c.Reviews');
  });

  it('has select a boat message if no boat', () => {
    const element = createElement('c-boat-detail-tabs', {
      is: BoatDetailTabs
    });
    document.body.appendChild(element);
    const selectBoat = element.shadowRoot.querySelector('lightning-card span.slds-align_absolute-center');
    expect(selectBoat.innerHTML).toBe('c.Please_select_a_boat');
  });
});
