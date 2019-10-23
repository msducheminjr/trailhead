trigger OrderEventTrigger on Order_Event__e (after insert) {
	List<Task> tasks = new List<Task>();
    // query to get my user
	User myUser = [SELECT Id FROM User WHERE Name='Michael Duchemin' LIMIT 1];

    // Iterate through each notification.
    for (Order_Event__e event : Trigger.New) {
        if (event.Has_Shipped__c == true) {
            // Create Case to dispatch new team.
            Task tsk = new Task();
            tsk.Priority = 'Medium';
            tsk.Subject = 'Follow up on shipped order ' + event.Order_Number__c;
            tsk.OwnerId = myUser.Id;
            tasks.add(tsk);
        }    
    }
    insert tasks;
}