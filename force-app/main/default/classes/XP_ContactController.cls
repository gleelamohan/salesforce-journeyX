public with sharing class XP_ContactController{
    @AuraEnabled(cacheable=true)
    public static List<XP_Contact__c> fetchContacts(String accId) {
        return [select name,email__c,contact_number__c,role__c,id from XP_Contact__c where account__c=:accId];
    }
}