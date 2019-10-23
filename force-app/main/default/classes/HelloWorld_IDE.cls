public class HelloWorld_IDE {
    // This method updates the Description field for a list of Accounts
    public static void addHelloWorld(Account[] accs) {
    	for (Account a : accs) {
    		a.Description = 'Hello World';
    	}
    	// not persisted
    }
}