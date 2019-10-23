public class TemperatureConverter {
    // Takes a Fahrenheit temperature and returns the Celsius equivalent.
    public static Decimal FahrenheitToCelsius(Decimal fh) {
        try {
        Decimal cs = (fh - 32) * 5/9;
        return cs.setScale(2);
        } catch (System.NullPointerException e) {
            return null;
        }
    }
}