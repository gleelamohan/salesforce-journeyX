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

    public class wrapJourney {

        @AuraEnabled
        public Journey__c journey {get; set;}

        @AuraEnabled
        public ContentDocumentLink cdLink {get; set;}
    }
}
