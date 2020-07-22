public class XpAccountController {
    public XpAccountController() {

    }

    @AuraEnabled
    public static string updateAccountAttachment(string accountId, string documentId){
        List<ContentDocumentLink> docLink = [select Id,LinkedEntityId,ShareType from ContentDocumentLink where ContentDocumentId = :documentId];
        ContentDocumentLink newAccountDoc = new ContentDocumentLink();
        newAccountDoc.ContentDocumentId = documentId;
        newAccountDoc.LinkedEntityId = accountId;
        newAccountDoc.ShareType = 'I';
        newAccountDoc.Visibility = 'InternalUsers';
        insert newAccountDoc;

        return insertXperience(accountId);
        
    }

    @AuraEnabled
    public static string savXperience(string accountId){
        return insertXperience(accountId);
    }

    public static string insertXperience(string accountId){

        List<Experience__c> xp = [select Id from Experience__c where Account__c = :accountId];
        string xperienceId = '';
        if (xp.isEmpty())
        {
            Account_xp__c acc = [select Name__c from Account_xp__c where Id = :accountId];
            Experience__c newXP = new Experience__c();
            newXP.Account__c = accountId;
            newXP.Status__c = 'Draft';
            newXP.Name = acc.Name__c;
            insert newXP;
            xperienceId = newXP.Id;
        }
        else {
            xperienceId = xp[0].Id;
        }

        return xperienceId;
    }

    @AuraEnabled
    public static void deleteDocument(string documentId) {
        delete [select Id from ContentDocument where Id=:documentId];
    }

    
    @AuraEnabled
    public static ContentDocumentLink fetchDocumentVersionId(string linkedEntityId, string documentId) {
        return [SELECT ContentDocument.LatestPublishedVersionId,ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =:linkedEntityId and ContentDocumentId =:documentId ];
    }


}
