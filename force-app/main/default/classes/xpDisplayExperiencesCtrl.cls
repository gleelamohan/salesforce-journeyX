public with sharing class xpDisplayExperiencesCtrl {
    public xpDisplayExperiencesCtrl() {

    }
    @AuraEnabled(cacheable=true)
    public static List<ExperienceWrapper> getMyExperiences(){
        List<ExperienceWrapper> expWrapList = new List<ExperienceWrapper>();
        for(Experience__c exp :  [SELECT ID,NAME,Status__c,DateScheduled__c,Account__c,Account__r.Name, Account__r.No_of_Participants__c
                FROM Experience__c limit 2000]){
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
    @AuraEnabled
    public static void deleteXp(String xpId){
        List<sObject> recordsToDelete = new List<sObject>();
        List<Experience__c> xpRecords = new List<Experience__c>([select id, Account__c, Journey__c 
                                                                 from Experience__c where id=:xpId]);
        if(!xpRecords.isEmpty()){
            Experience__c expToDelete = xpRecords[0];
            recordsToDelete.add(expToDelete);

            Journey__c journeyToDelete = new Journey__c(id = expToDelete.Journey__c);
            recordsToDelete.add(journeyToDelete);

            Account_xp__c accToDelete = new Account_xp__c(id=xpRecords[0].Account__c);
            recordsToDelete.add(accToDelete);

            list<XP_Executive__c> executivesToDelete = new list<XP_Executive__c>();
            Set<id> execIds = new Set<id>();
            List<XP_Executive_Experience__c> exp_Executives = new List<XP_Executive_Experience__c>(
                                                              [select id, Experience__c, Executive__c 
                                                               from XP_Executive_Experience__c
                                                               where Experience__c =:xpId]);
            for(XP_Executive_Experience__c exp_Exec : exp_Executives){
                if(!execIds.contains(exp_Exec.Executive__c)){
                     executivesToDelete.add(new XP_Executive__c(id = exp_Exec.Executive__c));
                     execIds.add(exp_Exec.Executive__c);
                }
            }
            recordsToDelete.addAll(executivesToDelete);
            delete recordsToDelete;
        }
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
