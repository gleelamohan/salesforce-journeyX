public class XpAccountController {
    public XpAccountController() {

    }

    @AuraEnabled
    public static void updateAccountAttachment(string accountId, string documentId){
        List<ContentDocumentLink> docLink = [select Id,LinkedEntityId,ShareType from ContentDocumentLink where ContentDocumentId = :documentId];
        ContentDocumentLink newAccountDoc = new ContentDocumentLink();
        newAccountDoc.ContentDocumentId = documentId;
        newAccountDoc.LinkedEntityId = accountId;
        newAccountDoc.ShareType = 'I';
        newAccountDoc.Visibility = 'InternalUsers';
        insert newAccountDoc;
    
    }

    @AuraEnabled
    public static void deleteDocument(string documentId) {
        delete [select Id from ContentDocument where Id=:documentId];
    }
}
