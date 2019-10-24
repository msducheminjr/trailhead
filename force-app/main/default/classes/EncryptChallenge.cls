public class EncryptChallenge {
     public String paramValue{get;set;}
     public String pitemId{get;set;}    
     public String pitemName{get;set;}
     public Id recordId{get;set;}
     
     String testing;
     public List<EnCrypt_DecryptC__c> deals;
     public EnCrypt_DecryptC__c encrypt{get;set;}
     public List<EnCrypt_DecryptC__c> Messages {get;set;}
 
     Blob cryptoKey = Blob.valueOf([SELECT bkey__c FROM secretkey__mdt].bkey__c);
     
     
     public EncryptChallenge(ApexPages.StandardController controller) {
         if (Schema.sObjectType.EnCrypt_DecryptC__c.fields.Name.isAccessible()){
        getMessages();
          
         
    
        recordId = Apexpages.CurrentPage().getParameters().get('id');
        if(recordId !=null){
            encrypt = [SELECT Name From EnCrypt_DecryptC__c WHERE id=:recordId];
        }
        else{
            encrypt = new EnCrypt_DecryptC__c();
        }
         }
    }
     
     public PageReference DeleteMe(){
         if (!EnCrypt_DecryptC__c.sObjectType.getDescribe().isDeletable()){

        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.FATAL, 'Insufficient access'));

        return null;
      }

         
        if(pitemId != ''){
            deals  = [select Id, Name from EnCrypt_DecryptC__c where id =:pitemId];
        }
   
     if(deals.size() > 0 ){ delete deals; }
       getMessages();
       return null; 
     }
    
   
       public PageReference DecryptMe(){
             
           try{
                 if(pitemName != NULL && pitemName != ''){
         
         //Fix me here
 
         paramValue = pitemName;
          }
      
          
          
       
                } catch (Exception e){
                ApexPages.Message myMsg = new ApexPages.Message(ApexPages.Severity.FATAL,'Handling an error!');
                    ApexPages.addMessage(myMsg);
                }
           
           
       return null;    
    }
    
    
    public List<EnCrypt_DecryptC__c> getMessages() {
         if (!Schema.sObjectType.EnCrypt_DecryptC__c.fields.Name.isAccessible()){

                    return NULL;

        }
        Messages =  [select Id, Name from EnCrypt_DecryptC__c ORDER BY LastModifiedDate DESC NULLS FIRST];
        return Messages;
    }
    
    
    
    
     public PageReference Save(){
         
        try{
                 if(pitemName != NULL && pitemName != ''){
                     if(encrypt.Name.length() < 80) {
                         
                         //Add code here
                         
                         insert encrypt;
                         encrypt.id = null;
                          getMessages();
                         }
         }
          
       
                } catch (Exception e){
                ApexPages.Message myMsg = new ApexPages.Message(ApexPages.Severity.FATAL,'String empty or handling an error!');
                    ApexPages.addMessage(myMsg);
                }
         return null; 
     }



}