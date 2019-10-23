global with sharing class BoatSearchResults {

    @AuraEnabled
    public static List<Boat__c> getBoats(String boatTypeId) {
        List<Boat__c> boats;
        if (boatTypeId == '' || boatTypeId == null) {
            boats = [SELECT Id, Name, BoatType__c, Contact__c, Description__c, Picture__c, Price__c, 
                     Length__c, Contact__r.Name, Contact__r.Email, Contact__r.HomePhone, 
                     BoatType__r.Name, Year_Built__c, Geolocation__latitude__s, Geolocation__longitude__s  FROM Boat__c];
        } else {
			boats = [SELECT Id, Name, BoatType__c, Contact__c, Description__c, Picture__c, Price__c, 
                     Length__c, Contact__r.Name, Contact__r.Email, Contact__r.HomePhone, 
                     BoatType__r.Name, Year_Built__c, Geolocation__latitude__s, Geolocation__longitude__s FROM Boat__c WHERE BoatType__c = :boatTypeId];            
        }
        return boats;
    }
}