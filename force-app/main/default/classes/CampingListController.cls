public with sharing class CampingListController {
    @AuraEnabled
    public static List<Camping_Item__c> getItems() {
        
        // Check to make sure all fields are accessible to this user
        String[] fieldsToCheck = new String[] {
            'Id', 'Name', 'Price__c', 'Quantity__c', 'Packed__c', 'CreatedDate'
        };
        // Perform isAccessible() checking first, then
        //cache me
        Map<String,Schema.SObjectField> fieldDescribeTokens = 
            Schema.SObjectType.Camping_Item__c.fields.getMap();
        
        // cache me
        for(String field : fieldsToCheck) {
            if( ! fieldDescribeTokens.get(field).getDescribe().isAccessible()) {
                throw new System.NoAccessException();
                //return null;
            }
        }
        
        // OK, they're cool, let 'em through
        return [SELECT Id, Name, Price__c, Quantity__c, Packed__c, CreatedDate FROM Camping_Item__c ORDER BY CreatedDate DESC];
    }
    
    @AuraEnabled
    public static Camping_Item__c saveItem(Camping_Item__c item) {
        // Perform isUpdatable() checking first, then
        upsert item;
        return item;
    }
}