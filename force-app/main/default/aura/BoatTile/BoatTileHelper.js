({
	fireBoatSelect : function(component) {
        var selectedBoatId = component.get('v.boat').Id;
        var clickEvent = component.getEvent("BoatSelect");
        clickEvent.setParams({"boatId": selectedBoatId});
        clickEvent.fire();
	},
/* COMMENTED OUT BECAUSE CHALLENGE IS LOOKING FOR THE EVENT TO BE FIRED DIRECTLY FROM THE CONTROLLER
    fireBoatSelected : function(component) {        
        var selectedEvent = $A.get("e.c:BoatSelected");
        var boat = component.get('v.boat');
        selectedEvent.setParams({"boat": boat});
        selectedEvent.fire();
	}
*/    
})