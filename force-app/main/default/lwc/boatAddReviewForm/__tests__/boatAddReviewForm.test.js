import { createElement } from 'lwc';
import BoatAddReviewForm from 'c/boatAddReviewForm';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

const BOAT_ID = 'a025e000003AQaYAAW';

describe('c-boat-add-review-form', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it('initializes with expected values', () => {
    const element = createElement('c-boat-add-review-form', {
      is: BoatAddReviewForm
    });
    element.recordId = BOAT_ID;
    document.body.appendChild(element);
    const recordForm = element.shadowRoot.querySelector('lightning-record-edit-form');
    expect(recordForm.objectApiName).toBe('BoatReview__c');
    const inputFields = recordForm.querySelectorAll('lightning-input-field');
    const nameField = inputFields[0];
    expect(nameField.fieldName).toBe('Name');
    const commentsField = inputFields[1];
    expect(commentsField.fieldName).toBe('Comment__c');
    const rating = element.shadowRoot.querySelector('c-five-star-rating');
    expect(rating.value).toBe(0);
    const submitButton = element.shadowRoot.querySelector('lightning-button');
    expect(submitButton.type).toBe('submit');
    expect(submitButton.label).toBe('Submit');
  });

  describe('handles form submission', () =>{
    it('submits with expected values', () => {
      const element = createElement('c-boat-add-review-form', {
        is: BoatAddReviewForm
      });
      element.recordId = BOAT_ID;
      document.body.appendChild(element);
      // see if submit event is ever called
      const recordForm = element.shadowRoot.querySelector('lightning-record-edit-form');
      const formSubmit = jest.fn();
      recordForm.submit = formSubmit;
      // set expected values for submit event
      const expectedName = 'Worth renting'
      const expectedComment = 'This boat is <em>awesome</em>!';
      const rating = element.shadowRoot.querySelector('c-five-star-rating');
      // dispatch event to indicate rating selected
      const expectedRating = 4
      rating.dispatchEvent(new CustomEvent('ratingchange', { detail: { rating: expectedRating } }));
      return Promise.resolve().then(() => {
        recordForm.dispatchEvent(new CustomEvent('submit', {
          detail: {
            fields: {
              Name: expectedName,
              Comment__c: expectedComment
            }
          }
        }));
        return Promise.resolve();
      }).then(() =>{
        expect(formSubmit).toBeCalledWith(
          {
            Name: expectedName,
            Comment__c: expectedComment,
            Rating__c: expectedRating,
            Boat__c: BOAT_ID}
        );
      });
    });
    it('handles success and resets', () => {
      const element = createElement('c-boat-add-review-form', {
        is: BoatAddReviewForm
      });
      element.recordId = BOAT_ID;
      document.body.appendChild(element);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Review Created!');
        expect(event.detail.variant).toBe('success');
        correctToast = true;
      });
      const recordForm = element.shadowRoot.querySelector('lightning-record-edit-form');
      const inputFields = recordForm.querySelectorAll('lightning-input-field');
      const nameField = inputFields[0];
      const commentsField = inputFields[1];
      const nameReset = jest.fn();
      const commentsReset = jest.fn();
      nameField.reset = nameReset;
      commentsField.reset = commentsReset;
      const rating = element.shadowRoot.querySelector('c-five-star-rating');
      expect(rating.value).toBe(0);
      // dispatch event to indicate rating selected
      rating.dispatchEvent(new CustomEvent('ratingchange', { detail: { rating: 4 } }));
      const expectedName = 'Worth renting';
      const expectedComment = 'This boat is <em>awesome</em>!';
      nameField.value = expectedName;
      commentsField.value = expectedComment;
      return Promise.resolve().then(() => {
        expect(nameField.value).toBe(expectedName);
        expect(commentsField.value).toBe(expectedComment);
        expect(rating.value).toBe(4);
        recordForm.dispatchEvent(new CustomEvent('success'));
        return Promise.resolve();
      }).then(() =>{
        return Promise.resolve();
      }).then(() => {
        expect(nameReset).toBeCalled();
        expect(commentsReset).toBeCalled();
        expect(rating.value).toBe(0);
        expect(correctToast).toBe(true);
      });
    });
  });


});
