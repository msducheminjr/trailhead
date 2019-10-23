global class RemindOpptyOwners implements Schedulable {
    global void execute(SchedulableContext ctx) {
        List<Opportunity> opptys = [SELECT Id, Name, OwnerId, CloseDate 
            FROM Opportunity 
            WHERE IsClosed = False AND 
            CloseDate < TODAY];
        // Create a task for each opportunity in the list
        // TaskUtils does not exist. Commenting out
        // TaskUtils.remindOwners(opptys);
        // Add workaround https://developer.salesforce.com/forums/?id=906F0000000kDjfIAE
    List<Task> taskList = new List<Task>();
    For(Opportunity opp : opptys) {
      Task newTask = new Task(
           WhatId = opp.Id,
           OwnerId = opp.OwnerId,
           ActivityDate = Date.today(),
          Subject = 'Update Opportunity',
           Description = 'Kindly close the ticket by the end of the day');
        taskList.add(newTask);
        }
        insert taskList;
    }        
}