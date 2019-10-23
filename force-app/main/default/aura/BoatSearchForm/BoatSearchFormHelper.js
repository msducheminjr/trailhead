({
	getBoatTypes : function(component) {
		var action = component.get("c.getAllBoatTypes");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.boatTypes", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
	},
    determineNewButtonStatus : function(component) {
        var testEvent = $A.get("event.force:createRecord");
        if (testEvent) {
            component.set("v.showNewButton", true);
            
        } else {
            component.set("v.showNewButton", false);
        }
    },
    getSelectedBoatType : function(component) {
        return component.find('boatTypeSelect').get('v.value');
    }
})