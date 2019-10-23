trigger ClosedOpportunityTrigger on Opportunity (after insert, after update) {
	List<Task> taskList = new List<Task>();
    for (Opportunity opp : [SELECT Id FROM Opportunity WHERE Id IN :Trigger.new AND StageName = 'Closed Won']) {
     	taskList.add(new Task(Subject='Follow Up Test Task',WhatId=opp.Id));   
    }

    if (taskList.size() > 0) {
        insert taskList;
    }    
}