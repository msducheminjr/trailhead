trigger MaintenanceRequest on Case (before update, after update) {
  		//List<Case> cases = Trigger.new;
    	//MaintenanceRequestHelper.updateWorkOrders(cases);
	
    // call MaintenanceRequestHelper.updateWorkOrders
  	if(Trigger.isAfter && Trigger.isUpdate) {
  		// run automation of creating follow up MaintenanceRequest
  		List<Case> cases = Trigger.new;
    	MaintenanceRequestHelper.updateWorkOrders(cases);
  	}  
}