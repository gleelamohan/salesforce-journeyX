public with sharing class XP_AccountExecutiveController {

    @AuraEnabled
    public static string updateAEImage(string aeId, string documentId, string expId){
        if(string.isNotBlank(documentId)){
            ContentDocumentLink newAccountDoc = new ContentDocumentLink();
            newAccountDoc.ContentDocumentId = documentId;
            newAccountDoc.LinkedEntityId = aeId;
            newAccountDoc.ShareType = 'I';
            newAccountDoc.Visibility = 'InternalUsers';
            insert newAccountDoc;
        }    
        return linkExecAndExperience(aeId, expId); 
        
    }
    @AuraEnabled
    public static string linkExecAndExperience(string aeId, string expId){
        List<XP_Executive_Experience__c> expJunctionList = getExecutiveExperience(aeId, expId);
        if(expJunctionList.isEmpty()){
            XP_Executive_Experience__c expJunctionObj = new XP_Executive_Experience__c(Executive__c = aeId, Experience__c = expId); 
            insert expJunctionObj;
            return expJunctionObj.Id;
        }
        return expJunctionList[0].Id;
    }

    @AuraEnabled
    public static List<XP_Executive_Experience__c>  getExecutiveExperience(String aeId, String expId){
        return new List<XP_Executive_Experience__c>(
            [SELECT Id,Executive__c, Experience__c, Executive__r.Name, Executive__r.Email__c,
                    Executive__r.Contact_Number__c, Executive__r.Bio__c, Executive__r.Is_Executive__c,CreatedDate
            FROM XP_Executive_Experience__c
            WHERE Executive__c =: aeId
            and Experience__c=:expId]);
    }

    @AuraEnabled
    public static AccExecutiveWrapper getExecutive(String executiveId, String expId){
      AccExecutiveWrapper aeWrap = new AccExecutiveWrapper();
      List<XP_Executive_Experience__c> expJunctionList = getExecutiveExperience(executiveId, expId);
      XP_Executive__c executive = new XP_Executive__c(Name='',Email__c='', Is_Executive__c=false, Contact_Number__c='',Bio__c='');
      if(!expJunctionList.isempty()){
        XP_Executive_Experience__c junctionRec = expJunctionList[0];  
        executive.Id = junctionRec.Executive__c;
        executive.Name = junctionRec.Executive__r.Name;
        executive.Bio__c = junctionRec.Executive__r.Bio__c;
        executive.Email__c = junctionRec.Executive__r.Email__c;
        executive.Is_Executive__c = junctionRec.Executive__r.Is_Executive__c;
        executive.Contact_Number__c = junctionRec.Executive__r.Contact_Number__c;
        aeWrap.executive = executive;
        aeWrap.cdl = fetchDocument(executiveId);
      }
      return aeWrap;
    }

    @AuraEnabled
    public static String getRelatedExecutive(String expId){
        String execId = '';
        List<XP_Executive_Experience__c> expJunctionList = [SELECT Id,Executive__c, Experience__c FROM XP_Executive_Experience__c WHERE Experience__c=:expId Order By CreatedDate Desc];
        if(!expJunctionList.isempty() && String.isNotBlank(expJunctionList[0].Executive__c)){
            execId = expJunctionList[0].Executive__c;
        }
        return execId;
    }

   @AuraEnabled
   public static AccExecutiveWrapper fetchExecutive(){
        AccExecutiveWrapper aeWrap = new AccExecutiveWrapper();
        List<XP_Executive__c> execList = new List<XP_Executive__c>([SELECT ID,name,Email__c, Bio__c, Contact_number__c
                                                                FROM XP_Executive__c 
                                                                WHERE email__c=:UserInfo.getUserEmail()]);
        if(execList.isempty()){
            aeWrap.currUser = [SELECT Id,name, email, phone 
                               FROM User 
                               WHERE id=:UserInfo.getUserId()][0];
            aeWrap.isUser = true;
        }else{
            aeWrap.executive = execList[0];
            aeWrap.isUser = false;
            aeWrap.cdl = fetchDocument(aeWrap.executive.Id);
        }
        return aeWrap;
   }
  
   @AuraEnabled(cacheable=true)
   public static ContentDocumentLink fetchDocument(String executiveId){
    List<ContentDocumentLink> cdlList = new List<ContentDocumentLink>([SELECT ContentDocument.LatestPublishedVersionId,ContentDocumentId 
                                                                       FROM ContentDocumentLink 
                                                                       WHERE LinkedEntityId =:executiveId]);
     
     return !cdlList.isEmpty() ? cdlList[0] : null;                                                                  
   }
   public class AccExecutiveWrapper{
        @AuraEnabled
        public XP_Executive__c executive{get;set;}
        @AuraEnabled
        public User currUser{get;set;}
        @AuraEnabled
        public Boolean isUser{get;set;}
        @AuraEnabled
        public ContentDocumentLink cdl{get;set;}
    }
}
