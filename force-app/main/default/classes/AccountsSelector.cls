/*
    Selector class uses fflib.
    For Apex Enterprise Patterns: Domain & Selector Layers module
    Requires FFLib Apex Common to work
    https://github.com/apex-enterprise-patterns/fflib-apex-common
*/
public with sharing class AccountsSelector extends fflib_SObjectSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Account.Name,
            Account.Description,
            Account.AnnualRevenue
        };
    }
    public Schema.SObjectType getSObjectType() {
        return Account.sObjectType;
    }
    public List<Account> selectById(Set<ID> idSet) {
        return (List<Account>) selectSObjectsById(idSet);
    }
}
