({
	onBoatSelected : function(component, event, helper) {
        var evtBoat = event.getParam("boat");
        component.set('v.id', evtBoat.Id);
        component.set('v.boat', evtBoat);
        //var service = component.find("service");
        //component.set('v.recordId', evtBoat.Id);
        //service.reloadRecord();        
	},
    onRecordUpdated : function(component, event, helper) { 
      component.find("reviews").refresh();   
    },
    onBoatReviewAdded : function(component, event, helper) {
        console.log('In the onBoatReviewAdded handler');        
        component.find('boatDetailsTabset').set("v.selectedTabId", 'boatreviewtab');
        component.find("reviews").refresh();
    }
})