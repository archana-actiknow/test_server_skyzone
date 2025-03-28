const AUTH = "/auth";
export const LOGIN = AUTH + "/login";
export const VERIFY = AUTH + "/verify";

const USER = "/user";
export const USERS = USER + "/fetch";
export const CHECKUSER = USER + "/check-user";
export const FIND_USER = USER + "/find-user";
export const USER_DETAIL = USER + "/details";
export const ADDUSER = USER + "/register";
export const UPDATE_USER = USER + "/update-user";
export const UPDATEPASSWORD = USER + "/change-password";
export const DELETEUSER = USER + "/delete/";

const REWARD = "/rewards";
export const REWARDS = REWARD + "/fetch";
export const NONREWARDS = REWARD + "/fetch-products";
export const ADDREWARD = REWARD + "/add-reward-rule";
export const UPDATEREWARD = REWARD + "/update-reward-rule";
export const DELETEREWARD = REWARD + "/delete/";

const ADDON = "/addons";
export const ADDONS = ADDON + "/fetch";
export const NONADDONS = ADDON + "/fetch-products";
export const CREATEADDON = ADDON + "/create";
export const DELETEADDON = ADDON + "/delete/";

const MENU = "/menu-items";
export const MENUITEMS = MENU + "/fetch";
export const NONMENUITEMS = MENU + "/fetch-products";
export const ADDMENU = MENU + "/add";
export const UPDATEMENUITEM = MENU + "/update";
export const DELETEMENUITEM = MENU + "/delete/";

const NOTIFICATION = "/push-notifications";
export const NOTIFICATIONS = NOTIFICATION + "/fetch";
export const ADDNOTIFY = NOTIFICATION + "/add";
export const FETCHNOTIFICATION = NOTIFICATION + "/fetch-single/";
export const UPDATENOTIFICATION = NOTIFICATION + "/update";
export const DELETENOTIFICATION = NOTIFICATION + "/delete/";

const PAYMENT = "/payment";
export const PAYMENT_LIST = PAYMENT + "/payment-list";
export const PAYMENT_REFUND = PAYMENT + "/refund";
export const SUBSCRIPTION_CANCEL = PAYMENT + "/cancel-sub";
export const PAYMENT_DETAILS = PAYMENT + "/payment-details";
export const FETCHSTRIPE = PAYMENT + "/stripe-integration";

const OFFERS = "/offers";
export const OFFERS_LIST = OFFERS + "/list";
export const OFFER_LIST = OFFERS + "/get-offer-details";
export const UPDATEOFFERRULE = OFFERS + "/update";
export const ADDOFFERRULE = OFFERS + "/add";
export const OFFERSPRODUCTS = OFFERS + "/get-products-parent";
export const OFFER_PRODUCT_DELETE = OFFERS + "/delete-offer-products";
export const OFFER_STATUS_UPDATE = OFFERS + "/update-offer-status";
export const OFFER_DELETE = OFFERS + "/delete-offer";

const SAMPLE = "/sample";
export const SAMPLECREATE = SAMPLE + "/create";
export const SAMPLELIST = SAMPLE + "/get-list";

const SCHEDULING = "/predicted-traffic";
export const TRAFFIC_PREDICTION = SCHEDULING + "/get-predictedTraffic";
export const HRS_COST_PREDICTION = SCHEDULING + "/get-schedulevsActual";
export const FUTURE_STAFF_LISTS = SCHEDULING + "/get-FutureStaffLists";
export const LISTSTAFFSETTINGS = SCHEDULING + "/get-staffSetting";
export const LISTSTAFFSETTINGST = SCHEDULING + "/get-staffSettingNext";
export const UPSTAFFSETTINGNEXT = SCHEDULING + "/save-staffSettingNext";
export const SHIFTCUSTOMIZATION = SCHEDULING + "/get-staffHours";
export const CREATESCHEDULE = SCHEDULING + "/create-schedule";
export const SAVESTAFFSETTING = SCHEDULING + "/save-staffSetting";
export const SAVESHIFTCUSTOMIZATION = SCHEDULING + "/save-staffhours";
export const GETHOIDAYCAL = SCHEDULING + "/get_holiday_setting";
export const HOLIDAYCALENDAR = SCHEDULING + "/save_holiday_setting";
export const DELETEHOLIDAYCALENDAR = SCHEDULING + "/delete_holiday_setting/";

const AVAILABLE_PRODUCTS = "/product-availability";
export const GET_PRODUCTS = AVAILABLE_PRODUCTS + "/get-products";
export const UPDATE_STATUS = AVAILABLE_PRODUCTS + "/update-product-status";
export const CREATETYPE = AVAILABLE_PRODUCTS + "/create_type";

//QUERIES
export const CUSTOMERQUERIES = "/customers_queries";
export const GENERALQUERIES = "/general_queries";
export const CUSTOMERQUERIESREPLY = "/customers_queries/reply";
export const STATUSCHANGE = "/queries_status_change";
export const GETCUSTOMERQUERIESPOINTS = "/get_points_details";

// MOBILE CUSTOMERS //
export const MOBCUSTOMERLIST = "/get_mobile_customers";

// LOCATION MANAGERS //
const MANAGER = "/manager";
export const LISTMANAGERS = MANAGER + "/fetch";
export const ADDMANAGER = MANAGER + "/create";
export const FETCHMANAGER = MANAGER + "/details";
export const UPDATEMANAGER = MANAGER + "/update";
export const UPDATEMANAGERSTATUS = MANAGER + "/status_update";

//LOCATION SETUP
const LOCATIONS = "/locations";
export const LISTLOCATIONS = LOCATIONS + "/fetch";
export const ADDLOCATIONS = LOCATIONS + "/create";
export const FETCHLOCATIONS = LOCATIONS + "/details";
export const UPDATELOCATION = LOCATIONS + "/update";
export const UPDATESTATUSCHANGE = LOCATIONS + "/status_update";

// HOME
export const FETCH_LOCATIONS = "/fetch-location";
export const ADDCUSTOMERPOINTS = "/add_reward_points";


//Kitchen Slider Images
export const ADD_KITCHEN_SLIDER_IMAGES = MENU +  "/upload_carousal_images";
export const GET_KITCHEN_SLIDER_IMAGES = MENU + "/fetch_carousal_images";
export const UPDATE_KITCHEN_SLIDER_IMAGES = MENU + "/update_carousal_images";
export const DELETE_KITCHEN_SLIDER_IMAGES = MENU + "/delete_carousal_images/";

//memebership discount
const MEMBERSHIPDISCOUNT = "/discount_code";
export const ADDMEMBERSHIPDISCOUNT = MEMBERSHIPDISCOUNT + "/create";
export const FETCHMEMBERSHIPDISCOUNT = MEMBERSHIPDISCOUNT + "/fetch";
export const SINGLEMEMBERSHIPDISCOUNT = MEMBERSHIPDISCOUNT + "/details";
export const UPDATEMEMBERSHIPDISCOUNT = MEMBERSHIPDISCOUNT + "/update";
export const DELETEMEMBERSHIPDISCOUNT = MEMBERSHIPDISCOUNT + "/status_update";
