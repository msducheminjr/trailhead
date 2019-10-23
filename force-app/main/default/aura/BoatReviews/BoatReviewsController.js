({
	doInit : function(component, event, helper) {
		// get boatTypes from Apex controller
        helper.onInit(component);
	},
    
    onUserInfoClick : function(component, event, helper) {
        var sObjectId = event.currentTarget.dataset.userid;
        var navEvt = $A.get("e.force:navigateToSObject");
        if (navEvt && sObjectId) {
            navEvt.setParams({"recordId": sObjectId});
            navEvt.fire();
        } else {
            alert('Navigating to user not supported')
        }
    }
})