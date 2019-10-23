public class WarehouseCalloutServiceMock implements HttpCalloutMock {
    // Implement this interface method
    public HTTPResponse respond(HTTPRequest request) {
        // Create a fake response
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody(
        '[{"_id":"55d66256726b611100aaf746","replacement":true,"quantity":123,"name":"Fuse 14A","maintenanceperiod":90,' + 
        '"lifespan":3,"cost":10,"sku":"100098"},' + 
        '{"_id":"55d66225626b611100aaf747","replacement":true,"quantity":92,"name":"Ball Valve 11 cm","maintenanceperiod":365,' + 
        '"lifespan":12,"cost":50,"sku":"100099"}]');
        response.setStatusCode(200);
        return response; 
    }
}