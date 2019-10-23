trigger HelloWorldTrigger on Account (before insert) {
    for(Account a : Trigger.new) {
        a.Description = 'New description';        
    }
    System.debug('Hello World from Account before insert trigger!');
}