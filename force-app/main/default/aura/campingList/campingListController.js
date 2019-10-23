({
    doInit: function(component, event, helper) {
        // Create the action
        var action = component.get("c.getItems");
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.items", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    }, 
    handleAddItem: function(component, event, helper) {
        var newItem = event.getParam("item");
        // COMMENT OUT TO PASS THE CHALLENGE
        helper.createItem(component, newItem);
    },
    handleItemTogglePacked: function(component, event, helper) {
        var updatedItem = event.getParam("item");
        helper.updateItem(component, updatedItem);
    }
    
})