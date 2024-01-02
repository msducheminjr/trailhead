@IsTest
private class CalculatorTests {
  @IsTest
  static void testDivideByZero() {
    try {
      Test.startTest();
      Calculator.divide(3,0);
      Test.stopTest();
      Assert.fail('An exception should have been thrown');
    } catch (Calculator.CalculatorException e) {
      Assert.areEqual(
        'You still can\'t divide by zero',
        e.getMessage(),
        'Expected error message about dividing by zero.'
      );
    }
  }
}
