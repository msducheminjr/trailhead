({
	onFormSubmit : function(component, event, helper) {
		var boatTypeId = event.getParam("formData").boatTypeId;
        component.find("results").search(boatTypeId);
	}
})