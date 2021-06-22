import { LightningElement, api } from 'lwc';

// custom mock because the real class has the loadScript and
// loadStyle stuff and was causing promise rejection warnings
// in parent compnonent tests
export default class FiveStarRating extends LightningElement {
  @api readOnly = false;
  @api value;
}
