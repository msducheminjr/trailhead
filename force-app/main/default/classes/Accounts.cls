/*
    Domain class uses fflib.
    For Apex Enterprise Patterns: Domain & Selector Layers module
    Requires FFLib Apex Common to work
    https://github.com/apex-enterprise-patterns/fflib-apex-common
*/
public with sharing class Accounts extends fflib_SObjectDomain {
    public static final String ROCK = 'Domain classes rock!';
    public Accounts(List<Account> sObjectList) {
        super(sObjectList);
    }

    public override void onApplyDefaults(){
        for (Account acc : (List<Account>) this.records) {
            acc.Description = ROCK;
        }
    }

    public override void onBeforeUpdate(Map<Id,SObject> existingRecords) {
        for(Account acc : (List<Account>) this.records) {
            acc.AnnualRevenue = ROCK.getLevenshteinDistance(acc.Description);
        }
    }

    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new Accounts(sObjectList);
        }
    }
}
