public class AnimalLocator {
    public static String getAnimalNameById(Integer animalId) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals/' + animalId);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        String animalName;
        // If the request is successful, parse the JSON response.
        if (response.getStatusCode() == 200) {
            // Deserializes the JSON string into collections of primitive data types.
//            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            // Cast the values in the 'animals' key as a list
//            List<Object> animal = (List<Object>) results.get('animal');
			
            // Deserializes the JSON string into collections of primitive data types.
            // Cast the values in the 'animals' key as a list
//            List<Object> animals = (List<Object>) results.get('animals');
//            System.debug('Received the following animals:');
//            for (Object animal: animals) {
//                System.debug(animal);
//            }
			// Object animal = JSON.deserializeUntyped(response.getBody());
            AnimalJSON2Apex animalJSON = AnimalJSON2Apex.parse(response.getBody());
            animalName = animalJSON.animal.name;
        } 
        return animalName;
    }       
}