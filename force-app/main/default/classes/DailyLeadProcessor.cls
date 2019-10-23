global class DailyLeadProcessor implements Schedulable {
    global void execute(SchedulableContext ctx) {
		List<Lead> blankLeads = [SELECT Id, LeadSource FROM Lead WHERE LeadSource IN (null, '') LIMIT 200];
        for (Lead l : blankLeads) {
            l.LeadSource = 'DreamForce';
        }
        update blankLeads;
    }        
}