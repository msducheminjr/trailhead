public with sharing class CaseService {
  public static void closeCases(Set<Id> caseIds, String closeReason) {
    // validate at least one ID
    if(caseIds == null || caseIds.size() == 0) {
      throw new CaseServiceException('Case IDs not specified. ');
    }
    // ideally validate close reason is correct before attempting database operation

    // query
    List<Case> cases = [SELECT Id, Reason FROM Case WHERE Id = :caseIds];
    // set attributes on list of records
    for (Case theCase : cases) {
      theCase.Reason = closeReason;
      theCase.Status = 'Closed';
    }

    SavePoint sp = Database.setSavePoint();
    try {
      update cases;
    } catch (Exception e) {
      // Rollback
      Database.rollback(sp);
      // Throw exception to caller
      throw e;
    }
  }

  public class CaseServiceException extends Exception {}
}
