@isTest
private class TestEmailManager {
    @isTest static void singleEmailTest() {
		String[]  addresses = new String[]{'user@example.com'},
        		  subjects = new String[]{'My subject'},
          		  messages = new String[]{'My message'};
        Test.startTest();
        EmailManager.sendMail(addresses, subjects, messages);
        Integer invocations = Limits.getEmailInvocations();
        Test.stopTest(); 
        system.assertEquals(1, invocations, 'An email should be sent');
    }
    
    @isTest static void multiEmailTest() {
		String[]  addresses = new String[]{'user@example.com', 'user2@example.com', 'user3@example.com'},
        		  subjects = new String[]{'My subject', 'My subject', 'My subject'},
          		  messages = new String[]{'My message', 'My message', 'My message'};
        Test.startTest();
        EmailManager.sendMail(addresses, subjects, messages);
        Integer invocations = Limits.getEmailInvocations();
        Test.stopTest();
        system.assertEquals(1, invocations, 'Three emails should be sent but invoked once.');
    }
    
    @isTest static void badArgsEmailTest() {
		String[]  addresses = new String[]{'user@example.com', 'user2@example.com', 'user3@example.com'},
        		  subjects = new String[]{'My subject', 'My subject'},
          		  messages = new String[]{'My message', 'My message'};
        String errMsg;              
        Test.startTest();
        try {
	        EmailManager.sendMail(addresses, subjects, messages);            
        }
        catch(System.ListException e) {
        	errMsg = e.getMessage();
        }
        Test.stopTest();  
        System.assertEquals('List index out of bounds: 2', errMsg, 'System.ListException should have been raised.');
    }
}