trigger ExampleTrigger on Contact (after insert, after delete) {
    if (Trigger.isInsert) {
        Integer recordCount = Trigger.new.size();
        // Call a utility method from another class
        EmailManager.sendMail('michael.duchemin@fmr.com', 'Trailhead Trigger Tutorial', recordCount + ' contact(s) were inserted.\n\nGo to the ExampleTrigger on Contact to find and disable me.');
    }
    else if (Trigger.isDelete) {
        // Process after delete
        
    }
}