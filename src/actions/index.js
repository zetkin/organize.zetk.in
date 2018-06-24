export const SET_INTL_DATA = 'SET_INTL_DATA';
export const SET_PRINT_DATA = 'SET_PRINT_DATA';

// Flux actions relate to view state
export const SET_PANES_FROM_URL_PATH = 'SET_PANES_FROM_URL_PATH';
export const OPEN_PANE = 'OPEN_PANE';
export const CLOSE_PANE = 'CLOSE_PANE';
export const REPLACE_PANE = 'REPLACE_PANE';
export const PUSH_PANE = 'PUSH_PANE';
export const GOTO_SECTION = 'GOTO_SECTION';

// Flux actions related to users
export const GET_USER_INFO = 'GET_USER_INFO';
export const GET_USER_MEMBERSHIPS = 'GET_USER_MEMBERSHIPS';
export const SET_ACTIVE_ORG = 'SET_ACTIVE_ORG';

// Redux actions related to people
export const CREATE_PERSON = 'CREATE_PERSON';
export const RETRIEVE_PEOPLE = 'RETRIEVE_PEOPLE';
export const RETRIEVE_PERSON = 'RETRIEVE_PERSON';
export const UPDATE_PERSON = 'UPDATE_PERSON';
export const DELETE_PERSON = 'DELETE_PERSON';
export const FIND_PERSON_DUPLICATES = 'FIND_PERSON_DUPLICATES';
export const CLEAR_PERSON_DUPLICATES = 'CLEAR_PERSON_DUPLICATES';
export const MERGE_PERSON_DUPLICATES = 'MERGE_PERSON_DUPLICATES';

// Redux actions related to person groups
export const CREATE_GROUP = 'CREATE_GROUP';
export const RETRIEVE_GROUPS = 'RETRIEVE_GROUPS';
export const RETRIEVE_GROUP = 'RETRIEVE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const RETRIEVE_GROUP_MEMBERS = 'RETRIEVE_GROUP_MEMBERS';
export const ADD_GROUP_MEMBER = 'ADD_GROUP_MEMBER';
export const REMOVE_GROUP_MEMBER = 'REMOVE_GROUP_MEMBER';
export const PROMOTE_GROUP_MANAGER = 'PROMOTE_GROUP_MANAGER';
export const DEMOTE_GROUP_MANAGER = 'DEMOTE_GROUP_MANAGER';

// Flux actions related to person tags
export const CREATE_PERSON_TAG = 'CREATE_PERSON_TAG';
export const RETRIEVE_PERSON_TAG = 'RETRIEVE_PERSON_TAG';
export const RETRIEVE_PERSON_TAGS = 'RETRIEVE_PERSON_TAGS';
export const RETRIEVE_TAGS_FOR_PERSON = 'RETRIEVE_TAGS_FOR_PERSON';
export const UPDATE_PERSON_TAG = 'UPDATE_PERSON_TAG';
export const ADD_TAGS_TO_PERSON = 'ADD_TAGS_TO_PERSON';
export const REMOVE_TAG_FROM_PERSON = 'REMOVE_TAG_FROM_PERSON';

// Redux actions related to locations
export const CREATE_LOCATION = 'CREATE_LOCATION';
export const RETRIEVE_LOCATIONS = 'RETRIEVE_LOCATIONS';
export const RETRIEVE_LOCATION = 'RETRIEVE_LOCATION';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const DELETE_LOCATION = 'DELETE_LOCATION';
export const CREATE_PENDING_LOCATION = 'CREATE_PENDING_LOCATION';
export const SAVE_PENDING_LOCATION = 'SAVE_PENDING_LOCATION';
export const FINISH_PENDING_LOCATION = 'FINISH_PENDING_LOCATION';

// Redux actions related to campaigns
export const CREATE_CAMPAIGN = 'CREATE_CAMPAIGN';
export const RETRIEVE_CAMPAIGNS = 'RETRIEVE_CAMPAIGNS';
export const RETRIEVE_CAMPAIGN = 'RETRIEVE_CAMPAIGN';
export const UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN';
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export const SELECT_CAMPAIGN = 'SELECT_CAMPAIGN';

// Redux actions related to activity
export const CREATE_ACTIVITY = 'CREATE_ACTIVITY';
export const RETRIEVE_ACTIVITY = 'RETRIEVE_ACTIVITY';
export const RETRIEVE_ACTIVITIES = 'RETRIEVE_ACTIVITIES';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';

// Redux actions related to campaign actions
export const RETRIEVE_ACTIONS = 'RETRIEVE_ACTIONS';
export const RETRIEVE_ACTIONS_ON_DAY = 'RETRIEVE_ACTIONS_ON_DAY';
export const RETRIEVE_ACTION = 'RETRIEVE_ACTION';
export const UPDATE_ACTION = 'UPDATE_ACTION';
export const CREATE_ACTION = 'CREATE_ACTION';
export const DELETE_ACTION = 'DELETE_ACTION';
export const SET_ACTION_CONTACT = 'SET_ACTION_CONTACT';
export const CLEAR_ACTION_HIGHLIGHTS = 'CLEAR_ACTION_HIGHLIGHTS';
export const SEND_ACTION_REMINDERS = 'SEND_ACTION_REMINDERS';
export const HIGHLIGHT_ACTIONS = 'HIGHLIGHT_ACTIONS';
export const HIGHLIGHT_ACTION_ACTIVITY = 'HIGHLIGHT_ACTION_ACTIVITY';
export const HIGHLIGHT_ACTION_LOCATION = 'HIGHLIGHT_ACTION_LOCATION';
export const HIGHLIGHT_ACTION_ACTIVITY_PHASE = 'HIGHLIGHT_ACTION_ACTIVITY_PHASE';
export const HIGHLIGHT_ACTION_LOCATION_PHASE = 'HIGHLIGHT_ACTION_LOCATION_PHASE';

// Flux actions related to action participants
export const RETRIEVE_ACTION_PARTICIPANTS = 'RETRIEVE_ACTION_PARTICIPANTS';
export const ADD_ACTION_PARTICIPANT = 'ADD_ACTION_PARTICIPANT';
export const ADD_ACTION_PARTICIPANTS = 'ADD_ACTION_PARTICIPANTS';
export const MOVE_ACTION_PARTICIPANT = 'MOVE_ACTION_PARTICIPANT';
export const EXECUTE_ACTION_PARTICIPANT_MOVES = 'EXECUTE_ACTION_PARTICIPANT_MOVES';
export const UNDO_ACTION_PARTICIPANT_MOVES = 'UNDO_ACTION_PARTICIPANT_MOVES';
export const CLEAR_ACTION_PARTICIPANT_MOVES = 'CLEAR_ACTION_PARTICIPANT_MOVES';
export const REMOVE_ACTION_PARTICIPANT = 'REMOVE_ACTION_PARTICIPANT';

// Flux actions realted to action responses
export const RETRIEVE_ACTION_RESPONSES = 'RETRIEVE_ACTION_RESPONSES';

// Flux actions related to dashboard
export const LOAD_WIDGET_DATA = 'LOAD_WIDGET_DATA';
export const MOVE_WIDGET = 'MOVE_WIDGET';

// Flux actions related to search
export const SEARCH = 'SEARCH';
export const BEGIN_SEARCH = 'BEGIN_SEARCH';
export const SEARCH_MATCH_FOUND = 'SEARCH_MATCH_FOUND';
export const SEARCH_PENDING = 'SEARCH_PENDING';
export const SEARCH_COMPLETE = 'SEARCH_COMPLETE';
export const CHANGE_SEARCH_SCOPE = 'CHANGE_SEARCH_SCOPE';
export const END_SEARCH = 'END_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

// Flux actions related to queries
export const RETRIEVE_QUERIES = 'RETRIEVE_QUERIES';
export const RETRIEVE_QUERY = 'RETRIEVE_QUERY';
export const RETRIEVE_QUERY_MATCHES = 'RETRIEVE_QUERY_MATCHES';
export const CREATE_QUERY = 'CREATE_QUERY';
export const UPDATE_QUERY = 'UPDATE_QUERY';
export const UPDATE_QUERY_FILTER = 'UPDATE_FILTER';
export const ADD_QUERY_FILTER = 'ADD_QUERY_FILTER';
export const REMOVE_QUERY_FILTER = 'REMOVE_QUERY_FILTER';

// Flux actions related to call assignments
export const CREATE_CALL_ASSIGNMENT = 'CREATE_CALL_ASSIGNMENT';
export const RETRIEVE_CALL_ASSIGNMENTS = 'RETRIEVE_CALL_ASSIGNMENTS';
export const RETRIEVE_CALL_ASSIGNMENT = 'RETRIEVE_CALL_ASSIGNMENT';
export const UPDATE_CALL_ASSIGNMENT = 'UPDATE_CALL_ASSIGNMENT';
export const DELETE_CALL_ASSIGNMENT = 'DELETE_CALL_ASSIGNMENT';
export const RETRIEVE_CALL_ASSIGNMENT_STATS = 'RETRIEVE_CALL_ASSIGNMENT_STATS';
export const RETRIEVE_CALL_ASSIGNMENT_TARGETS = 'RETRIEVE_CALL_ASSIGNMENT_TARGETS';
export const RETRIEVE_CALL_ASSIGNMENT_CALLERS = 'RETRIEVE_CALL_ASSIGNMENT_CALLERS';
export const ADD_CALL_ASSIGNMENT_CALLERS = 'ADD_CALL_ASSIGNMENT_CALLERS';
export const REMOVE_CALL_ASSIGNMENT_CALLER = 'REMOVE_CALL_ASSIGNMENT_CALLER';
export const ADD_CALLER_PRIORITIZED_TAGS = 'ADD_CALLER_PRIORITIZED_TAGS';
export const REMOVE_CALLER_PRIORITIZED_TAGS = 'REMOVE_CALLER_PRIORITIZED_TAGS';
export const ADD_CALLER_EXCLUDED_TAGS = 'ADD_CALLER_EXCLUDED_TAGS';
export const REMOVE_CALLER_EXCLUDED_TAGS = 'REMOVE_CALLER_EXCLUDED_TAGS';

// Flux actions related to calls
export const RETRIEVE_CALLS = 'RETRIEVE_CALLS';
export const RETRIEVE_CALL = 'RETRIEVE_CALL';
export const TOGGLE_CALL_ACTION_TAKEN = 'TOGGLE_CALL_ACTION_TAKEN';

// Flux actions related to text documents
export const CREATE_TEXT_DOCUMENT = 'CREATE_TEXT_DOCUMENT';
export const SAVE_TEXT_DOCUMENT = 'SAVE_TEXT_DOCUMENT';
export const FINISH_TEXT_DOCUMENT = 'FINISH_TEXT_DOCUMENT';

// Flux actions related to selections
export const CREATE_SELECTION = 'CREATE_SELECTION';
export const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
export const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export const FINISH_SELECTION = 'FINISH_SELECTION';

// Flux actions related to import
export const PARSE_IMPORT_FILE = 'PARSE_IMPORT_FILE';
export const USE_IMPORT_TABLE_FIRST_AS_HEADER = 'USE_IMPORT_TABLE_FIRST_AS_HEADER';
export const UPDATE_IMPORT_COLUMN = 'UPDATE_IMPORT_COLUMN';
export const EXECUTE_IMPORT = 'EXECUTE_IMPORT';
export const RESET_IMPORT = 'RESET_IMPORT';
export const RESET_IMPORT_ERROR = 'RESET_IMPORT_ERROR';

// Flux actions related to officials
export const RETRIEVE_OFFICIALS = 'RETRIEVE_OFFICIALS';
export const SET_OFFICIAL_ROLE = 'SET_OFFICIAL_ROLE';
export const SET_OFFICIALS_ROLE = 'SET_OFFICIALS_ROLE';
export const DELETE_OFFICIAL = 'DELETE_OFFICIAL';

// Flux actions related to invites
export const CREATE_INVITE = 'CREATE_INVITE';
export const RETRIEVE_INVITES = 'RETRIEVE_INVITES';
export const DELETE_INVITE = 'DELETE_INVITE';

// Redux actions related to location tags
export const CREATE_LOCATION_TAG = 'CREATE_LOCATION_TAG';
export const RETRIEVE_LOCATION_TAG = 'RETRIEVE_LOCATION_TAG';
export const RETRIEVE_LOCATION_TAGS = 'RETRIEVE_LOCATION_TAGS';
export const UPDATE_LOCATION_TAG = 'UPDATE_LOCATION_TAG';
export const RETRIEVE_TAGS_FOR_LOCATION = 'RETRIEVE_TAGS_FOR_LOCATION';
export const ADD_TAGS_TO_LOCATION = 'ADD_TAGS_TO_LOCATION';
export const REMOVE_TAG_FROM_LOCATION = 'REMOVE_TAG_FROM_LOCATION';
export const RETRIEVE_TAGS_FOR_ADDRESS = 'RETRIEVE_TAGS_FOR_ADDRESS';
export const ADD_TAGS_TO_ADDRESS = 'ADD_TAGS_TO_ADDRESS';
export const REMOVE_TAG_FROM_ADDRESS = 'REMOVE_TAG_FROM_ADDRESS';

// Redux actions related to bulk operations
export const EXECUTE_BULK_OPERATION = 'EXECUTE_BULK_OPERATION';

// Redux actions related to surveys
export const RETRIEVE_SURVEYS = 'RETRIEVE_SURVEYS';
export const RETRIEVE_SURVEY = 'RETRIEVE_SURVEY';
export const CREATE_SURVEY = 'CREATE_SURVEY';
export const UPDATE_SURVEY = 'UPDATE_SURVEY';
export const DELETE_SURVEY = 'DELETE_SURVEY';
export const CREATE_SURVEY_ELEMENT = 'CREATE_SURVEY_ELEMENT';
export const UPDATE_SURVEY_ELEMENT = 'UPDATE_SURVEY_ELEMENT';
export const DELETE_SURVEY_ELEMENT = 'DELETE_SURVEY_ELEMENT';
export const REORDER_SURVEY_ELEMENTS = 'REORDER_SURVEY_ELEMENTS';
export const CREATE_SURVEY_OPTION = 'CREATE_SURVEY_OPTION';
export const UPDATE_SURVEY_OPTION = 'UPDATE_SURVEY_OPTION';
export const DELETE_SURVEY_OPTION = 'DELETE_SURVEY_OPTION';
export const REORDER_SURVEY_OPTIONS = 'REORDER_SURVEY_OPTIONS';
export const RETRIEVE_SURVEY_SUBMISSIONS = 'RETRIEVE_SURVEY_SUBMISSIONS';
export const RETRIEVE_SURVEY_SUBMISSION = 'RETRIEVE_SURVEY_SUBMISSION';
export const UPDATE_SURVEY_SUBMISSION = 'UPDATE_SURVEY_SUBMISSION';

// Redux actions related to addresses
export const RETRIEVE_ADDRESSES = 'RETRIEVE_ADDRESSES';
export const RETRIEVE_ROUTE_ADDRESSES = 'RETRIEVE_ROUTE_ADDRESSES';
export const ADD_ADDRESSES_TO_ROUTE = 'ADD_ADDRESSES_TO_ROUTE';
export const REMOVE_ADDRESSES_FROM_ROUTE = 'REMOVE_ADDRESSES_FROM_ROUTE';
export const RETRIEVE_ADDRESS_TAG = 'RETRIEVE_ADDRESS_TAG';
export const UPDATE_ADDRESS_TAG = 'UPDATE_ADDRESS_TAG';
export const CREATE_ADDRESS_TAG = 'CREATE_ADDRESS_TAG';

// Redux actions related to routes
export const CREATE_ROUTE = 'CREATE_ROUTE';
export const UPDATE_ROUTE = 'UPDATE_ROUTE';
export const RETRIEVE_ROUTE = 'RETRIEVE_ROUTE';
export const RETRIEVE_ROUTES = 'RETRIEVE_ROUTES';
export const GENERATE_ROUTES = 'GENERATE_ROUTES';
export const DISCARD_ROUTE_DRAFTS = 'DISCARD_ROUTE_DRAFTS';
export const COMMIT_ROUTE_DRAFTS = 'COMMIT_ROUTE_DRAFTS';
export const CREATE_ASSIGNED_ROUTE = 'CREATE_ASSIGNED_ROUTE';
export const UPDATE_ASSIGNED_ROUTE = 'UPDATE_ASSIGNED_ROUTE';
export const UPDATE_ASSIGNED_ROUTE_VISITS = 'UPDATE_ASSIGNED_ROUTE_VISITS';
export const RETRIEVE_ASSIGNED_ROUTES = 'RETRIEVE_ASSIGNED_ROUTES';
export const RETRIEVE_ASSIGNED_ROUTE = 'RETRIEVE_ASSIGNED_ROUTE';
export const RETRIEVE_ASSIGNED_ROUTE_STATS = 'RETRIEVE_ASSIGNED_ROUTE_STATS';

// Redux actions related to canvass assignments
export const RETRIEVE_CANVASS_ASSIGNMENTS = 'RETRIEVE_CANVASS_ASSIGNMENTS';
export const RETRIEVE_CANVASS_ASSIGNMENT = 'RETRIEVE_CANVASS_ASSIGNMENT';
export const CREATE_CANVASS_ASSIGNMENT = 'CREATE_CANVASS_ASSIGNMENT';
export const UPDATE_CANVASS_ASSIGNMENT = 'UPDATE_CANVASS_ASSIGNMENT';
export const RETRIEVE_CANVASS_ASSIGNMENT_ROUTES = 'RETRIEVE_CANVASS_ASSIGNMENT_ROUTES';
export const ADD_ROUTES_TO_CANVASS_ASSIGNMENT = 'ADD_ROUTES_TO_CANVASS_ASSIGNMENT';
export const REMOVE_ROUTES_FROM_CANVASS_ASSIGNMENT = 'REMOVE_ROUTE_FROM_CANVASS_ASSIGNMENT';

// Redux actions related to visits
export const RETRIEVE_HOUSEHOLD_VISITS = 'RETRIEVE_HOUSEHOLD_VISITS';

// Actions related to alert messages
export const POLL_ALERT_MESSAGES = 'POLL_ALERT_MESSAGES';

// Actions related to action import
export const PARSE_ACTION_IMPORT_FILE = 'PARSE_ACTION_IMPORT_FILE';
export const PROCESS_ACTION_IMPORT_DATA = 'PROCESS_ACTION_IMPORT_DATA';
