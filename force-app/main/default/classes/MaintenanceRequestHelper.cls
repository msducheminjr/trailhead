public class MaintenanceRequestHelper {
    
    public static void updateWorkOrders(List<Case> triggerCases){
        // determine if they meet the logic
        
        // get related query fields
        List<Case> needsNewRequest = new List<Case>();
        triggerCases = MaintenanceRequestHelper.relatedObjectsQuery(triggerCases);
        for (Case c : triggerCases) {
        	if ((c.Type == 'Repair' || c.Type == 'Routine Maintenance') && c.Status == 'Closed') {
        		needsNewRequest.add(c);
        	} 
        }		

        // assemble the new sObjects
		List<Case> newCases = MaintenanceRequestHelper.assembleNewCases(needsNewRequest);
		insert newCases;
		
		// assign all new work parts to cases
		List<Work_Part__c> newWorkParts = MaintenanceRequestHelper.assembleNewWorkParts(needsNewRequest, newCases);
		
		insert newWorkParts; 	          
    }            

	public static List<Case> relatedObjectsQuery(List<Case> cases) {
		return [SELECT Case.Id, Case.CaseNumber, Case.Date_Due__c, Case.Date_Reported__c, 
			Case.Subject, Case.Type, Case.Vehicle__c, Case.ContactId, Case.AccountId, Case.Equipment__c, Case.Status,
				(SELECT Id, Equipment__c, Equipment__r.Name, Equipment__r.Current_Inventory__c, 
				Equipment__r.Cost__c, Equipment__r.Lifespan_Months__c, 
				Equipment__r.Maintenance_Cycle__c 
			FROM Case.Work_Parts__r) FROM Case WHERE Id IN :cases];
	}

	public static List<Case> assembleNewCases(List<Case> cases) {
		// get all needed related records
		List<Case> newCases = new List<Case>();
		for (Case c : cases) {	
			Date dueDate = MaintenanceRequestHelper.determineDueDate(c);
			// remove check for null and allow creation with null date
			newCases.add(MaintenanceRequestHelper.generateFollowUpMaint(c, dueDate));
//			if (dueDate != null) {
//				newCases.add(MaintenanceRequestHelper.generateFollowUpMaint(c, dueDate));				
//			}
		}
		return newCases;
	}

	public static Date determineDueDate(Case c) {
		// set date WAY out in the future to compare against
		Decimal shortestInterval = 100000;
		for (Work_Part__c wp : c.Work_Parts__r) {
			if(wp.Equipment__r.Maintenance_Cycle__c < shortestInterval) {
				shortestInterval = wp.Equipment__r.Maintenance_Cycle__c;
			}
		}
		
		if (shortestInterval == 100000) {
			return null;
		}
		return System.today().addDays(shortestInterval.intValue());
	}
	
	public static Case generateFollowUpMaint(Case c, Date dateDue) {
		String newSubject = 'Routine Maintenance created from ' + c.CaseNumber;
		Case newCase = new Case(Type='Routine Maintenance', Status='New', Origin='Web', Vehicle__c=c.Vehicle__c, 
			ParentId=c.Id, Date_Reported__c=System.today(), Date_Due__c=dateDue, 
			Subject=newSubject, Equipment__c=c.Equipment__c, ContactId=c.ContactId,
			AccountId=c.AccountId);
		
		return newCase;
	}

	public static List<Work_Part__c> assembleNewWorkParts(List<Case> oldCases, List<Case> newCases) {
		List<Work_Part__c> newParts = new List<Work_Part__c>();
		for (Work_Part__c wp : [SELECT Id, Equipment__c, Maintenance_Request__c, Quantity__c FROM Work_Part__c 
								WHERE Maintenance_Request__c IN :oldCases]) {
			Work_Part__c newWorkPart = new Work_Part__c(Equipment__c=wp.Equipment__c,  
			Quantity__c=wp.Quantity__c);
			newWorkPart.Maintenance_Request__c = MaintenanceRequestHelper.getNewParentCase(newCases, wp.Maintenance_Request__c);
			newParts.add(newWorkPart);
		}

/*
		for (Case newCase : newCases) {
			Case oldCase = MaintenanceRequestHelper.findMatchingParentCase(newCase, oldCases);
			if (oldCase != null) {
				List<Work_Part__c> tempWorkParts = MaintenanceRequestHelper.generateRelatedWorkParts(oldCase, newCase);
				for (Work_Part__c wp : tempWorkParts) {
					newParts.add(wp);
				}
			}
		}
*/
		return newParts;
	}

	public static Id getNewParentCase(List<Case> newCaseCollection, Id oldParentId) {
		Id newId = null;
		for (Case c : newCaseCollection) {
			if (c.ParentId == oldParentId) {
				newId = c.Id;
				break;
			}	
		}
		return newId;
	}

/*
	public static List<Work_Part__c> generateRelatedWorkParts(Case oldCase, Case newCase) {
		List<Work_Part__c> workParts = new List<Work_Part__c>();
		for (Work_Part__c wp : oldCase.Work_Parts__r) {
			workParts.add(new Work_Part__c(Equipment__c=wp.Equipment__c, Maintenance_Request__c=newCase.Id, Quantity__c=wp.Quantity__c));	
		}
		return workParts;
	}


	public static Case findMatchingParentCase(Case targetCase, List<Case> caseCollection) {
		for (Case c : caseCollection) {
			if (c.Id == targetCase.ParentId) {
				return c;
			}
		}
		return null;
	}
*/	
}