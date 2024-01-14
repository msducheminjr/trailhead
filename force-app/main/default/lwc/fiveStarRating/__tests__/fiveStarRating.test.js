import { createElement } from 'lwc';
import FiveStarRating from 'c/fiveStarRating';
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

// create mockFiveStar constant
const mockFiveStar = jest.fn(() => {
  return {
    setRating: jest.fn(),
    getRating: jest.fn()
  }
});

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
            global.rating = mockFiveStar;
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

  // Helper function to resolve promises instead of using nested Promise.resolve() calls.
  async function flushPromises() {
    return Promise.resolve();
  }

  describe('starClass', () => {
    it('has correct class if read-only', () => {
      const element = createElement('c-five-star-rating', {
        is: FiveStarRating
      });
      element.readOnly = true;
      element.value = 2;
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
      document.body.appendChild(element);
      const starList = element.shadowRoot.querySelector('ul');
      expect(starList.classList.length).toBe(1);
      expect(starList.classList['0']).toBe('c-rating');
    });
  });

  describe('error handling', () =>{
    it('dispatches the error toast if script fails to load', async () => {
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

      // await promise resolution
      await flushPromises();

      expect(correctToast).toBe(true);
    });

    it('dispatches the error toast if styles fail to load', async () => {
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

      // await promise resolution
      await flushPromises();

      expect(correctToast).toBe(true);
    });
  });
});
