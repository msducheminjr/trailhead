global class WarehouseCalloutService {

    private static final String WAREHOUSE_URL = 'https://th-superbadge-apex.herokuapp.com/equipment';
    
    // complete this method to make the callout (using @future) to the
    // REST endpoint and update equipment on hand.
    
    @future(callout=true)
    public static void runWarehouseEquipmentAsync(){
    	runWarehouseEquipmentSync();
    }
    
    public static void runWarehouseEquipmentSync(){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(WAREHOUSE_URL);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        if (response.getStatusCode() == 200) {
            // Deserializes the JSON string into collections of primitive data types.
            List<ExternalPart> parts = ExternalPart.parse(response.getBody());
			List<Product2> existingEquip = [SELECT Id, Cost__c, Replacement_Part__c, Current_Inventory__c, Lifespan_Months__c,
			Maintenance_Cycle__c, Warehouse_SKU__c FROM Product2];
			
			List<Product2> currentEquip = new List<Product2>();
			// match list of External parts against Equipment
			for (ExternalPart p : parts) {
				currentEquip.add(findAndUpdateEquipment(p, existingEquip));
			}
			upsert currentEquip;             
        } else {
        	// notify somebody
        }
        
    }
    
    public static Product2 findAndUpdateEquipment(ExternalPart part, List<Product2> equipment) {
    	Product2 equip = new Product2();
    	for (Product2 e : equipment) {
    		if(e.Warehouse_SKU__c == part.Sku) {
    			equip = e;
    			break;
    		}
    	}
    	equip.Cost__c = part.Cost;
    	equip.Replacement_Part__c = part.Replacement;
    	equip.Current_Inventory__c = part.Quantity;
    	equip.Lifespan_Months__c = part.Lifespan;
    	equip.Maintenance_Cycle__c = part.MaintainancePeriod;
    	equip.Warehouse_SKU__c = part.Sku;
    	equip.Name = part.Name;
    	return equip;
    }

}