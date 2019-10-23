public with sharing class SearchResultsController {
     @AuraEnabled
     public static List<Account> getAccounts() {
       List<Account> accounts = [SELECT Id, Name, Phone, Website, OwnerId FROM Account LIMIT 5];
       return accounts;
     }
     @AuraEnabled
     public static List<Contact> getContacts() {
       List<Contact> contacts = [SELECT Id, Name, Phone, Email, Title FROM Contact LIMIT 5];
       return contacts;
     }
     @AuraEnabled
     public static List<Lead> getLeads() {
       List<Lead> leads = [SELECT Id, Name, Company, Email, Status, Phone FROM Lead LIMIT 5];
       return leads;
     }
   }