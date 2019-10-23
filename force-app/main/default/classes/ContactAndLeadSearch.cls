public class ContactAndLeadSearch {
    public static List<List<sObject>> searchContactsAndLeads (String searchTerm) {
        List<List<sObject>> searchResult = [FIND :searchTerm IN NAME FIELDS Returning Contact(FirstName, LastName), Lead(FirstName, LastName)];
        return searchResult;
    }
}