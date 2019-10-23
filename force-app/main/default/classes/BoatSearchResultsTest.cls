@isTest
public class BoatSearchResultsTest {

    static testMethod void testGetBoatsEmptyString() {
        // (Integer numBoatTypes, Integer numContacts, Integer boatsPerContact)
        List<List<sObject>> objects = TestDataFactory.createBoats(3, 4, 2);
        Integer expectedBoats = 8;
        List<Boat__c> queriedBoats;
        Test.startTest();
        queriedBoats = BoatSearchResults.getBoats('');
        Test.stopTest();
        System.assertEquals(expectedBoats, queriedBoats.size(), 'Did not return the expected number of boats');
        System.assertEquals(objects[2].size(), queriedBoats.size(), 'Did not return the expected number of boats');
    }

    static testMethod void testGetBoatsNullString() {
        // (Integer numBoatTypes, Integer numContacts, Integer boatsPerContact)
        List<List<sObject>> objects = TestDataFactory.createBoats(3, 4, 2);
        Integer expectedBoats = 8;
        List<Boat__c> queriedBoats;
        Test.startTest();
        queriedBoats = BoatSearchResults.getBoats(null);
        Test.stopTest();
        System.assertEquals(expectedBoats, queriedBoats.size(), 'Did not return the expected number of boats');
        System.assertEquals(objects[2].size(), queriedBoats.size(), 'Did not return the expected number of boats');
    }
    
    static testMethod void testGetBoatsWithId() {
        // (Integer numBoatTypes, Integer numContacts, Integer boatsPerContact)
        List<List<sObject>> objects = TestDataFactory.createBoats(3, 4, 2); 
        // get the Id of the first boat type
        String boatTypeId = objects[0][0].Id;
        Integer expectedBoats = 3;
        List<Boat__c> queriedBoats;
        Test.startTest();
        queriedBoats = BoatSearchResults.getBoats(boatTypeId);
        Test.stopTest();
        System.assertEquals(expectedBoats, queriedBoats.size(), 'Did not return the expected number of boats');
        System.assertEquals(boatTypeId, queriedBoats[0].BoatType__c, 'Did not have the expected BoatType ID');

    }
}