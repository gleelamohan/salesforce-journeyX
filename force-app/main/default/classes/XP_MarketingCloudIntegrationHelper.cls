public class XP_MarketingCloudIntegrationHelper{

    private static XP_Marketing_Cloud_Credential__mdt MCMDT = [SELECT MasterLabel,DeveloperName,Authentication_URL__c,Client_Id__c,Client_Secret__c,JWT_Signing_Secret__c,Rest_URL__c,SOAP_URL__c 
                                                                FROM XP_Marketing_Cloud_Credential__mdt 
                                                                WHERE DeveloperName=:'Journey_X' LIMIT 1];
    private static String ACCESSTOKEN;
    /* 
     * Description : Authentication call to get the bearer token 
     */
    public static void fetchAccessToken(){
            XP_MCAuthWrapper.RequestWrapper reqwrapper = new XP_MCAuthWrapper.RequestWrapper();
            reqwrapper.client_id = MCMDT.Client_Id__c;
            reqwrapper.client_secret = MCMDT.Client_Secret__c;
            reqwrapper.grant_type = 'client_credentials';
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(MCMDT.Authentication_URL__c+'v2/token');
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json');
            request.setBody(String.valueOf(JSON.serialize(reqwrapper)));
            HttpResponse response = http.send(request);
            XP_MCAuthWrapper.ResponseWrapper respWrapper = XP_MCAuthWrapper.parseToResponseWrapper(response.getBody());
            if(response.getStatusCode() == 200) {
                System.debug(response.getBody());
                ACCESSTOKEN = respWrapper.access_token;
            } else {
                System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getStatus());
                throw new XP_ExtendException('Error Fetching Access Token. StatusCode: ' + response.getStatusCode() + ' Status:' + response.getStatus() +' Error:' + respWrapper.error +
                ' Error Description:' + respWrapper.error_description + ' Error URI:' + respWrapper.error_uri);
            }
    }

    /* 
     * Description : Fetch All Journeys from Marketing Cloud 
     */
    public static XP_MCJourneyWrapper fetchAllJourneys(){
        fetchAccessToken();
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(MCMDT.Rest_URL__c+'interaction/v1/eventDefinitions');
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
        String authorizationHeader = 'Bearer ' + ACCESSTOKEN;
        request.setHeader('Authorization',authorizationHeader);
        HttpResponse response = http.send(request);
        XP_MCJourneyWrapper respWrapper = XP_MCJourneyWrapper.parseResponse(response.getBody());
        respWrapper.statusCode = response.getStatusCode();
        if(response.getStatusCode() == 200) {
            System.debug(response.getBody());
        } else {
            System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getStatus());
            throw new XP_ExtendException('Error Fetching Access Token. StatusCode: ' + response.getStatusCode() + ' Status:' + response.getStatus() +' Error:' + respWrapper.error +
            ' Error Description:' + respWrapper.error_description + ' Error URI:' + respWrapper.error_uri);
        }
        return respWrapper;
    }

    /* 
     * Description : Get Journeys List
     */
    public static List<Journey__c> getJourneys(){
        XP_MCJourneyWrapper respWrapper = fetchAllJourneys();
        List<Journey__c> journeyList = new List<Journey__c>();
        if(respWrapper.statusCode==200){
            for(XP_MCJourneyWrapper.Items item : respWrapper.items){
                Journey__c journey = new Journey__c();
                journey.Journey_Id__c = item.eventDefinitionKey;
                journey.Name = item.name;
                journey.Journey_MC_Id__c = item.id;
                journey.Data_Extension_Id__c = item.dataExtensionId;
                journey.Date_Extension_Name__c = item.dataExtensionName;
                journey.Description__c = item.description;
                journey.Event_Definition_Key__c = item.eventDefinitionKey;
                journey.Source_Application_Extension_Id__c = item.sourceApplicationExtensionId;
                journey.Type__c = item.type_Z;
                journey.Mode__c = item.mode;
                journeyList.add(journey);
            }
        }
        upsert journeyList Journey_MC_Id__c;
        return journeyList;
    }
}