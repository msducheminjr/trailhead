({
    determineDetailsButtonStatus : function(component) {
        var testEvent = $A.get("e.force:navigateToSObject");
        if (testEvent) {
            component.set("v.showDetailsButton", true);
            
        } else {
            component.set("v.showDetailsButton", false);
        }
    }
})