({
	onInit : function(component) {
		var action = component.get("c.getAll");
        action.setParams({boatId: component.get("v.boat").Id});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.boatReviews", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
		
	}
})