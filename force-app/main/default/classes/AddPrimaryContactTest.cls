@isTest
private class AddPrimaryContactTest {
	@testSetup
    static void setup() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 100; i++) {
            Account a = new Account(Name='Account' + i);
            if (Math.mod(i, 2) == 0) {
              a.BillingState = 'NY';    
            } else {
              a.BillingState = 'CA';  
            }
        	accounts.add(a);
        }
        insert accounts;
    }
    
    static testmethod void testQueueable() {
        // query for test data to pass to queueable class
        Contact baseContact = new Contact(FirstName='Spectoral', LastName='Fein');		
        String expectedState = 'CA';
        // Create our Queueable instance
        AddPrimaryContact conGen = new AddPrimaryContact(baseContact, expectedState);
        // startTest/stopTest block to force async processes to run
        Test.startTest();        
        System.enqueueJob(conGen);
        Test.stopTest();        
        // Validate the job ran. Check if record have correct parentId now
        System.assertEquals(50, [SELECT COUNT() FROM Contact WHERE FirstName = 'Spectoral' AND LastName = 'Fein' and AccountId IN (SELECT Id from Account WHERE BillingState = :expectedState)]);        
    }
}