({
    createItem: function(component, newItem) {
        var createEvent = component.getEvent("addItem");
        createEvent.setParams({ "item": newItem });
        createEvent.fire();
        component.set("v.newItem", "v.newItem.default");        
    }
})