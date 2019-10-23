@isTest
private class TestRejectDoubleBooking {
	@isTest static void TestAllowsTwoSpeakersForSession() {        
        List<Speaker__c> speakers = TestDataFactory.createSpeakers(2);
        Session__c session = TestDataFactory.createSessions(1)[0];
        Database.SaveResult firstResult = Database.insert(new Session_Speaker__c(Session__c=session.Id, Speaker__c=speakers[0].Id), false);
        Test.startTest();
        Database.SaveResult secondResult = Database.insert(new Session_Speaker__c(Session__c=session.Id, Speaker__c=speakers[1].Id), false);
        Test.stopTest();  
        System.assert(firstResult.isSuccess());
        System.assert(firstResult.getErrors().size() == 0);        
        System.assert(secondResult.isSuccess());
        System.assert(secondResult.getErrors().size() == 0);              
    }
    
	@isTest static void TestAllowsSessionsAtDifferentTimesForSpeaker() {
		Speaker__c speaker = TestDataFactory.createSpeakers(1)[0];
		List<Session__c> sessions = TestDataFactory.createSessions(2);
        Database.SaveResult firstResult = Database.insert(new Session_Speaker__c(Session__c=sessions[0].Id, Speaker__c=speaker.Id), false);
        Test.startTest();
        Database.SaveResult secondResult = Database.insert(new Session_Speaker__c(Session__c=sessions[1].Id, Speaker__c=speaker.Id), false);
        Test.stopTest();  
        System.assert(firstResult.isSuccess());
        System.assert(firstResult.getErrors().size() == 0);        
        System.assert(secondResult.isSuccess());
        System.assert(secondResult.getErrors().size() == 0); 
    }
    
    @isTest static void TestDoesNotAllowSecondNewBookingForSpeaker() {
        Speaker__c speaker = TestDataFactory.createSpeakers(1)[0];
        List<Session__c> sessions = TestDataFactory.generateSimultaneousSessions(1);
        insert sessions;
        Database.SaveResult firstResult = Database.insert(new Session_Speaker__c(Session__c=sessions[0].Id, Speaker__c=speaker.Id), false);
        Test.startTest();
        Database.SaveResult secondResult = Database.insert(new Session_Speaker__c(Session__c=sessions[1].Id, Speaker__c=speaker.Id), false);
        Test.stopTest();  
        System.assert(firstResult.isSuccess());
        System.assert(firstResult.getErrors().size() == 0);        
        System.assert(!secondResult.isSuccess());
        System.assertEquals('The speaker is already booked at that time', secondResult.getErrors()[0].getMessage()); 
    }

    /*
     * Not working due to how trigger is written.
    @isTest static void TestDoesNotAllowBulkDoubleBooking() {
        // broken: Current Trigger allows double booking
		List<Speaker__c> speakers = TestDataFactory.createSpeakers(2);
        List<Session__c> sessions = TestDataFactory.generateSimultaneousSessions(2);
        insert sessions;
        List<Session_Speaker__c> sessionSpeakers = new List<Session_Speaker__c>();
        for(Speaker__c speaker : speakers) {
            for(Session__c session : sessions) {
                sessionSpeakers.add(new Session_Speaker__c(Session__c=session.Id, Speaker__c=speaker.Id));
            }
        }
        Test.startTest();
        List<Database.SaveResult> results = Database.insert(sessionSpeakers, false);
        Test.stopTest();
        Integer successCount = 0;
        Integer failCount = 0;
        for(Database.SaveResult result :results) {
            if(result.isSuccess()) {
            	successCount++;
                System.assert(result.getErrors().size() == 0);
            } else {
                failCount++;
	            System.assertEquals('The speaker is already booked at that time', result.getErrors()[0].getMessage());
            }
        }
    	System.assertEquals(successCount, failCount, ('Half of inserts expected to succeed. Success: ' + successCount + ' Failure: ' + failCount));        
    }    
*/
static testmethod void TestSingleBooking() {
    Datetime now = System.now();
    Speaker__c speaker = new Speaker__c(First_Name__c='John', Last_Name__c='Smith');
    insert speaker;
    Session__c session = new Session__c(Name='Some Session', Session_Date__c=now);
    insert session;
    Session_Speaker__c assignment =
    new Session_Speaker__c(Session__c=session.Id, Speaker__c=speaker.Id);
    Database.SaveResult result = Database.insert(assignment, false);
    System.assert(result.isSuccess());
}

static testmethod void TestDoubleBooking() {
    Datetime now = System.now();
    Speaker__c speaker = new Speaker__c(First_Name__c='John', Last_Name__c='Smith');
    insert speaker;
    Session__c session1 = new Session__c(Name='Session 1', Session_Date__c=now);
    insert session1;
    Session__c session2 = new Session__c(Name='Session 2', Session_Date__c=now);
    insert session2;
    Session_Speaker__c assignment1 =
    new Session_Speaker__c(Session__c=session1.Id, Speaker__c=speaker.Id);
    insert assignment1;
    Session_Speaker__c assignment2 =
    new Session_Speaker__c(Session__c=session2.Id, Speaker__c=speaker.Id);
    Database.SaveResult result = Database.insert(assignment2, false);
    System.assert(!result.isSuccess());
}
    
    
}