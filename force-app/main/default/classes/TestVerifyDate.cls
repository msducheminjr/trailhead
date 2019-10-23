@isTest
private class TestVerifyDate {
    @isTest static void testDate2Within30Days() {
        Date expectDate = Date.newInstance(2018, 5, 15);
		Date returnDate = VerifyDate.CheckDates(Date.newInstance(2018, 5, 1), expectDate);
        System.assertEquals(expectDate, returnDate, 'Expected value was not returned');
    }

    @isTest static void testDate2NotWithin30Days() {
        Date expectDate = Date.newInstance(2018, 5, 31);
		Date returnDate = VerifyDate.CheckDates(Date.newInstance(2018, 5, 1), Date.newInstance(2019, 5, 15));
        System.assertEquals(expectDate, returnDate, 'Expected value was not returned');
    }    
    
    @isTest static void testDate2BeforeDate1() {
        Date expectDate = Date.newInstance(2018, 5, 31);
		Date returnDate = VerifyDate.CheckDates(Date.newInstance(2018, 5, 1), Date.newInstance(2017, 5, 15));
        System.assertEquals(expectDate, returnDate, 'Expected value was not returned');
    }
    
    
}