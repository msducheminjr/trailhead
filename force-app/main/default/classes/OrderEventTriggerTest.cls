@isTest
public class OrderEventTriggerTest {
    @isTest static void testSingle() {
        String orderNum = '0000000001';
        Order_Event__e orderEvent = new Order_Event__e(Order_Number__c=orderNum, Has_Shipped__c=true);

        Test.startTest();
        // Call method to publish events
        Database.SaveResult sr = EventBus.publish(orderEvent);
        
        Test.stopTest();

        // Perform validation here
        // Verify that the publish was successful
        System.assertEquals(true, sr.isSuccess());
        // Check that the case that the trigger created is present.
        List<Task> tasks = [SELECT Id, Priority, Subject FROM Task];
        // Validate that this case was found.
        // There is only one test case in test context.
        System.assertEquals(1, tasks.size());
		System.assertEquals('Medium', tasks[0].Priority, 'Priority should be medium');
        System.assertEquals('Follow up on shipped order ' + orderNum, tasks[0].Subject, 'Subject should contain order number');
    }
}