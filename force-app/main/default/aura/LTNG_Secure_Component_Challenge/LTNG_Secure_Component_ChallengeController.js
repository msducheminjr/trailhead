({
    searchRegionAction : function(component, event, helper) {
        var getRegionAction = component.get("c.getRegionByName");
        getRegionAction.setParams({ regionName : component.find("InputName").get("v.value") });
        getRegionAction.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var region = response.getReturnValue();
                component.set("v.region", region);
                var alphaNum = /^[0-9a-zA-Z]+$/;                             
                // TODO make this safe 
                if (region.Common_Monster__c.match(alphaNum)) {
	                component.set("v.safeCommonMonster",region.Common_Monster__c);
                    console.log('region.Common_Monster__c matches alphanum: ' + region.Common_Monster__c);
                } else {
                    component.set("v.safeCommonMonster",'');
                    console.log('region.Common_Monster__c DOES NOT MATCH alphanum: ' + region.Common_Monster__c);
                }
            }
        });
        $A.enqueueAction(getRegionAction);
	},
    
    getCreaturesForRegionAction : function(component, event, helper) { 
        var getCreaturesAction = component.get("c.getCreaturesForRegion");
        getCreaturesAction.setParams({ regionId : component.get("v.region").Id });
        getCreaturesAction.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var results = response.getReturnValue();
                component.set("v.creatures", results);
            }
        });
        $A.enqueueAction(getCreaturesAction);
	}
})