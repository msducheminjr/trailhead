public class ContactSearch {
    public static List<Contact> searchForContacts(String LName, String Zip) {
        Contact[] cts = [SELECT Id,FirstName,LastName FROM Contact WHERE (LastName = :LName AND MailingPostalCode = :Zip)];
        return cts;
    }
}