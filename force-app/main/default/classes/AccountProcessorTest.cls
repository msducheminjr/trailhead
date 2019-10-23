@IsTest
private class AccountProcessorTest {
    @IsTest
    private static void testCountContacts() {
        List<Account> accts = TestDataFactory.createAccountsWithContacts(3,2);
        List<Id> acctIds = new List<Id>();
        for (Account a : accts) {
            acctIds.add(a.Id);
        }
        Test.startTest();
        AccountProcessor.countContacts(acctIds);
        Test.stopTest();
        List<Account> afterAccts = [SELECT Id, Number_of_Contacts__c FROM Account WHERE Id IN :acctIds];  
        System.assertEquals(2, afterAccts[0].Number_of_Contacts__c, 'Did not have expected value for Number of Contacts');
    }
}