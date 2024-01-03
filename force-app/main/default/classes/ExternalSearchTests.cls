@IsTest
private class ExternalSearchTests {
  @IsTest
  static void testPositiveMocking() {
    // GIVEN
    HTTPMockFactory mock = new HTTPMockFactory(
      200,
      'OK',
      'I found it!',
      new Map<String, String>()
    );
    Test.setMock(HttpCalloutMock.class, mock);
    // WHEN
    Test.startTest();
    String result = ExternalSearch.googleIt('epic search');
    Test.stopTest();
    // THEN
    Assert.areEqual('I found it!', result, 'Expected to receive mock response');
  }

  @IsTest
  static void testNegativeMocking() {
    // GIVEN
    HTTPMockFactory mock = new HTTPMockFactory(
      500,
      'Internal Server Error',
      'Houston We Have a Problem!',
      new Map<String, String>()
    );
    Test.setMock(HttpCalloutMock.class, mock);
    // WHEN
    try {
      Test.startTest();
      String result = ExternalSearch.googleIt('epic fail');
      Test.stopTest();
      Assert.fail('An exception should have been thrown');
    } catch(ExternalSearch.ExternalSearchException e) {
    // THEN
      Assert.areEqual(
        'Did not receive a 200 status code: 500',
        e.getMessage(),
        'Expected to receive exception with correct status code in message.'
      );
    }
  }
 }
