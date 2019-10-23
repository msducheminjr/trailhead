public class AddPrimaryContact implements Queueable {

    private Contact contact;
    private String state;
    
    public AddPrimaryContact(Contact con, String stateCode) {
        this.contact = con;
        this.state = stateCode;
    }
    
    
	public void execute(QueueableContext context) {
        List<Contact> primaryContacts = new List<Contact>();
        for (Account account : [SELECT Id, BillingState FROM Account WHERE BillingState = :state LIMIT 200]) {
            Contact primaryContact = contact.clone();
            primaryContact.AccountId = account.Id;
            primaryContacts.add(primaryContact);
        }
        insert primaryContacts;
    }

}