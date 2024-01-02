@IsTest
private class MyDataGenerationTests {
  @TestSetup
  static void loadTestDataFromStaticResource() {
    // GIVEN
    List<sObject> accounts = Test.loadData(Account.SObjectType, 'otherAccountData');
  }
  @IsTest
  static void testLoadOtherAccountsFromStaticResource() {
    // WHEN
    List<Account> accts = [SELECT ID FROM Account];
    // THEN
    Assert.areEqual(15, accts.size(), 'Expected 15 accounts');
  }
}
