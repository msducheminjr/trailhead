@IsTest
public class UnitOfWorkTest {
  @IsTest
  static void challengeComplete() {
    fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(
      new List<SObjectType> { Account.SObjectType, Contact.SObjectType, Note.SObjectType }
    );
    // setup accounts
    for(Integer i = 0; i < 100; i++) {
      Account acc = new Account(Name = 'UOW Account ' + i);
      uow.registerNew(acc);
      for(Integer j = 0; j < 5; j++) {
        Contact con = new Contact(
          FirstName = 'Contact ' + j,
          LastName = 'Account ' + i,
          Email = 'contact' + j + '@account' + i + '.example.com'
        );
        uow.registerNew(con, Contact.AccountId, acc);
        Note myNote = new Note(
          Title = 'Note ' + i + j,
          Body = 'I am note ' + j + ' for account ' + i
        );
        uow.registerNew(myNote, Note.ParentId, acc);
      }
    }
    Test.startTest();
    // Commit the work to the database!
    uow.commitWork();
    Test.stopTest();
    // challenge assertions
    System.assertEquals(100, [Select Id from Account].size());
    System.assertEquals(500, [Select Id from Contact].size());
    System.assertEquals(500, [Select Id from Note].size());
  }
}
