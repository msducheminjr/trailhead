public class ParkLocator {
    public static String[] country(String countryName) {
        ParkService.ParksImplPort parkSvc = new ParkService.ParksImplPort();  
        return parkSvc.byCountry(countryName);
    }
}