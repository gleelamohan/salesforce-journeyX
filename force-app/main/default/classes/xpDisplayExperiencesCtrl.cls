public with sharing class xpDisplayExperiencesCtrl {
    public xpDisplayExperiencesCtrl() {

    }
    @AuraEnabled(cacheable=true)
    public static List<ExperienceWrapper> getMyExperiences(){
        List<ExperienceWrapper> expWrapList = new List<ExperienceWrapper>();
        for(Experience__c exp :  [SELECT ID,NAME,Status__c,DateScheduled__c,Account__c,Account__r.Name, Account__r.No_of_Participants__c
                FROM Experience__c]){
                //where OwnerId =: UserInfo.getUserId()]){
            ExperienceWrapper expWrap = new ExperienceWrapper();
            expWrap.xperienceName = exp.Name;
            expWrap.status = exp.Status__c;
            expWrap.scheduled_date = exp.DateScheduled__c;
            expWrap.accName = exp.Account__r.Name;
            expWrap.xpId = exp.Id;
            expWrap.accId = exp.Account__c;
            expWrap.participantCount = (Integer)exp.Account__r.No_of_Participants__c;
            expWrapList.add(expWrap);
        }
        return expWrapList;
    }
    public class ExperienceWrapper{
        @AuraEnabled
        public String xperienceName{get;set;}
        @AuraEnabled
        public String accName{get;set;}
        @AuraEnabled
        public Datetime scheduled_date{get;set;}
        @AuraEnabled
        public Integer participantCount{get;set;}
        @AuraEnabled
        public String status{get;set;}
        @AuraEnabled
        public String xpId{get;set;}
        @AuraEnabled
        public String accId{get;set;}
    }
        
}
