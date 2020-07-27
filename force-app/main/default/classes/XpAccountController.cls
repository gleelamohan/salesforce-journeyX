public class XpAccountController {
    public XpAccountController() {

    }

    @AuraEnabled
    public static string updateAccountAttachment(string accountId, string documentId){
        List<ContentDocumentLink> docLink = [select Id,LinkedEntityId,ShareType from ContentDocumentLink where LinkedEntityId = :accountId];

        if(!docLink.isEmpty()){
           delete docLink[0];
        }
        ContentDocumentLink newAccountDoc = new ContentDocumentLink();
            newAccountDoc.ContentDocumentId = documentId;
            newAccountDoc.LinkedEntityId = accountId;
            newAccountDoc.ShareType = 'I';
            newAccountDoc.Visibility = 'InternalUsers';
            insert newAccountDoc; 

        return insertXperience(accountId, documentId);
        
    }

    @AuraEnabled
    public static string savXperience(string accountId){
        return insertXperience(accountId, '');
    }

    public static string insertXperience(string accountId, string documentId){

        List<Experience__c> xp = [select Id from Experience__c where Account__c = :accountId];
        string xperienceId = '';
        if (xp.isEmpty())
        {
            Account_xp__c acc = [select Name__c,documentId__c from Account_xp__c where Id = :accountId];
            if(String.isNotBlank(documentId)){
            
            acc.documentId__c =documentId;
            update acc;
            }
            Experience__c newXP = new Experience__c();
            newXP.Account__c = accountId;
            newXP.Status__c = 'Draft';
            newXP.Name = acc.Name__c;
            insert newXP;
            xperienceId = newXP.Id;
        }
        else {
            xperienceId = xp[0].Id;

            if(String.isNotBlank(documentId)){
            Account_xp__c acc = [select Name__c,documentId__c from Account_xp__c where Id = :accountId];
            acc.documentId__c =documentId;
            update acc;
            }
            
        }

        return xperienceId;
    }

    @AuraEnabled
    public static void deleteDocument(string documentId) {
        delete [select Id from ContentDocument where Id=:documentId];
    }

    
    @AuraEnabled
    public static ContentDocumentLink fetchDocumentVersionId(string linkedEntityId, string documentId) {
        List<Account_xp__c> acc = null;
        string docId = '';
        if(documentId == ''){
            acc =   [select Name__c,documentId__c from Account_xp__c where Id = :linkedEntityId];
            if (!acc.isEmpty()){
            docId = acc[0].documentId__c;
            }
        }
        else{
            docId = documentId;
        }
        ContentDocumentLink cd = null;
        if(String.isNotBlank(docId)){
            cd = [SELECT ContentDocument.LatestPublishedVersionId,ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =:linkedEntityId and ContentDocumentId =:docId ];
        }
        return cd;
    }


}
