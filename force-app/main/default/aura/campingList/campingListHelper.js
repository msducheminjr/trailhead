({
    createItem: function(component, item) {
        this.saveItem(component, item, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var items = component.get("v.items");
                items.shift(response.getReturnValue());
                component.set("v.items", items);
            }
        });
    },
    updateItem: function(component, item) {
        this.saveItem(component, item);
    },
    saveItem: function(component, item, callback) {
        var action = component.get("c.saveItem");
        action.setParams({
            "item": item
        });
        if (callback) {
            action.setCallback(this, callback);
        }
        $A.enqueueAction(action);
    }

/*
    createItem: function(component, campingItem) {
        var action = component.get("c.saveItem");
        action.setParams({
            "item": campingItem
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var items = component.get("v.items");
                items.push(response.getReturnValue());
                component.set("v.items", items);
                // refactor me
				component.set("v.newItem", "v.newItem.default");
            }
        });
        $A.enqueueAction(action);
    }
*/
})