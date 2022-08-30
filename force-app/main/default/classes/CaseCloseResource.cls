@RestResource(urlMapping='/case/*/close')
global with sharing class CaseCloseResource {
  // This should really be a PATCH instead of a POST
  @HttpPost
  global static void closeCase(String reason) {
    // Parse context
    RestRequest req = RestContext.request;
    String[] uriParts = req.requestURI.split('/');
    Id caseId = uriParts[2];
    // Call the service
    CaseService.closeCases(
        new Set<Id> { caseId }, reason);
  }
}
