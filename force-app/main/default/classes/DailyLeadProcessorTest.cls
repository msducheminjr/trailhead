@isTest
private class DailyLeadProcessorTest {
    // Dummy CRON expression: midnight on March 15.
    // Because this is a test, job executes
    // immediately after Test.stopTest().
    public static String CRON_EXP = '0 0 0 15 3 ? 2022';
    static testmethod void testScheduledJob() {
		// Create some Lead records with blank lead sources
		List<Lead> leads = new List<Lead>();
        for (Integer i = 0; i < 200; i++) {
            leads.add(new Lead(FirstName='First' + i, LastName='Last' + i, Company='Company' + i, MobilePhone='6175550001'));
        }
        insert leads;
        // Get the IDs of the leads we just inserted
        Map<Id, Lead> leadMap = new Map<Id, Lead>(leads);
        List<Id> leadIds = new List<Id>(leadMap.keySet());
        Test.startTest();
        // Schedule the test job
        String jobId = System.schedule('ScheduledApexTest',
            CRON_EXP, 
            new DailyLeadProcessor());         
        Test.stopTest();
        // Now that the scheduled job has executed,
        // check that the Leads were updated
		List<Lead> leadsAfter = [SELECT Id, LeadSource FROM Lead WHERE Id IN :leadIds AND LeadSource = 'DreamForce'];
        System.assertEquals(200, leadsAfter.size(), 'Expected updates to LeadSource did not take place.');
    }
}