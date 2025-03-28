import * as yup from "yup";
// import { PostAuthRequest } from "./Requests";
// import { CHECKUSER } from "./Endpoints";

export const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required.")
    .matches(/^[a-z0-9]+$/, 'Username should only contain lowercase letters and numbers without spaces')
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot be longer than 20 characters'),
  password: yup.string().min(5).required("Password is required."),
});

export const otpValidationSchema = yup.object().shape({
  otpToken: yup
    .number()
    .integer('Must be an integer')
    .typeError('Must be a number')
    // .test(
    //   'min-digits',
    //   'Must be at least 6 digits',
    //   value => {
    //     // Check if the value is valid and has at least 6 digits
    //     return value && value.toString().length >= 6;
    //   }
    // )
    .required('Field is required')
    // .required("OTP is required.")
    // .min(6, 'OTP must be at least 6 digits long.'),
});

export const userValidationSchema = yup.object().shape({
  username: yup.string().required("Username is required.")
    .matches(/^[a-z0-9]+$/, 'Username should only contain lowercase letters and numbers without spaces')
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot be longer than 20 characters'),
    // .test('check-username', 'Username already exists', async (value) => {
    //   if (!value) return true; // Skip if value is empty
    //   try {
    //     const response = await PostAuthRequest(CHECKUSER, "POST", { username: value });
    //     return !response.data.found; // Assuming the response contains an `available` field
    //   } catch (error) {
    //     console.error('Error checking username availability', error);
    //     return false; // Treat as invalid if there was an error
    //   }
    // }),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  name: yup.string().required("Name is required."),
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
  contact: yup.string().matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits').required('Contact number is required'),
  // role: yup.string().required("Please select user role."),
});

export const userEditValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  name: yup.string().required("Name is required."),
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
  contact: yup.string().matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits').required('Contact number is required'),
});

export const rewardValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  points: yup.number().typeError("Points must be a number.").required('Points are required').positive('Must be greater than zero'),
  discountCode: yup.string().required('Discount code is required'),
  thumbnail: yup.mixed('Invalid Image.'),
});

export const pushNotificationValidationSchema = yup.object().shape({
  allLocations: yup.bool().oneOf([true], "Please select locations."),
  title: yup.string().required("Title is required."),
  message: yup.string().required("Message is required."),
  notifyDate: yup
    .date()
    .min(new Date(), "Can't add previous dates.")
    .required("Date is required."),
  notifyTimeH: yup.string().required("This field is required."),
  notifyTimeS: yup.string().required("This field is required."),
  notifyTimeAP: yup.string().required("This field is required."),
  customerTimezone: yup.string().required("This field is required."),
});

export const latestOfferingValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  startDate: yup
    .date()
    .min(new Date(), "Can't add previous dates.")
    .required("Start date is required."),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date can't be before start date.")
    .required("End date is required."),
  campaignType: yup.string().required("Campaign type is required."),
  rewardPoint: yup.string().when("campaignType", ([campaignType], schema) => {
    if (campaignType === "1") return yup.number().required("Reward points are required.");
    return schema;
  }),
  discountCode: yup.string().when("campaignType", ([campaignType], schema) => {
    if (campaignType === "2") return yup.string().required("Discount code is required.");
    return schema;
  }),
  discountAmount: yup.string().when('campaignType', ([campaignType], schema) => {
    if (campaignType === "2") return yup.string().nullable(); 
    return schema;
  }),
  discountPercent: yup.string().when(['campaignType', 'discountAmount'], ([campaignType, discountAmount], schema) => {
    if (campaignType === "2" && (discountAmount === '' || discountAmount === undefined)) 
      return yup.string().required("At least one of discount amount or percentage must be filled");
    return schema;
  })
})

export const menuItemsValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  // price: yup.number().typeError("Price must be a number.").required('Price is required').positive('Must be greater than zero'),
  description: yup.string().required('Description is required'),
  // thumbnail: yup.mixed('Invalid Image.'),
})

export const menuItemsAddValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  // price: yup.number().typeError("Price must be a number.").required('Price is required').positive('Must be greater than zero'),
  description: yup.string().required('Description is required'),
  // thumbnail: yup.mixed('Invalid Image.').required("Thumbnail is required."),
})

export const pushNotificationSchema = yup.object().shape({
  title: yup.string().required("Title is required."),
  message: yup.string().required("Message is required."),
  notifyDate: yup
    .date()
    .min(new Date(), "Can't add previous dates.")
    .required("Date is required."),
  notifyTimeH: yup.string().required("This field is required."),
  notifyTimeS: yup.string().required("This field is required."),
  notifyTimeAP: yup.string().required("This field is required."),
  customerTimezone: yup.string().required("This field is required."),
});

export const editPushNotificationSchema = yup.object().shape({
  title: yup.string().required("Title is required."),
  message: yup.string().required("Message is required."),
  notifyDate: yup
    .date()
    // .min(new Date(), "Can't add previous dates.")
    .required("Date is required."),
  notifyTimeH: yup.string().required("This field is required."),
  notifyTimeS: yup.string().required("This field is required."),
  notifyTimeAP: yup.string().required("This field is required."),
  customerTimezone: yup.string().required("This field is required."),
});

export const changePasswordValidationSchema = yup.object({
  currentPassword: yup.string().required("Current password is required."),
  newPassword:yup
    .string()
    .required("New password is required.")
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmNewPassword: yup.string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match.")
    .required("Please confirm your new password."),
});

export const accountDelVelidationSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required')
    .test('is-valid-username', 'Username must be a valid email or phone number', value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  reason: yup.string().required("Reason is mandatory.")
});

export const managerValidation = yup.object().shape({
  fname: yup.string().required("First name is required."),
  lname: yup.string().required("Last name is required."),
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
  contact: yup.string().matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits').required('Contact number is required'),
  designation: yup.string().required("Designation is required."),
})

export const check_user_validation = (username) => {
  if (!username) {
    return [false, 'Username is required.'];
  } else if (!/^[a-z0-9]+$/.test(username)) {
    return [false, 'Username should only contain lowercase letters and numbers without spaces.'];
  } else if (username.length < 3) {
    return [false, 'Username must be at least 3 characters long.'];
  } else if (username.length > 20) {
    return [false, 'Username cannot be longer than 20 characters.'];
  } else {
    return [true];
  }
}

export const check_location_validation = (location) => {
  if (!location) {
    return [false, 'location is required.'];
  } else {
    return [true];
  }
}

export const sendReply =  yup.object({
  reply: yup.string().required("Reply is required"),
});

export const imageValidation =  yup.object({
  image: yup.string().required("image is required"),
});

export const validationSchema = yup.object({
  client_name: yup.string().required('Client name is required'),
  location: yup.string().required('Location is required'),
  latitude: yup.number().typeError('Latitude must be a number').required('Latitude is required'),
  longitude: yup.number().typeError('Longitude must be a number').required('Longitude is required'),
  client_code: yup.string().required('Client code is required'),
  client_email: yup.string().email('Invalid email').required('Client email is required'),
  order_email: yup.string().email('Invalid email').required('Order email is required'),
  reply_to: yup.string().email('Invalid email').required('Reply to email is required'),
  humanity_key: yup.string().required('Humanity key is required'),
  humanity_username: yup.string().required("Username is required.")
    .matches(/^[a-z0-9]+$/, 'Username should only contain lowercase letters and numbers without spaces')
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot be longer than 20 characters'),
  humanity_password: yup.string().min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  stripe_account_id: yup.string().required('Stripe account ID is required'),
  version: yup.string().required('Version is required'),
  website: yup.string().url('Invalid URL').required('Website is required'),
  waiver_text: yup.string().required('Waiver text is required'),
  phone_number: yup.string().matches(/^[0-9]{10}$/, "Must be a valid phone number").required('Phone number is required'),
  topic_name: yup.string().required('Topic name is required'),
  address:yup.string().required('Address is required'),
  weiver_url:yup.string().required('Weiver Url is required'),
  customerTimezone: yup.string().required('Timezone is required'),
  can_access: yup.string().required('Access level is required'),
  country_type: yup.string().required('Country is required'),
});

export const addMobileUsersPoints = yup.object({
  points: yup.string().required("points is required"),
  reason:  yup.string().required("Reason is required")
});

export const holidayCalendarValidation = yup.object().shape({
  holiday_desc: yup.string().required("holiday description is required."),
  start_date: yup.string().required("start date is required."),
  end_date: yup.string().required("end date is required."),
  type: yup.string().required("type is required."),
  start_time: yup.string().required('start time is required'),
  end_time: yup.string().required("end time is required."),
});

export const addMembershipDiscount = yup.object().shape({
  discountCode:yup.string().required("discount code is required"),
  selectedProduct:yup.string().required("select products"),
})