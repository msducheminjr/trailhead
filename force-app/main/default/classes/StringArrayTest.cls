public class StringArrayTest {

    public static List<String> generateStringArray(Integer returnQuantity) {
        List<String> generatedResult = new List<String>();
        String generatedString;
        for(Integer i=0; i < returnQuantity; i++) {
            generatedString = 'Test ' + i;
            generatedResult.add(generatedString);
        }
        return generatedResult;
    }
    
}