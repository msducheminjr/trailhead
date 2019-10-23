@isTest
private class AnimalLocatorTest {
    @isTest static  void testGetAnimalNameById() {
        Test.setMock(HttpCalloutMock.class, new AnimalLocatorMock());
        // Call method to test
        String result = AnimalLocator.getAnimalNameById(1);
        System.assertEquals('chicken', result, 'Did not return expected animal name.');
    }  

}