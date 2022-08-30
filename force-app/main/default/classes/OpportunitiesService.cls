public with sharing class OpportunitiesService {
  public static void applyDiscounts(Set<Id> opportunityIds, Decimal discountPercentage) {
    // Unit of Work
    fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(
      new List<SObjectType> { OpportunityLineItem.SObjectType, Opportunity.SObjectType  }
    );
    // Validate parameters
    if(opportunityIds == null || opportunityIds.size() == 0)
      throw new OpportunityServiceException('Opportunities not specified.');
    if(discountPercentage<0 || discountPercentage>100)
      throw new OpportunityServiceException('Invalid discount to apply.');
    // Query Opportunities and Lines (SOQL inlined for this example, see Selector pattern in later module)
    List<Opportunity> opportunities =
      [SELECT Amount, (SELECT UnitPrice FROM OpportunityLineItems)
      FROM Opportunity WHERE Id in :opportunityIds];
    // Update Opportunities and Lines (if present)
    Decimal factor = 1 - (discountPercentage==null ? 0 : discountPercentage / 100);
    for(Opportunity opportunity : opportunities) {
      // Apply to Opportunity Amount
      if(opportunity.OpportunityLineItems!=null && opportunity.OpportunityLineItems.size()>0) {
        for(OpportunityLineItem oppLineItem : opportunity.OpportunityLineItems) {
          oppLineItem.UnitPrice = oppLineItem.UnitPrice * factor;
          uow.registerDirty(oppLineItem);
        }
      } else {
        opportunity.Amount = opportunity.Amount * factor;
        uow.registerDirty(opportunity);
      }
    }
    // Update the database
    uow.commitWork();
  }
  public class OpportunityServiceException extends Exception {}
}
