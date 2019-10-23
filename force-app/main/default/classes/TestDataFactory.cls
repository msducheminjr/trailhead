@isTest
public class TestDataFactory {
    public static List<List<sObject>> createBoats(Integer numBoatTypes, Integer numContacts, Integer boatsPerContact) {
        List<List<sObject>> allObjects = new List<List<sObject>>();
        List<BoatType__c> boatTypes = createBoatTypes(numBoatTypes);
        List<Contact> contacts = createContacts(numContacts);
        List<Boat__c> boats = new List<Boat__c>();
        for (Contact c : contacts) {
            // generate boats per contact
            for (Integer i = 0; i < boatsPerContact; i++) {
                boats.add(new Boat__c(Contact__c=c.Id));
            }
        }
        boats = addBoatTypesRotational(boats, boatTypes);
        insert boats;
        allObjects.add(boatTypes);
        allObjects.add(contacts);
        allObjects.add(boats);
        return allObjects;
    }


    public static List<BoatType__c> createBoatTypes(Integer numBoatTypes) {
        List<BoatType__c> boatTypes = generateBoatTypes(numBoatTypes);
        insert boatTypes;
        return boatTypes;
    }

    public static List<BoatType__c> generateBoatTypes(Integer numBoatTypes) {
        List<BoatType__c> boatTypes = new List<BoatType__c>();
        for(Integer i=0; i<numBoatTypes;i++) {
            boatTypes.add(new BoatType__c(Name='Type-'+i));
        }
        return boatTypes;
    }

    public static List<Contact> createContacts(Integer numContacts) {
        List<Contact> contacts = generateContacts(numContacts);
        insert contacts;
        return contacts;
    }

    public static List<Contact> generateContacts(Integer numContacts) {
        List<Contact> contacts = new List<Contact>();
        for(Integer i=0; i<numContacts;i++) {
            contacts.add(new Contact(FirstName='First-'+i, LastName='Last-'+i));
        }
        return contacts;
    }

    public static List<Boat__c> addBoatTypesRotational(List<Boat__c> boats, List<BoatType__c> boatTypes) {
        Integer typesSize = boatTypes.size();
        List<Boat__c> modBoats = new List<Boat__c>();
        for (Integer i = 0; i < boats.size(); i++) {
        	Integer boatTypeIndex = Math.mod(i, typesSize);
            boats[i].BoatType__c = boatTypes[boatTypeIndex].Id;
            modBoats.add(boats[i]);
        }
		return modBoats;
    }
    public static Case maintenanceRequestTriggerPositive(String caseType) {
		return insertCaseStructure(caseType, 'New');
    }

    public static Case maintenanceRequestTriggerNegative() {
		return insertCaseStructure('Other', 'New');
    }

    public static Case insertCaseStructure(String caseType, String caseStatus) {
		// maintenance request of type Repair or Routine Maintenance
		Vehicle__c veh = new Vehicle__c(Name='Vehicle');
		insert veh;

		List<Product2> equipItems = new List<Product2>();
		Product2 shortSpan = new Product2(Name='Wiper', Current_Inventory__c=500, Cost__c=5.99, IsActive=true, Lifespan_Months__c=3, Maintenance_Cycle__c=90, Replacement_Part__c=true);
		Product2 LongSpan = new Product2(Name='Motor', Current_Inventory__c=6, Cost__c=7999.99, IsActive=true, Lifespan_Months__c=240, Maintenance_Cycle__c=1461, Replacement_Part__c=true);
		equipItems.add(shortSpan);
		equipItems.add(longSpan);
		insert equipItems;

		Case mrCase = new Case(Type=caseType, Status=caseStatus, Origin='Web', Vehicle__c=veh.Id);
		insert mrCase;

		List<Work_Part__c> workParts = new List<Work_Part__c>();
		workParts.add(new Work_Part__c(Equipment__c=shortSpan.Id, Maintenance_Request__c=mrCase.Id, Quantity__c=2));
		workParts.add(new Work_Part__c(Equipment__c=longSpan.Id, Maintenance_Request__c=mrCase.Id, Quantity__c=1));
		// two sets of equipment and work parts
		insert workParts;

		return mrCase;

    }

	public static List<Case> setupBulkTesting(Integer numCases) {
		List<Product2> equipItems = new List<Product2>();
		Product2 shortSpan = new Product2(Name='Wiper', Current_Inventory__c=500, Cost__c=5.99, IsActive=true, Lifespan_Months__c=3, Maintenance_Cycle__c=90, Replacement_Part__c=true);
		Product2 LongSpan = new Product2(Name='Motor', Current_Inventory__c=6, Cost__c=7999.99, IsActive=true, Lifespan_Months__c=240, Maintenance_Cycle__c=1461, Replacement_Part__c=true);
		equipItems.add(shortSpan);
		equipItems.add(longSpan);
		insert equipItems;

		List<Vehicle__c> vehicles = new List<Vehicle__c>();
		List<Case> cases = new List<Case>();
		List<Work_Part__c> workParts = new List<Work_Part__c>();

		// iterate through number of for each vehicle
		for(Integer i = 0; i < numCases; i++) {
			vehicles.add(new Vehicle__c(Name=('Vehicle' + i)));
		}

		insertBulkInBatches(vehicles);

		// iterate through number of for each vehicle
		// one third Repair, One Third Routine Maintenance One Third Other
		for(Integer i = 0; i < numCases; i++) {
			string caseType;
			if (Math.mod(i,3) == 0) {
				caseType = 'Repair';
			} else if (Math.mod(i,3) == 1) {
				caseType = 'Routine Maintenance';
			} else {
				caseType = 'Other';
			}
			cases.add(new Case(Type=caseType, Status='New', Origin='Web', Vehicle__c=vehicles[i].Id));
		}

		insertBulkInBatches(cases);

		for (Case c : cases) {
			workParts.add(new Work_Part__c(Equipment__c=shortSpan.Id, Maintenance_Request__c=c.Id, Quantity__c=2));
			workParts.add(new Work_Part__c(Equipment__c=longSpan.Id, Maintenance_Request__c=c.Id, Quantity__c=1));
		}

		insertBulkInBatches(workParts);

		return cases;
	}

	public static void insertBulkInBatches(List<sObject> recs) {
		Integer recSize = recs.size();
		List<sObject> currentBatch = new List<sObject>();
		for (Integer i = 0; i < recSize; i ++) {
			currentBatch.add(recs[i]);
			if(Math.mod(i,200) == 0) {
				insert currentBatch;
				currentBatch = new List<sObject>();
			}
		}

		if(currentBatch.size() > 0) {
			insert currentBatch;
		}
	 }

	 public static Product2 createEquipmentItem(String sku) {
	 	Product2 item = new Product2(Name='Temp', Warehouse_SKU__c=sku);
		insert item;
		return item;
	 }
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