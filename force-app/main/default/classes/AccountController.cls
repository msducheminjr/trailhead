public with sharing class AccountController {
  public static List<Account> getAllActiveAccounts() {
    return [SELECT Id,Name,Active__c FROM Account WHERE Active__c = 'Yes'];
  }

  // added as part of Lightning Web Components and Salesforce Data module
  @AuraEnabled(cacheable=true)
  public static List<Account> getAccounts(){
    try {
      return [
        SELECT Name, AnnualRevenue, Industry
        FROM Account
        WITH SECURITY_ENFORCED
        ORDER BY Name
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
