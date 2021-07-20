import { createElement } from 'lwc';
import BoatSearch from 'c/boatSearch';
import { getNavigateCalledWith } from 'lightning/navigation';


// test navigation to create page

// test handling of onsearch

describe('c-boat-search', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it('handles onsearch', () => {
    const element = createElement('c-boat-search', {
      is: BoatSearch
    });
    document.body.appendChild(element);
    const evtBoatTypeId = 'a015e00000F8AXdAAN';
    const boatForm = element.shadowRoot.querySelector('c-boat-search-form');
    const boatSearchResults = element.shadowRoot.querySelector('c-boat-search-results');
    const searchBoatsMock = jest.fn();

    // create a mock of boatSearchResults.searchBoats
    // so that you can test that it was called with the correct value
    boatSearchResults.searchBoats = searchBoatsMock;
    boatForm.dispatchEvent(new CustomEvent('search', { detail: { boatTypeId: evtBoatTypeId}}));
    return Promise.resolve().then(() => {
      expect(searchBoatsMock).toBeCalledWith(evtBoatTypeId);
    });
  });

  it('handles loading and doneloading', () => {
    const element = createElement('c-boat-search', {
      is: BoatSearch
    });
    document.body.appendChild(element);
    let spinner = element.shadowRoot.querySelector('lightning-spinner');
    expect(spinner).toBeNull();
    const boatSearchResults = element.shadowRoot.querySelector('c-boat-search-results');
    boatSearchResults.dispatchEvent(new CustomEvent('loading'));
    return Promise.resolve().then(() => {
      spinner = element.shadowRoot.querySelector('lightning-spinner');
      expect(spinner.alternativeText).toBe('Loading');
      expect(spinner.variant).toBe('brand');
      boatSearchResults.dispatchEvent(new CustomEvent('doneloading'));
      return Promise.resolve();
    }).then(() => {
      spinner = element.shadowRoot.querySelector('lightning-spinner');
      expect(spinner).toBeNull();
    });
  });

  it('handles New Boat click', () => {
    const element = createElement('c-boat-search', {
      is: BoatSearch
    });
    document.body.appendChild(element);
    const newBoat = element.shadowRoot.querySelector('lightning-button');
    newBoat.dispatchEvent(new CustomEvent('click'));
    return Promise.resolve().then(() => {
      const navResults = getNavigateCalledWith();
      expect(navResults.pageReference.type).toBe('standard__objectPage');
      expect(navResults.pageReference.attributes.objectApiName).toBe('Boat__c');
      expect(navResults.pageReference.attributes.actionName).toBe('new');
    });
  });
});
