({
	onInit : function(component, event, helper) {
        // Prepare a new record from template
        //var boatId = component.get('v.boat').Id;
        //component.set('v.boatReview.Boat__c', boatId);
        component.find("service").getNewRecord(
            "BoatReview__c", // sObject type (entityAPIName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(function() {                
                var rec = component.get("v.boatReview");
                rec.Boat__c = component.get("v.boat").Id;
                var error = component.get("v.recordError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                }
                else {
                    console.log("Record template initialized: " + rec.sobjectType);
                }
            })
        );		
	},
    processSaveResponse : function (component, event, helper, saveResult) {
        var recSaved = false;
        if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
            // record is saved successfully            
            helper.notifySave(component, "The boat review was saved.", "Saved");
            recSaved = true;
        } else if (saveResult.state === "INCOMPLETE") {
            // handle the incomplete state
            helper.setError(component, "User is offline, device doesn't support drafts.");
        } else if (saveResult.state === "ERROR") {
            // handle the error state
            helper.setError(component, 'Problem saving boat review, error: ' + 
                         JSON.stringify(saveResult));
        } else {
            helper.setError(component, 'Unknown problem, state: ' + saveResult.state +
                        ', error: ' + JSON.stringify(saveResult));            
        }
        return recSaved;
    },

    notifySave : function(component, message, title) {
        var resultsToast = $A.get("e.force:showToast");
        if (resultsToast) {
            resultsToast.setParams({
                "title": title,
                "message": message
            });
            resultsToast.fire();
        } else {
            alert(message);
        }
    },
    setError : function(component, errorString) {
            component.set('v.recordError', errorString);
            console.log(errorString);        
    },

    validateReviewForm : function(component) {
        var validReview = true;
         // Show error messages if required fields are blank
        console.log('Before validate name');
        var inputCmp = component.find('title');
        inputCmp.showHelpMessageIfInvalid();
        if (!inputCmp.get('v.validity').valid) {
            validReview = false;
        }
        console.log('Before validate description');
        inputCmp = component.find('comment');
        if (inputCmp.get('v.value').length === 0) {
            validReview = false;
        }
        console.log('After validate description before validate boatReview');
        if (validReview) {            
            // Verify we have an boat review to attach it to
            var boatReview = component.get("v.boatReview");
            if($A.util.isEmpty(boatReview)) {
                validReview = false;
                console.log("Quick action context doesn't have a valid boat review.");
            }
        }
		return(validReview);                    
    }
})