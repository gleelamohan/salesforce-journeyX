public class XP_MCJourneyWrapper {

    public Integer count {get;set;} 
	public Integer page {get;set;} 
	public Integer pageSize {get;set;} 
	public Links links {get;set;} 
    public List<Items> items {get;set;}
    public String error {get;set;} 
    public String error_description {get;set;} 
    public String error_uri {get;set;} 
    public Integer statusCode {get;set;}

	public XP_MCJourneyWrapper(JSONParser parser) {
		while (parser.nextToken() != System.JSONToken.END_OBJECT) {
			if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
				String text = parser.getText();
				if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
					if (text == 'count') {
						count = parser.getIntegerValue();
					} else if (text == 'page') {
						page = parser.getIntegerValue();
					} else if (text == 'pageSize') {
						pageSize = parser.getIntegerValue();
					} else if (text == 'links') {
						links = new Links(parser);
					} else if (text == 'items') {
                        items = arrayOfItems(parser);
                    } else if (text == 'error') {
                        error = parser.getText();
                    } else if (text == 'error_description') {
                        error_description = parser.getText();
                    } else if (text == 'error_uri') {
                        error_uri = parser.getText();
					} else {
						System.debug(LoggingLevel.WARN, 'XP_MCJourneyWrapper consuming unrecognized property: '+text);
						consumeObject(parser);
					}
				}
			}
		}
	}
	
	public class MetaData {
		public String scheduleState {get;set;} 

		public MetaData(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'scheduleState') {
							scheduleState = parser.getText();
						} else {
							System.debug(LoggingLevel.WARN, 'MetaData consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class Arguments {
		public Integer serializedObjectType {get;set;} 
		public String eventDefinitionId {get;set;} 
		public String eventDefinitionKey {get;set;} 
		public String dataExtensionId {get;set;} 
		public String criteria {get;set;} 

		public Arguments(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'serializedObjectType') {
							serializedObjectType = parser.getIntegerValue();
						} else if (text == 'eventDefinitionId') {
							eventDefinitionId = parser.getText();
						} else if (text == 'eventDefinitionKey') {
							eventDefinitionKey = parser.getText();
						} else if (text == 'dataExtensionId') {
							dataExtensionId = parser.getText();
						} else if (text == 'criteria') {
							criteria = parser.getText();
						} else {
							System.debug(LoggingLevel.WARN, 'Arguments consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class MetaData_Z {
		public String criteriaDescription {get;set;} 
		public String scheduleFlowMode {get;set;} 
		public String runOnceScheduleMode {get;set;} 
		public String scheduleState {get;set;} 

		public MetaData_Z(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'criteriaDescription') {
							criteriaDescription = parser.getText();
						} else if (text == 'scheduleFlowMode') {
							scheduleFlowMode = parser.getText();
						} else if (text == 'runOnceScheduleMode') {
							runOnceScheduleMode = parser.getText();
						} else if (text == 'scheduleState') {
							scheduleState = parser.getText();
						} else {
							System.debug(LoggingLevel.WARN, 'MetaData_Z consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class Links {

		public Links(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						{
							System.debug(LoggingLevel.WARN, 'Links consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class ConfigurationArguments {
		public Boolean unconfigured {get;set;} 

		public ConfigurationArguments(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'unconfigured') {
							unconfigured = parser.getBooleanValue();
						} else {
							System.debug(LoggingLevel.WARN, 'ConfigurationArguments consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class Items {
		public String id {get;set;} 
		public String type_Z {get;set;} // in json: type
		public String name {get;set;} 
		public String description {get;set;} 
		public String createdDate {get;set;} 
		public Integer createdBy {get;set;} 
		public String modifiedDate {get;set;} 
		public Integer modifiedBy {get;set;} 
		public String mode {get;set;} 
		public String eventDefinitionKey {get;set;} 
		public String dataExtensionId {get;set;} 
		public String dataExtensionName {get;set;} 
		public String sourceApplicationExtensionId {get;set;} 
		public String filterDefinitionId {get;set;} 
		public String filterDefinitionTemplate {get;set;} 
		public String iconUrl {get;set;} 
		public Arguments arguments {get;set;} 
		public MetaData metaData {get;set;} 
		public Integer interactionCount {get;set;} 
		public Boolean isVisibleInPicker {get;set;} 
		public Boolean isPlatformObject {get;set;} 
		public String category {get;set;} 
		public Integer publishedInteractionCount {get;set;} 
		public String automationId {get;set;} 
		public ConfigurationArguments configurationArguments {get;set;} 

		public Items(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'id') {
							id = parser.getText();
						} else if (text == 'type') {
							type_Z = parser.getText();
						} else if (text == 'name') {
							name = parser.getText();
						} else if (text == 'description') {
							description = parser.getText();
						} else if (text == 'createdDate') {
							createdDate = parser.getText();
						} else if (text == 'createdBy') {
							createdBy = parser.getIntegerValue();
						} else if (text == 'modifiedDate') {
							modifiedDate = parser.getText();
						} else if (text == 'modifiedBy') {
							modifiedBy = parser.getIntegerValue();
						} else if (text == 'mode') {
							mode = parser.getText();
						} else if (text == 'eventDefinitionKey') {
							eventDefinitionKey = parser.getText();
						} else if (text == 'dataExtensionId') {
							dataExtensionId = parser.getText();
						} else if (text == 'dataExtensionName') {
							dataExtensionName = parser.getText();
						} else if (text == 'sourceApplicationExtensionId') {
							sourceApplicationExtensionId = parser.getText();
						} else if (text == 'filterDefinitionId') {
							filterDefinitionId = parser.getText();
						} else if (text == 'filterDefinitionTemplate') {
							filterDefinitionTemplate = parser.getText();
						} else if (text == 'iconUrl') {
							iconUrl = parser.getText();
						} else if (text == 'arguments') {
							arguments = new Arguments(parser);
						} else if (text == 'metaData') {
							metaData = new MetaData(parser);
						} else if (text == 'interactionCount') {
							interactionCount = parser.getIntegerValue();
						} else if (text == 'isVisibleInPicker') {
							isVisibleInPicker = parser.getBooleanValue();
						} else if (text == 'isPlatformObject') {
							isPlatformObject = parser.getBooleanValue();
						} else if (text == 'category') {
							category = parser.getText();
						} else if (text == 'publishedInteractionCount') {
							publishedInteractionCount = parser.getIntegerValue();
						} else if (text == 'automationId') {
							automationId = parser.getText();
						} else if (text == 'configurationArguments') {
							configurationArguments = new ConfigurationArguments(parser);
						} else {
							System.debug(LoggingLevel.WARN, 'Items consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class Arguments_Z {
		public Integer serializedObjectType {get;set;} 
		public Boolean useHighWatermark {get;set;} 
		public String eventDefinitionId {get;set;} 
		public String eventDefinitionKey {get;set;} 
		public String dataExtensionId {get;set;} 
		public String criteria {get;set;} 

		public Arguments_Z(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'serializedObjectType') {
							serializedObjectType = parser.getIntegerValue();
						} else if (text == 'useHighWatermark') {
							useHighWatermark = parser.getBooleanValue();
						} else if (text == 'eventDefinitionId') {
							eventDefinitionId = parser.getText();
						} else if (text == 'eventDefinitionKey') {
							eventDefinitionKey = parser.getText();
						} else if (text == 'dataExtensionId') {
							dataExtensionId = parser.getText();
						} else if (text == 'criteria') {
							criteria = parser.getText();
						} else {
							System.debug(LoggingLevel.WARN, 'Arguments_Z consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	
	public static XP_MCJourneyWrapper parseResponse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
		return new XP_MCJourneyWrapper(parser);
	}
	
	public static void consumeObject(System.JSONParser parser) {
		Integer depth = 0;
		do {
			System.JSONToken curr = parser.getCurrentToken();
			if (curr == System.JSONToken.START_OBJECT || 
				curr == System.JSONToken.START_ARRAY) {
				depth++;
			} else if (curr == System.JSONToken.END_OBJECT ||
				curr == System.JSONToken.END_ARRAY) {
				depth--;
			}
		} while (depth > 0 && parser.nextToken() != null);
	}

    private static List<Items> arrayOfItems(System.JSONParser p) {
        List<Items> res = new List<Items>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Items(p));
        }
        return res;
    }
}