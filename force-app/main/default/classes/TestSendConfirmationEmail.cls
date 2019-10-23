@isTest
private class TestSendConfirmationEmail {
	@isTest static void TestSendsEmailAfterSingleSessionSpeakerInsert() {
        Session__c session = TestDataFactory.createSessions(1)[0];
        Speaker__c speaker = TestDataFactory.createSpeakers(1)[0];
        Session_Speaker__c sessionSpeaker = new Session_Speaker__c(Speaker__c=speaker.Id, Session__c=session.Id); 
        Test.startTest();
        Database.SaveResult result = Database.insert(sessionSpeaker, false);
        Integer invocations = Limits.getEmailInvocations();
        Test.stopTest(); 
        System.assert(result.isSuccess());
        System.assert(result.getErrors().size() == 0);        
        system.assertEquals(1, invocations, 'An email should be sent');        
    }

	@isTest static void TestSendsEmailAfterMultiSessionSpeakerInsert() {
        List<Session__c> sessions = TestDataFactory.createSessions(3);
        List<Speaker__c> speakers = TestDataFactory.createSpeakers(3);
        List<Session_Speaker__c> sessionSpeakers = new List<Session_Speaker__c>();
        for(Speaker__c speaker : speakers) {
            for(Session__c session: sessions) {
                sessionSpeakers.add(new Session_Speaker__c(Session__c=session.Id, Speaker__c=speaker.Id));
            }
        }
        Test.startTest();
        List<Database.SaveResult> results = Database.insert(sessionSpeakers, false);
        Integer invocations = Limits.getEmailInvocations();
        Test.stopTest(); 
        for(Database.SaveResult result : results) {
	        System.assert(result.isSuccess());
	        System.assert(result.getErrors().size() == 0);
        }
        system.assertEquals(1, invocations, 'An email should be sent');        
    }
    
}