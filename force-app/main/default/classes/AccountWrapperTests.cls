@IsTest
private class AccountWrapperTests {
  @TestSetup
  static void loadTestData() {
    // GIVEN
    List<Account> accounts = new List<Account>();
    Account acct = new Account(Name = 'ACME');
    Account highPriorityAcct = new Account(Name = 'Super ACME');
    Account edgeAcct = new Account(Name = 'Edge Cases');
    accounts.add(acct);
    accounts.add(highPriorityAcct);
    accounts.add(edgeAcct);
    insert accounts;
    List<Opportunity> opps = TestFactory.generateOppsForAccount(acct.id, 1000.00, 5);
    opps.addAll(TestFactory.generateOppsForAccount(highPriorityAcct.id, 100000.01, 5));
    opps.addAll(TestFactory.generateOppsForAccount(edgeAcct.id, 100000.00, 5));
    insert opps;
  }

  @IsTest
  static void testPositiveRoundedAveragePrice() {
    // WHEN
    Account acct = [SELECT Id FROM Account WHERE Name = 'ACME' LIMIT 1];
    AccountWrapper acctWrapper = new AccountWrapper(acct);
    // THEN
    Test.startTest();
    Assert.areEqual(
      acctWrapper.getRoundedAvgPriceOfOpps(),
      1000.00,
      'Expected to get 1000.00');
    Test.stopTest();
  }

  @IsTest
  static void testIsHighPriority() {
    // WHEN
    List<Account> accounts = [SELECT Id, Name FROM Account];
    Assert.areEqual(3, accounts.size(), 'Expected 3 accounts to be retrieved');
    /* Bad challenge logic as-of January 2, 2024
        One of your test wrapper variables MUST be named acctWrapper or the
        challenge will fail. This was not specified in the challenge instructions.
        Originally had acctWrapper named acmeWrapper and wrapper named acctWrapper
        in the loop.
    */
    AccountWrapper acctWrapper;
    AccountWrapper superAcmeWrapper;
    AccountWrapper edgeWrapper;
    for(Account acct : accounts) {
      AccountWrapper wrapper = new AccountWrapper(acct);
      switch on acct.Name {
        when 'ACME' {
          acctWrapper = wrapper;
        }
        when 'Super ACME' {
          superAcmeWrapper = wrapper;
        }
        when 'Edge Cases' {
          edgeWrapper = wrapper;
        }
      }
    }
    Assert.isNotNull(acctWrapper, 'Expected ACME wrapper not to be null.');
    Assert.isNotNull(superAcmeWrapper, 'Expected Super ACME wrapper not to be null.');
    Assert.isNotNull(edgeWrapper, 'Expected Edge Cases wrapper not to be null.');
    // THEN
    Test.startTest();
    // high priorty should be true for Super Acme
    Assert.isTrue(
      superAcmeWrapper.isHighPriority(),
      'Expected Super Acme to be high priority');
    Assert.isFalse(
      edgeWrapper.isHighPriority(),
      'Expected Edge Cases not to be high priority due to > operator.');
    Assert.isFalse(
      acctWrapper.isHighPriority(),
      'Expected Acme not to be high priority.');
    Test.stopTest();
  }

  @IsTest
  static void testNegativeAccountWrapperAvgPriceOfOpps() {
    // GIVEN
    Account acct = [SELECT Id FROM Account LIMIT 1];
    List<Opportunity> opps = [
      SELECT Amount
      FROM Opportunity
      WHERE accountId = :acct.Id
    ];
    for (Opportunity o : opps) {
      o.Amount = 0;
    }
    update opps;
    AccountWrapper acctWrapper = new AccountWrapper(acct);
    // WHEN
    try {
      Test.startTest();
      acctWrapper.getRoundedAvgPriceOfOpps();
      Test.stopTest();
      Assert.fail('An exception should have been thrown');
    } catch (AccountWrapper.AWException e) {
      // THEN
      Assert.isTrue(
        e.getMessage().equalsIgnoreCase('no won opportunities'),
        'Exception message does not match: ' + e.getMessage()
      );
    }
  }
}
