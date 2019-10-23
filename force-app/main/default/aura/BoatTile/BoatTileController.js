({
	onBoatClick : function(component, event, helper) {
        helper.fireBoatSelect(component);
        // helper.fireBoatSelected(component);
        var selectedEvent = $A.get("e.c:BoatSelected");
        var boat = component.get('v.boat');
        selectedEvent.setParams({"boat": boat});
        var plotEvent = $A.get("e.c:PlotMapMarker");
        plotEvent.setParams(
            {
                "sObjectId" : boat.Id,
                "lat" : boat.Geolocation__Latitude__s,
                "long" : boat.Geolocation__Longitude__s,
                "label" : boat.Name
            });
        selectedEvent.fire();
        plotEvent.fire();
    }
})