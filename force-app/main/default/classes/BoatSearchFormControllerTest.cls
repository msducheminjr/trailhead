@isTest
public class BoatSearchFormControllerTest {
    static testMethod void testGetAllBoatTypes() {
        List<BoatType__c> boatTypes = TestDataFactory.createBoatTypes(10);
        List<BoatType__c> cBoatTypes;
        Test.startTest();
        cBoatTypes = BoatSearchFormController.getAllBoatTypes();
        Test.stopTest();
        System.assertEquals(10, cBoatTypes.size(), 'Expected 10 records returned');
        for(Integer i=0; i<10;i++) {
            System.assertEquals(boatTypes[i].Name, cBoatTypes[i].Name, 'Name should match expectation list');
            System.assertEquals(boatTypes[i].Id, cBoatTypes[i].Id, 'Id should match expectation list');
        }
    }
}