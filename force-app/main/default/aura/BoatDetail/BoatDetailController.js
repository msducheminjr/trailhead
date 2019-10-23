({
	onFullDetails : function(component, event, helper) {
		var navEvent = $A.get("e.force:navigateToSObject");        
        navEvent.setParams({"recordId": component.get('v.boat').Id});
        navEvent.fire();
	},
    
    doInit : function(component, event, helper) {
        // determine whether to show newBoatButtonContainer
        helper.determineDetailsButtonStatus(component);
    }
})