/*
    Domain trigger uses fflib and Accounts domain class.
    For Apex Enterprise Patterns: Domain & Selector Layers module
    Requires FFLib Apex Common to work
    https://github.com/apex-enterprise-patterns/fflib-apex-common
*/
trigger AccountsTrigger on Account (
  before insert,
  before update,
  before delete,
  after insert,
  after update,
  after delete,
  after undelete
  ) {
    fflib_SObjectDomain.triggerHandler(Accounts.class);
}
