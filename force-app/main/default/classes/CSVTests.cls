@IsTest
private class CSVTests {
  @TestSetup
  static void loadTestDataFromStaticResource() {
    // GIVEN
    List<sObject> accounts = Test.loadData(Account.SObjectType, 'accountData');
  }
  @IsTest
  static void testLoadAccountsFromStaticResource() {
    // WHEN
    List<Account> accts = [SELECT ID FROM Account];
    // THEN
    Assert.isTrue(accts.size() == 3, 'Expected 3 accounts');
  }
}
