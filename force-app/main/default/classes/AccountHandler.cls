public class AccountHandler {
    public static Account insertNewAccount(String acctName) {
        Account acct = new Account(Name=acctName);
        try {
            insert acct;
            System.debug('Successfully inserted account: ' + acct.Name + ' ID: ' + acct.Id);
            return acct;
        } catch (DmlException e) {
            System.debug('A DML exception has occurred: ' + e.getMessage());
            return null;
        }
    }
}