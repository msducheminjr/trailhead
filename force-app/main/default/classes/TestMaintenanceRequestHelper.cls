@isTest
private class TestMaintenanceRequestHelper {
	@isTest static void TestDetermineDueDateValid() {
		Case c = TestDataFactory.maintenanceRequestTriggerPositive('Repair');
		List<Case> cases = new List<Case>();
		cases.add(c);
		c = MaintenanceRequestHelper.relatedObjectsQuery(cases)[0];
		Test.startTest();
		Date targetDate = MaintenanceRequestHelper.determineDueDate(c);
		Test.stopTest();
		System.assertEquals(System.today().addDays(90), targetDate, 
		'Target date should match the lowest Product2.Maintenance_Cycle__c (Equipment) associated with case.');
	}
	
	@isTest static void TestDetermineDueDateInvalid() {
		Case c = new Case();
		Test.startTest();
		Date targetDate = MaintenanceRequestHelper.determineDueDate(c);
		Test.stopTest();
		System.assertEquals(null, targetDate, 
		'Should return null if no related data.');
	}	
	
}