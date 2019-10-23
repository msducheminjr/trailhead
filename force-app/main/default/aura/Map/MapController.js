({
    jsLoaded: function(component) {
        component.set("v.jsLoaded", true);
    },
    
    onPlotMapMarker : function(component, event, helper) {
        // TODO: Not actually rendering the location. Lat and long are not showing up on location
        var lat = event.getParam("lat");
        var long = event.getParam("long");
        console.log('lat: ' + lat + ' long: ' + long);
        var label = event.getParam("label");
        var sId = event.getParam("sObjectId");        
        component.set('v.location', {
            'Id' : sId,
            'Name' : label,            
            'lat' : lat,
            'long' : long,            
        });
    }
})