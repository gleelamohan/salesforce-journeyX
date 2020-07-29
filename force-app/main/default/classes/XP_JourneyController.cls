public with sharing class XP_JourneyController {
    public XP_JourneyController() {

    }

    @AuraEnabled
   public static List<wrapJourney> fetchJourneys(){

      List<Journey__c> journey = [select Id, Name, Description__c,Journey_Id__c from Journey__c];
      List<wrapJourney> wpJourney =  new List<wrapJourney>();

      if(!journey.isempty()){
        for(Journey__c j : journey){
            List<ContentDocumentLink> cdLink = [SELECT ContentDocument.LatestPublishedVersionId,ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =:j.Id LIMIT 1]; 
            wrapJourney wj = new wrapJourney();
                if(!cdLink.isempty()) {
                wj.cdLink = cdLink[0];
                }
            wj.journey = j;
            wpJourney.add(wj);
        }
      }
      return wpJourney;
   }

   @AuraEnabled
   public static List<wrapJourney> fetchJourney(string journeyId){

      List<Journey__c> journey = [select Id, Name, Description__c,Journey_Id__c from Journey__c where Id = :journeyId];
      List<wrapJourney> wpJourney =  new List<wrapJourney>();

      if(!journey.isempty()){
        for(Journey__c j : journey){
            List<ContentDocumentLink> cdLink = [SELECT ContentDocument.LatestPublishedVersionId,ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =:j.Id LIMIT 1]; 
            wrapJourney wj = new wrapJourney();
                if(!cdLink.isempty()) {
                wj.cdLink = cdLink[0];
                }
            wj.journey = j;
            wpJourney.add(wj);
        }
      }
      return wpJourney;
   }

   @AuraEnabled
   public static void addJourney(string journeyId, string xp_id){

    Experience__c xp = [select Journey__c from Experience__c where Id = :xp_id];
    xp.Journey__c = journeyId;
    update xp;

   }

    public class wrapJourney {

        @AuraEnabled
        public Journey__c journey {get; set;}

        @AuraEnabled
        public ContentDocumentLink cdLink {get; set;}
    }
}
