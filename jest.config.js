const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    // add any custom configurations here
    moduleNameMapper: {
        '^c/displayPanel$': '<rootDir>/force-app/test/jest-mocks/c/displayPanel',
        'c/fiveStarRating$': '<rootDir>/force-app/test/jest-mocks/c/fiveStarRating',
        '^thunder/hammerButton$': '<rootDir>/force-app/test/jest-mocks/thunder/hammerButton',
        '^lightning/button$': '<rootDir>/force-app/test/jest-mocks/lightning/button',
        '^lightning/messageService$': '<rootDir>/force-app/test/jest-mocks/lightning/messageService',
        '^lightning/navigation$': '<rootDir>/force-app/test/jest-mocks/lightning/navigation',
        '^lightning/platformShowToastEvent$': '<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent'
      }
};
