@isTest
private class ExternalPartTest {
  
  @isTest
  private static void TestNormalConstructor() {
  	ExternalPart ep = new ExternalPart('101', true, 2, 'MyName',
		 30, 1, 3.50, '100005');	
	System.assertEquals('101', ep.Id);
	System.assertEquals(true, ep.Replacement);
	System.assertEquals(2, ep.Quantity);
	System.assertEquals('MyName', ep.Name);
	System.assertEquals(30, ep.MaintainancePeriod);
	System.assertEquals(1, ep.Lifespan);
	System.assertEquals(3.50, ep.Cost);
	System.assertEquals('100005', ep.Sku);  	
  } 

  @isTest
  private static void Test_JSON_Good() {
  	String jsonStr = '[{"_id":"101","replacement":true,"quantity":2,"name":"MyName","maintenanceperiod":30,"lifespan":1,"cost":3.50,"sku":"100005"}]';
  	// returning list
  	List<ExternalPart> eps = ExternalPart.parse(jsonStr);
  	ExternalPart ep = eps[0];
	System.assertEquals('101', ep.Id);
	System.assertEquals(true, ep.Replacement);
	System.assertEquals(2, ep.Quantity);
	System.assertEquals('MyName', ep.Name);
	System.assertEquals(30, ep.MaintainancePeriod);
	System.assertEquals(1, ep.Lifespan);
	System.assertEquals(3.50, ep.Cost);
	System.assertEquals('100005', ep.Sku);  	
  }
  
  @isTest
  private static void Test_JSON_Bad() {
  	String jsonStr = '[{"_id":"101","fake_attribute":["FAKENESS", "MORE FAKE"],"replacement":true,"quantity":2,"name":"MyName","maintenanceperiod":30,"lifespan":1,"cost":3.50,"sku":"100005"}]';
  	// returning list
  	List<ExternalPart> eps = ExternalPart.parse(jsonStr);
  	ExternalPart ep = eps[0];
	System.assertEquals('101', ep.Id);
	System.assertEquals(true, ep.Replacement);
	System.assertEquals(2, ep.Quantity);
	System.assertEquals('MyName', ep.Name);
	System.assertEquals(30, ep.MaintainancePeriod);
	System.assertEquals(1, ep.Lifespan);
	System.assertEquals(3.50, ep.Cost);
	System.assertEquals('100005', ep.Sku);  	
  }
}