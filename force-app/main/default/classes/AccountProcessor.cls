public class AccountProcessor {
	@future
    public static void countContacts(List<Id> accountIds) {
        // get accounts
        for (Id accId : accountIds) {
            System.debug(accId);
        }
		List<Account> accounts = [SELECT Id, Number_of_Contacts__c, (SELECT Id, AccountId FROM Contacts) FROM Account WHERE Id = :accountIds];
        // get contacts
        List<Account> accountsToUpdate = new List<Account>();
        for (Account a : accounts) {
            Integer contactCount = a.contacts.size();
            System.debug('Account Number Contacts: ' + a.Number_of_Contacts__c + ' Counted Contacts:' + contactCount);
            if (a.Number_of_Contacts__c == null || a.Number_of_Contacts__c != contactCount) {
                a.Number_of_Contacts__c = contactCount;
                accountsToUpdate.add(a);
            }
        }
        if (accountsToUpdate.size() > 0) {
            update accountsToUpdate;
        }
    }
}