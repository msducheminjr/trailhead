@isTest
private class WarehouseSyncScheduleTest {
    
    static testmethod void testScheduledJob() {
    	final String INSERT_SKU = '100008';
    	final String UPSERT_SKU = '100009';
    // Dummy CRON expression: midnight on March 15.
    // Because this is a test, job executes
    // immediately after Test.stopTest().

    	final String CRON_EXP = '0 0 0 15 3 ? 2022';
        // Create some out of date Opportunity records
        Product2 existingEquipment = TestDataFactory.createEquipmentItem(UPSERT_SKU);
        Test.setMock(HttpCalloutMock.class, new WarehouseCalloutServiceMock());
        // Schedule the test job
        WarehouseSyncSchedule myJob = new WarehouseSyncSchedule();
        Test.startTest();
        String jobId = System.schedule('WarehouseSyncApexTest', CRON_EXP, 
            new WarehouseSyncSchedule());
      // Get the information from the CronTrigger API object
      CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered,
         NextFireTime
         FROM CronTrigger WHERE id = :jobId];
      // Verify the expressions are the same
      System.assertEquals(CRON_EXP, ct.CronExpression);
      // Verify the job has not run
      System.assertEquals(0, ct.TimesTriggered);
      // Verify the next time the job will run
      System.assertEquals('2022-03-15 00:00:00', String.valueOf(ct.NextFireTime));

        // Stopping the test will run the job synchronously
        Test.stopTest();
   }
}