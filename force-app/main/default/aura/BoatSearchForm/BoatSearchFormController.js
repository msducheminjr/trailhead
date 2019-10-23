({
	doInit : function(component, event, helper) {
		// determine whether to show newBoatButtonContainer
        helper.determineNewButtonStatus(component);
		// get boatTypes from Apex controller
        helper.getBoatTypes(component);
		 
	},
    addNewBoat : function(component, event, helper) {
        var newBoat = $A.get("event.force:createRecord");
        var selectedBoatType = helper.getSelectedBoatType(component);
        newBoat.setParams({
            "entityApiName" : 'Boat__c',
            "defaultFieldValues" : {
                "BoatType__c" : selectedBoatType
            }
        });
        newBoat.fire();
    },
    onFormSubmit : function(component, event, helper) {
        var selectedBoatType = helper.getSelectedBoatType(component);
        var submitEvent = component.getEvent("formsubmit");
        submitEvent.setParams({
            "formData": {
                "boatTypeId":  selectedBoatType
            }
        });
        submitEvent.fire();
    }
})