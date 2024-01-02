@IsTest
private class PermissionsTests {
  @TestSetup
  static void testSetup() {
    // GIVEN
    Account a = TestFactory.getAccount('No view For You!', true);
    Private_Object__c po = new Private_Object__c(Account__c = a.id, Notes__c = 'foo');
    insert po;
  }
  @IsTest
  static void testNegativePermissionSet() {
    // GIVEN
    User u = buildUser();
    insert u;
    System.runAs(u) {
      // WHEN
      Test.startTest();
      Private_Object__c[] pos = [SELECT Id, Account__c, Notes__c FROM Private_Object__c];
      Test.stopTest();
      // THEN
      Assert.areEqual(
        0,
        pos.size(),
        'A user without the permission set shouldn\'t see any records');
    }
  }
  @IsTest
  static void testPositivePermissionSet() {
    // GIVEN user with the Private_Object_Access permission
    User u = buildUser();
    insert u;
    PermissionSet ps = [
      SELECT Id
      FROM PermissionSet
      WHERE Name = 'Private_Object_Access'
    ];
    insert new PermissionSetAssignment(
      AssigneeId = u.Id,
      PermissionSetId = ps.Id
    );
    // Get account Id before System.runAs block
    Id accountId = [SELECT Id FROM Account WHERE Name = 'No view For You!' LIMIT 1].Id;
    System.runAs(u) {
      // WHEN
      Test.startTest();
      Private_Object__c[] pos = [SELECT Id, Account__c, Notes__c, OwnerId FROM Private_Object__c];
      Test.stopTest();
      // THEN
      Assert.areEqual(
        1,
        pos.size(),
        'A user with the permission set should see the record even though not an owner.'
      );
      Private_Object__c po = pos[0];
      Assert.areNotEqual(u.Id, po.OwnerId, 'Expected OwnerID to be different than user ID.');
      Assert.areEqual('foo', po.Notes__c, 'Expected user to see Notes field.');
      Assert.areEqual(accountId, po.Account__c, 'Expected Account to be visible and correct.');
    }
  }

  static User buildUser() {
    /* NOTE: In real life would allow Profile ID and other values to
     *       avoid duplication as optional parameter(s) so you could
     *       not perform SOQL for each user and bulkify properly.
     */
    return new User(
      ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User']
      .Id,
      LastName = 'last',
      Email = 'Cpt.Awesome@awesomesauce.com',
      UserName = 'Cpt.Awesome.' + DateTime.now().getTime() + '@awesomesauce.com',
      Alias = 'alias',
      TimeZoneSidKey = 'America/Los_Angeles',
      EmailEncodingKey = 'UTF-8',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US'
    );
  }
}
