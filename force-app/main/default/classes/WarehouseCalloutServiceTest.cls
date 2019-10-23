@isTest
private class WarehouseCalloutServiceTest {
  
  // WarehouseCalloutServiceMock other Assertions also come from mock
  private static final String INSERT_SKU = '100098';
  private static final String UPSERT_SKU = '100099';

  // implement your mock callout test here
  @isTest
  private static void TestRunWarehouseEquipmentAsync() {
  	Product2 existingEquipment = TestDataFactory.createEquipmentItem(UPSERT_SKU);
  	WarehouseCalloutServiceMock myMock = new WarehouseCalloutServiceMock();
  	Test.setMock(HttpCalloutMock.class, myMock);
    Test.startTest();
    WarehouseCalloutService.runWarehouseEquipmentAsync();
    Test.stopTest();
  	existingEquipment = [SELECT Id, Name, Cost__c, Replacement_Part__c, Current_Inventory__c, Lifespan_Months__c,
			Maintenance_Cycle__c, Warehouse_SKU__c FROM Product2 WHERE Id = :existingEquipment.Id];
	Product2 newEquip = [SELECT Id, Name, Cost__c, Replacement_Part__c, Current_Inventory__c, Lifespan_Months__c,
			Maintenance_Cycle__c, Warehouse_SKU__c FROM Product2 WHERE Warehouse_SKU__c = :INSERT_SKU];
	System.assertEquals(50, existingEquipment.Cost__c);
	System.assertEquals(true, existingEquipment.Replacement_Part__c);
	System.assertEquals(92, existingEquipment.Current_Inventory__c);
	System.assertEquals(12, existingEquipment.Lifespan_Months__c);
	System.assertEquals(365, existingEquipment.Maintenance_Cycle__c);
	System.assertEquals(UPSERT_SKU, existingEquipment.Warehouse_SKU__c);
	System.assertEquals('Ball Valve 11 cm', existingEquipment.Name);	
	System.assertEquals(10, newEquip.Cost__c);
	System.assertEquals(true, newEquip.Replacement_Part__c);
	System.assertEquals(123, newEquip.Current_Inventory__c);
	System.assertEquals(3, newEquip.Lifespan_Months__c);
	System.assertEquals(90, newEquip.Maintenance_Cycle__c);
	System.assertEquals(INSERT_SKU, newEquip.Warehouse_SKU__c);
	System.assertEquals('Fuse 14A', newEquip.Name);	
  } 
  
  @isTest
  private static void TestRunWarehouseEquipmentSync() {
  	Product2 existingEquipment = TestDataFactory.createEquipmentItem(UPSERT_SKU);
  	WarehouseCalloutServiceMock myMock = new WarehouseCalloutServiceMock();
  	Test.setMock(HttpCalloutMock.class, myMock);
  	Test.startTest();
    WarehouseCalloutService.runWarehouseEquipmentSync();
    Test.stopTest();
  	existingEquipment = [SELECT Id, Name, Cost__c, Replacement_Part__c, Current_Inventory__c, Lifespan_Months__c,
			Maintenance_Cycle__c, Warehouse_SKU__c FROM Product2 WHERE Id = :existingEquipment.Id];
	Product2 newEquip = [SELECT Id, Name, Cost__c, Replacement_Part__c, Current_Inventory__c, Lifespan_Months__c,
			Maintenance_Cycle__c, Warehouse_SKU__c FROM Product2 WHERE Warehouse_SKU__c = :INSERT_SKU];
	System.assertEquals(50, existingEquipment.Cost__c);
	System.assertEquals(true, existingEquipment.Replacement_Part__c);
	System.assertEquals(92, existingEquipment.Current_Inventory__c);
	System.assertEquals(12, existingEquipment.Lifespan_Months__c);
	System.assertEquals(365, existingEquipment.Maintenance_Cycle__c);
	System.assertEquals(UPSERT_SKU, existingEquipment.Warehouse_SKU__c);
	System.assertEquals('Ball Valve 11 cm', existingEquipment.Name);	
	System.assertEquals(10, newEquip.Cost__c);
	System.assertEquals(true, newEquip.Replacement_Part__c);
	System.assertEquals(123, newEquip.Current_Inventory__c);
	System.assertEquals(3, newEquip.Lifespan_Months__c);
	System.assertEquals(90, newEquip.Maintenance_Cycle__c);
	System.assertEquals(INSERT_SKU, newEquip.Warehouse_SKU__c);
	System.assertEquals('Fuse 14A', newEquip.Name);	
  }
  
    
}