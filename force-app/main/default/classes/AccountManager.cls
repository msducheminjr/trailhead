@RestResource(urlMapping='/Accounts/*/contacts')
global with sharing class AccountManager {
    @HttpGet
    global static Account getAccount() {
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        List<String> urlparts = request.requestURI.split('/');
        Boolean nextStr = false;
        String accountId;
        for (String urlpart : urlparts) {
            if (urlpart == 'Accounts') {
                nextStr = true;    
            } 
            else if (nextStr == true) {
                accountId = urlpart;
                break;
            }
        }
        Account result =  [SELECT Id, Name, (SELECT Id, Name FROM Contacts)
                        FROM Account
                        WHERE Id = :accountId];
        return result;
    }
}