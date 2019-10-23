public class RandomContactFactory {
    public static List<Contact> generateRandomContacts(Integer numContacts, String conLastName) {
        List<Contact> cons = new List<Contact>();
        for(Integer i=0;i<numContacts;i++) {
            Contact con = new Contact(LastName=conLastName, FirstName='ConArtist' + i);
            cons.add(con);
        }
		return cons;        
    }
}