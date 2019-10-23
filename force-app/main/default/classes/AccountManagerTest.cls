@IsTest
private class AccountManagerTest {
    @isTest static void testGetAccount() {
        Id recordId = createTestRecord();
        // Set up a test request
        RestRequest request = new RestRequest();
        request.requestUri =
            'https://curious-goat-410604-dev-ed.my.salesforce.com/services/apexrest/Accounts/'
            + recordId + '/contacts';
        request.httpMethod = 'GET';
        RestContext.request = request;
        // Call the method to test
        Account thisAccount = AccountManager.getAccount();
        // Verify results
        System.assert(thisAccount != null);
        System.assertEquals('TestingZoo', thisAccount.name);
        System.assertEquals(2, thisAccount.contacts.size());
    }
    // Helper method
    static Id createTestRecord() {
        // Create test record
        Account accountTest = new Account(
            Name='TestingZoo');
        insert accountTest;
        Contact[] contactsTest = new Contact[]{new Contact(firstName='Bill', lastName='Jones', AccountId=accountTest.id), new Contact(firstName='Fred', lastName='Jones', AccountId=accountTest.id)}; 
   		insert contactsTest;
        return accountTest.Id;
    }
}