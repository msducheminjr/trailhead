import { createElement } from 'lwc';
// use relative path becase c/fiveStarRating is mocked in module name mapper
import FiveStarRating from '../fiveStarRating';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

let mockScriptSuccess = true;
let mockStyleSuccess = true;
// Sample error for loadScript error
const mockLoadScriptError = {
  body: { message: 'An internal server error has occurred' },
  ok: false,
  status: 500,
  statusText: 'Internal server error'
};

// NOTE: This test is dependent upon having the fivestar static resource in the
//       staticresources folder of the sfdx directory.

jest.mock(
  'lightning/platformResourceLoader',
  () => {
    return {
      loadScript() {
        return new Promise((resolve, reject) => {
          // If the variable is false we're simulating an error when loading
          // the script resource.
          if (!mockScriptSuccess) {
            reject(mockLoadScriptError);
          } else {
            require('../../../staticresources/fivestar/rating.js');
            resolve();
          }
        });
      },
      loadStyle() {
        return new Promise((resolve, reject) => {
            // If the variable is false we're simulating an error when loading
            // the script resource.
            if (!mockStyleSuccess) {
              reject(mockLoadScriptError);
            } else {
              resolve();
            }
        });
      }
    };
  },
  { virtual: true }
);

describe('c-five-star-rating', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
    mockScriptSuccess = true;
    mockStyleSuccess = true;
  });

  describe('starClass', () => {
    it('has correct classs if read-only', () => {
      const element = createElement('c-five-star-rating', {
        is: FiveStarRating
      });
      element.readOnly = true;
      element.value = 2;
      element.initializeRating = jest.fn();
      element.loadScript = jest.fn();
      element.isRendered = true;
      document.body.appendChild(element);
      const starList = element.shadowRoot.querySelector('ul');
      expect(starList.classList.length).toBe(2);
      expect(starList.classList['0']).toBe('readonly');
      expect(starList.classList['1']).toBe('c-rating');
      expect(element.value).toBe(2);
    });

    it('has correct class if editable', () => {
      const element = createElement('c-five-star-rating', {
        is: FiveStarRating
      });
      element.readOnly = false;
      element.isRendered = true;
      element.initializeRating = jest.fn();
      element.loadScript = jest.fn();
      document.body.appendChild(element);
      const starList = element.shadowRoot.querySelector('ul');
      expect(starList.classList.length).toBe(1);
      expect(starList.classList['0']).toBe('c-rating');
    });
  });

  describe('error handling', () =>{
    it('dispatches the error toast if script fails to load', () => {
      mockScriptSuccess = false;
      const element = createElement('c-five-star-rating', {
        is: FiveStarRating
      });
      document.body.appendChild(element);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error loading five-star');
        expect(event.detail.message).toBe(mockLoadScriptError.body.message);
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });
      // need to chain multiple levels of promise to wait for the toast to show up
      return Promise.resolve().then(() => {
        return Promise.resolve();
      }).then(() => {
        return Promise.resolve();
      }).then(() => {
        expect(correctToast).toBe(true);
      });
    });

    it('dispatches the error toast if styles fail to load', () => {
      mockStyleSuccess = false;
      const element = createElement('c-five-star-rating', {
        is: FiveStarRating
      });
      document.body.appendChild(element);
      let correctToast = false;
      element.addEventListener(ShowToastEventName, (event) => {
        expect(event.detail.title).toBe('Error loading five-star');
        expect(event.detail.message).toBe(mockLoadScriptError.body.message);
        expect(event.detail.variant).toBe('error');
        correctToast = true;
      });
      // need to chain multiple levels of promise to wait for the toast to show up
      return Promise.resolve().then(() => {
        return Promise.resolve();
      }).then(() => {
        return Promise.resolve();
      }).then(() => {
        expect(correctToast).toBe(true);
      });
    });
  });
});
