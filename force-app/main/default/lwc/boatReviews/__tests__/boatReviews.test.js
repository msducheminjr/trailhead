import { createElement } from 'lwc';
import BoatReviews from 'c/boatReviews';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { getNavigateCalledWith } from 'lightning/navigation';

const getAllReviewsResult = require('./data/getAllReviews.json');
const BOAT_ID = 'a025e000003AQaYAAW';
// mock imperative getAllReviews call
jest.mock(
  '@salesforce/apex/BoatDataService.getAllReviews', () => {
    return { default: jest.fn(), };
  },
  { virtual: true }
);

const API_ERROR = {
  body: { message: 'An internal server error has occurred' },
  ok: false,
  status: 500,
  statusText: 'Internal server error'
};

// Use the mock version of fiveStarRating defined in the __mocks__ directory of that LWC
jest.mock( 'c/fiveStarRating' );

describe('c-boat-reviews', () => {
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

  describe('search after recordId set', () => {
    it('returns the list of reviews when there is data', async () => {
      const element = createElement('c-boat-reviews', {
        is: BoatReviews
      });
      getAllReviews.mockResolvedValue(getAllReviewsResult);
      document.body.appendChild(element);
      element.recordId = BOAT_ID;

      // await promise resolution
      await flushPromises();

      // test correct number of boat reviews
      const boatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(boatReviews.length).toBe(getAllReviewsResult.length);
      // test correct data associations on second record
      const reviewRecord = getAllReviewsResult[1];
      const secondReview = boatReviews[1];
      const avatar = secondReview.querySelector('lightning-avatar');
      expect(avatar.src).toBe(reviewRecord.CreatedBy.SmallPhotoUrl);
      const creatorAnchor = secondReview.querySelector('a');
      expect(creatorAnchor.getAttribute('data-record-id')).toBe(reviewRecord.CreatedById);
      expect(creatorAnchor.innerHTML).toBe(reviewRecord.CreatedBy.Name);
      const companyNameSpan = secondReview.querySelector('span');
      expect(companyNameSpan.innerHTML).toBe(reviewRecord.CreatedBy.CompanyName);
      const createdAtCmp = secondReview.querySelector('lightning-formatted-date-time');
      expect(createdAtCmp.value).toBe(reviewRecord.CreatedDate);
      const reviewTitle = secondReview.querySelector('p.slds-text-title_caps');
      expect(reviewTitle.innerHTML).toBe(reviewRecord.Name);
      const reviewComment = secondReview.querySelector('lightning-formatted-rich-text');
      expect(reviewComment.value).toBe(reviewRecord.Comment__c);
      const fiveStarCmp = secondReview.querySelector('c-five-star-rating');
      expect(fiveStarCmp.value).toBe(reviewRecord.Rating__c);
      expect(fiveStarCmp.readOnly).toBe(true);
    });

    it('displays the no reviews values when there is no data', async () => {
      const element = createElement('c-boat-reviews', {
        is: BoatReviews
      });
      getAllReviews.mockResolvedValue([]);
      document.body.appendChild(element);
      element.recordId = BOAT_ID;

      // await promise resolution
      await flushPromises();

      // test correct number of boat reviews
      const boatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(boatReviews.length).toBe(0);
      // no reviews available component
      const noReviews = element.shadowRoot.querySelector('div.slds-align_absolute-center');
      expect(noReviews.innerHTML).toBe('No reviews available');
    });

    it('updates reviews when refresh is called', async () => {
      const element = createElement('c-boat-reviews', {
        is: BoatReviews
      });
      getAllReviews.mockResolvedValue([]);
      document.body.appendChild(element);
      element.recordId = BOAT_ID;

      // await promise resolution
      await flushPromises();

      const initialBoatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(initialBoatReviews.length).toBe(0);
      getAllReviews.mockResolvedValue(getAllReviewsResult);
      element.refresh();

      // await promise resolution
      await flushPromises();

      // test correct number of boat reviews
      const boatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(boatReviews.length).toBe(getAllReviewsResult.length);
    });

    it('displays the no reviews values when boat ID is blank', async () => {
      const element = createElement('c-boat-reviews', {
        is: BoatReviews
      });
      document.body.appendChild(element);
      element.recordId = null;

      // await promise resolution
      await flushPromises();

      const boatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(boatReviews.length).toBe(0);
      // no reviews available component
      const noReviews = element.shadowRoot.querySelector('div.slds-align_absolute-center');
      expect(noReviews.innerHTML).toBe('No reviews available');
    });

    it('handles errors from the server side', async () => {
      const element = createElement('c-boat-reviews', {
        is: BoatReviews
      });
      getAllReviews.mockRejectedValue(API_ERROR);
      document.body.appendChild(element);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error');
        expect(event.detail.message).toBe('An error was encountered when trying to retrieve boat reviews.');
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });
      element.recordId = BOAT_ID;

      // await promise resolution
      await flushPromises();

      // test no boat reviews
      const boatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(boatReviews.length).toBe(0);
      // no reviews available component
      const noReviews = element.shadowRoot.querySelector('div.slds-align_absolute-center');
      expect(noReviews.innerHTML).toBe('No reviews available');
      // error toast fired
      expect(correctToast).toBe(true);
    });
  });

  describe('click of reviewer name', () => {
    it('navigates to the record page of the creator', async () =>{
      const element = createElement('c-boat-reviews', {
        is: BoatReviews
      });
      getAllReviews.mockResolvedValue(getAllReviewsResult);
      document.body.appendChild(element);
      element.recordId = BOAT_ID;

      // await promise resolution
      await flushPromises();

      // test correct number of boat reviews
      const boatReviews = element.shadowRoot.querySelectorAll('ul.slds-feed__list li.slds-feed__item');
      expect(boatReviews.length).toBe(getAllReviewsResult.length);
      // test correct data associations on second record
      const secondReview = boatReviews[1];
      const creatorAnchor = secondReview.querySelector('a');
      creatorAnchor.dispatchEvent(new CustomEvent('click'));

      // await promise resolution
      await flushPromises();

      const navResults = getNavigateCalledWith();
      const reviewRecord = getAllReviewsResult[1];
      expect(navResults.pageReference.type).toBe('standard__recordPage');
      expect(navResults.pageReference.attributes.objectApiName).toBe('User');
      expect(navResults.pageReference.attributes.recordId).toBe(reviewRecord.CreatedById);
      expect(navResults.pageReference.attributes.actionName).toBe('view');
    });
  });
});
