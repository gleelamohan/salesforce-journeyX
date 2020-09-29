public class XP_MCAuthWrapper {

    public class RequestWrapper{
        public String grant_type {get;set;} 
        public String client_id {get;set;} 
        public String client_secret {get;set;} 

        public RequestWrapper(){}
    }

    public class ResponseWrapper{
        public String access_token {get;set;} 
        public String token_type {get;set;} 
        public Integer expires_in {get;set;} 
        public String scope {get;set;} 
        public String soap_instance_url {get;set;} 
        public String rest_instance_url {get;set;} 
        public String error {get;set;} 
        public String error_description {get;set;} 
        public String error_uri {get;set;}

        public ResponseWrapper(){}
    }  
    
    public static ResponseWrapper parseToResponseWrapper(String json) {
        return (ResponseWrapper) System.JSON.deserialize(json, ResponseWrapper.class);
    }

    public static RequestWrapper parseToRequestWrapper(String json) {
        return (RequestWrapper) System.JSON.deserialize(json, RequestWrapper.class);
    }
}