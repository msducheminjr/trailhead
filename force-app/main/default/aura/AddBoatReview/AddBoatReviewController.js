({
	doInit : function(component, event, helper) {
        // Call helper function to prepare a new record from template
        helper.onInit(component, event, helper);        
	},
    onSave : function(component, event, helper) {
        if(helper.validateReviewForm(component)) {            
            component.set("v.boatReview.Boat__c", component.get("v.boat").Id);
            var recordLoader = component.find('service');
            recordLoader.saveRecord($A.getCallback(function(saveResult) {
               var recSaved = helper.processSaveResponse(component, event, helper, saveResult);
               	if (recSaved === true) {
                    helper.onInit(component, event, helper);
                	var createEvent = component.getEvent("BoatReviewAdded");
               		createEvent.fire();
                }
            }));
        }
	},
    onRecordUpdated : function(component, event, helper) {
        helper.notifySave(component, "The boat review has been updated.", "Boat Review Updated");
    }
})