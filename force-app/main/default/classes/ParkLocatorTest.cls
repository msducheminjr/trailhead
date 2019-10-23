@isTest
private class ParkLocatorTest {
    @isTest static void testCallout() {              
        // This causes a fake response to be generated
        Test.setMock(WebServiceMock.class, new ParkServiceMock());
        // Call the method that invokes a callout
        String countryName = 'India';
        List<String> results = ParkLocator.country(countryName);
        // Verify that a fake result is returned
        System.assertEquals(3, results.size(), 'Expected array of Strings with 3 elements');
        System.assertEquals('Anamudi Shola National Park', results[0], 'Unexpected first element.');
        System.assertEquals('Anshi National Park', results[1], 'Unexpected second element.');
        System.assertEquals('Bandipur National Park', results[2], 'Unexpected third element.');        
    }
}