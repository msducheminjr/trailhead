public class ExternalPart {

	public String Id {get;set;}
	public Boolean Replacement {get;set;}
	public Integer Quantity {get;set;}
	public String Name {get;set;}
	public Decimal MaintainancePeriod {get;set;}
	public Integer Lifespan {get;set;}
	public Decimal Cost {get;set;}
	public String Sku {get;set;}

	public ExternalPart(String inputId, Boolean inputReplacement, Integer inputQuantity, String inputName,
		 Integer inputMaintainancePeriod, Integer inputLifespan, Decimal inputCost, String inputSku) {
		Id =  inputId;
		Replacement = inputReplacement;
		Quantity = inputQuantity;
		Name = inputName;
		MaintainancePeriod = inputMaintainancePeriod; 
		Lifespan = inputLifespan; 
		Cost = inputCost; 
		Sku = inputSku;	
	}
	
	public ExternalPart(JSONParser parser) {
		while (parser.nextToken() != System.JSONToken.END_OBJECT) {
			if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
				String text = parser.getText();
				if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
					if (text == '_id') {
						Id = parser.getText();
					} else if (text == 'replacement') {
						Replacement = parser.getBooleanValue();						
					} else if (text == 'quantity') {
						Quantity = parser.getIntegerValue();						
					} else if (text == 'name') {
						Name = parser.getText();						
					} else if (text == 'maintenanceperiod') {
						MaintainancePeriod = parser.getDecimalValue();						
					} else if (text == 'lifespan') {
						Lifespan = parser.getIntegerValue();					
					} else if (text == 'cost') {
						Cost = parser.getDecimalValue();					
					} else if (text == 'sku') {
						Sku = parser.getText();					
					} else {
						System.debug(LoggingLevel.WARN, 'JSON2Apex consuming unrecognized property: '+text);
						consumeObject(parser);
					}
				}
			}
		}
	}
	
	
	public static List<ExternalPart> parse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
		return arrayOfExternalParts(parser);
	}
	
	public static void consumeObject(System.JSONParser parser) {
		Integer depth = 0;
		do {
			System.JSONToken curr = parser.getCurrentToken();
			if (curr == System.JSONToken.START_OBJECT || 
				curr == System.JSONToken.START_ARRAY) {
				depth++;
			} else if (curr == System.JSONToken.END_OBJECT ||
				curr == System.JSONToken.END_ARRAY) {
				depth--;
			}
		} while (depth > 0 && parser.nextToken() != null);
	}

    private static List<ExternalPart> arrayOfExternalParts(System.JSONParser p) {
        List<ExternalPart> res = new List<ExternalPart>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new ExternalPart(p));
        }
        return res;
    }	


}