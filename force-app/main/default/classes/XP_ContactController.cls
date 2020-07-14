public with sharing class XP_ContactController{
    @AuraEnabled(cacheable=true)
    public static List<Contact_xp__c> fetchContacts(String accId) {
        return [select name,email__c,contact_number__c,role__c,id from contact_xp__c where account__c=:accId];
    }
}