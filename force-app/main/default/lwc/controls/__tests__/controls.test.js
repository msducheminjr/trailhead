import { createElement } from 'lwc';
import Controls from 'c/controls';

describe('c-controls', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('fires add event when button clicked', () => {
    const element = createElement('c-controls', {
      is: Controls
    });
    document.body.appendChild(element);
    let addCalled = false;
    element.addEventListener('add', () => {
      addCalled = true;
    });
    const childButtons = element.shadowRoot.querySelectorAll('lightning-button');
    let addButton;
    for(let i = 0; i < childButtons.length; i++) {
      if(childButtons[i].label === 'Add') {
        addButton = childButtons[i];
        break;
      }
    }
    addButton.dispatchEvent(new CustomEvent('click'));
    return Promise.resolve().then(() => {
      expect(addCalled).toBe(true);
    });
  });
  it('fires subtract event when button clicked', () => {
    const element = createElement('c-controls', {
      is: Controls
    });
    document.body.appendChild(element);
    let subtractCalled = false;
    element.addEventListener('subtract', () => {
      subtractCalled = true;
    });
    const childButtons = element.shadowRoot.querySelectorAll('lightning-button');
    let subtractButton;
    for(let i = 0; i < childButtons.length; i++) {
      if(childButtons[i].label === 'Subtract') {
        subtractButton = childButtons[i];
        break;
      }
    }
    subtractButton.dispatchEvent(new CustomEvent('click'));
    return Promise.resolve().then(() => {
      expect(subtractCalled).toBe(true);
    });
  });

  it('fires multiply event with correct payload when x2 clicked', () => {
    const element = createElement('c-controls', {
      is: Controls
    });
    document.body.appendChild(element);
    let timesValid = false;
    element.addEventListener('multiply', (event) => {
      if(event.detail === 2)
      timesValid = true;
    });
    const childButtons = element.shadowRoot.querySelectorAll('c-button');
    let timesTwo;
    for(let i = 0; i < childButtons.length; i++) {
      if(childButtons[i].label === 2) {
        timesTwo = childButtons[i];
        break;
      }
    }
    timesTwo.dispatchEvent(new CustomEvent('buttonclick', { bubbles: true }));
    return Promise.resolve().then(() => {
      expect(timesValid).toBe(true);
    });
  });


  it('fires multiply event with correct payload when x3 clicked', () => {
    const element = createElement('c-controls', {
      is: Controls
    });
    document.body.appendChild(element);
    let timesValid = false;
    element.addEventListener('multiply', (event) => {
      if(event.detail === 3)
      timesValid = true;
    });
    const childButtons = element.shadowRoot.querySelectorAll('c-button');
    let timesThree;
    for(let i = 0; i < childButtons.length; i++) {
      if(childButtons[i].label === 3) {
        timesThree = childButtons[i];
        break;
      }
    }
    timesThree.dispatchEvent(new CustomEvent('buttonclick', { bubbles: true }));
    return Promise.resolve().then(() => {
      expect(timesValid).toBe(true);
    });
  });
});
