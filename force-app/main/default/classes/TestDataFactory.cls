@isTest
public class TestDataFactory {

    public static List<Speaker__c> createSpeakers(Integer numSpeakers) {
        List<Speaker__c> speakers = new List<Speaker__c>();
        for(Integer i=0; i<numSpeakers;i++) {
            speakers.add(generateSpeaker(i));
        }
        insert speakers;
        return speakers;
    }


    public static List<Session__c> createSessions(Integer numSessions) {
        List<Session__c> sessions = new List<Session__c>();
        for(Integer i=0; i<numSessions;i++) {
			sessions.add(generateSession(i));
        }
        insert sessions;
        return sessions;
    }

    public static List<Session_Speaker__c> createSessionsSpeakers(Integer numSessions, Integer speakersPerSession) {
        List<Session_Speaker__c> speakerSessions = new List<Session_Speaker__c>();
        List<Session__c> sessions = new List<Session__c>();
        List<Speaker__c> speakers = new List<Speaker__c>();
        for(Integer i=0;i<speakersPerSession;i++) {
			speakers.add(generateSpeaker(i));
        }

        for(Integer i=0; i<numSessions;i++) {
			sessions.add(generateSession(i));
            for(Integer j=0;j<speakersPerSession;j++) {
                speakerSessions.add(new Session_Speaker__c(Session__c=sessions[i].Id,Speaker__c=speakers[j].Id));
            }
        }
		insert speakers;
		insert sessions;
		insert speakerSessions;
        return speakerSessions;
    }

    public static List<List<sObject>> createUnassignedSessionsAndSpeakers(Integer numSpeakers, Integer numSessions) {
        List<Speaker__c> speakers = new List<Speaker__c>();
		List<Session__c> sessions = new List<Session__c>();
        List<List<sObject>> multiDimList = new List<List<sObject>>();

        for(Integer i=0; i<numSpeakers;i++) {
            speakers.add(generateSpeaker(i));
        }
        insert speakers;

        for(Integer i=0; i<numSessions;i++) {
			sessions.add(generateSession(i));
        }
		insert sessions;

        multiDimList.add(speakers);
        multiDimList.add(sessions);
        return multiDimList;
    }

    public static Speaker__c generateSpeakerWithEmail(Integer i) {
        Speaker__c speaker = generateSpeaker(i);
        speaker.Email__c = 'email'+i+'@example.com';
        return speaker;
    }

    public static Speaker__c generateSpeaker(Integer i) {
        return new Speaker__c(First_Name__c=('First'+i),Last_Name__c=('Last'+i), Email__c=('email'+i+'@example.com'));
    }

    public static Session__c generateSession(Integer i) {
        DateTime baseDate = Datetime.now();
		return new Session__c(Session_Date__c=baseDate.addDays(i), Name=('Session '+i), Level__c='Beginner');
    }

    public static List<Session__c> generateSimultaneousSessions(Integer numSets) {
        List<Session__c> sessions = new List<Session__c>();
        for(Integer i = 0;i<numSets;i++) {
            Session__c firstSession = generateSession(i);
            Session__c secondSession = new Session__c(Session_Date__c=firstSession.Session_Date__c, Name=('OtherSession'+i), Level__c='Intermediate');
            sessions.add(firstSession);
            sessions.add(secondSession);
        }
        return sessions;
    }

    public static List<Account> createAccountsWithOpps(Integer numAccts, Integer numOppsPerAcct) {
        List<Account> accts = new List<Account>();
        
        for(Integer i=0;i<numAccts;i++) {
            Account a = new Account(Name='TestAccount' + i);
            accts.add(a);
        }
        insert accts;
        
        List<Opportunity> opps = new List<Opportunity>();
        for (Integer j=0;j<numAccts;j++) {
            Account acct = accts[j];
            // For each account just inserted, add opportunities
            for (Integer k=0;k<numOppsPerAcct;k++) {
                opps.add(new Opportunity(Name=acct.Name + ' Opportunity ' + k,
                                       StageName='Prospecting',
                                       CloseDate=System.today().addMonths(1),
                                       AccountId=acct.Id));
            }
        }
        // Insert all opportunities for all accounts.
        insert opps;
        
        return accts;
    }

    public static List<Account> createAccountsWithContacts(Integer numAccts, Integer numContactsPerAcct) {
        List<Account> accts = new List<Account>();

        for(Integer i=0;i<numAccts;i++) {
            Account a = new Account(Name='TestAccount' + i);
            accts.add(a);
        }
        insert accts;

        List<Contact> contacts = new List<Contact>();
        for (Integer j=0;j<numAccts;j++) {
            Account acct = accts[j];
            // For each account just inserted, add opportunities
            for (Integer k=0;k<numContactsPerAcct;k++) {
                contacts.add(new Contact(FirstName='First' + k,
                                       LastName='Last' + k,
                                       AccountId=acct.Id));
            }
        }
        // Insert all opportunities for all accounts.
        insert contacts;

        return accts;
    }

}