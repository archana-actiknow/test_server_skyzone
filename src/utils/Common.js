import CryptoJS from "crypto-js";
import SweetAlert from "../components/SweetAlert";

const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_RIVETTE_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_IV);

export const holidayTypes = [
  { id: 1, label: "Open", value: 1 },
  { id: 2, label: "Open as usual", value: 2 },
  { id: 3, label: "Close", value: 3 },
];

export const timezones = [
  { id: 1, value: "America/New_York", label: "Eastern Time" },
  { id: 2, value: "America/Chicago", label: "Central Time" },
  { id: 3, value: "America/Denver", label: "Mountain Time" },
  { id: 4, value: "America/Phoenix", label: "Mountain Time (no DST)" },
  { id: 5, value: "America/Los_Angeles", label: "Pacific Time" },
  { id: 6, value: "America/Anchorage", label: "Alaska Time" },
  { id: 7, value: "America/Adak", label: "Hawaii-Aleutian" },
  { id: 8, value: "Pacific/Honolulu", label: "Hawaii-Aleutian Time (no DST)" },
];

export const timeH = [
  { id: 1, value: "01", label: "01" },
  { id: 2, value: "02", label: "02" },
  { id: 3, value: "03", label: "03" },
  { id: 4, value: "04", label: "04" },
  { id: 5, value: "05", label: "05" },
  { id: 6, value: "06", label: "06" },
  { id: 7, value: "07", label: "07" },
  { id: 8, value: "08", label: "08" },
  { id: 9, value: "09", label: "09" },
  { id: 10, value: "10", label: "10" },
  { id: 11, value: "11", label: "11" },
  { id: 12, value: "12", label: "12" },
];

export const timeS = [
  { id: 0, value: "00", label: "00" },
  { id: 5, value: "05", label: "05" },
  { id: 10, value: "10", label: "10" },
  { id: 15, value: "15", label: "15" },
  { id: 20, value: "20", label: "20" },
  { id: 25, value: "25", label: "25" },
  { id: 30, value: "30", label: "30" },
  { id: 35, value: "35", label: "35" },
  { id: 40, value: "40", label: "40" },
  { id: 45, value: "45", label: "45" },
  { id: 50, value: "50", label: "50" },
  { id: 55, value: "55", label: "55" },
  { id: 60, value: "60", label: "60" },
];

export const timeA = [
  { id: 1, value: "AM", label: "AM" },
  { id: 2, value: "PM", label: "PM" },
];

export const list_per_page_items = [
  { id: 5, label: "5", value: 5 },
  { id: 10, label: "10", value: 10 },
  { id: 15, label: "15", value: 15 },
  { id: 20, label: "20", value: 20 },
  { id: 25, label: "25", value: 25 },
  { id: 50, label: "50", value: 50 },
  { id: 100, label: "100 ", value: 100 },
];

export const items_per_page = 10;

export const campaign_types = [
  { id: 1, label: "Rewards program", value: "1" },
  { id: 2, label: "Discount offer", value: "2" },
  { id: 3, label: "Special products", value: "3" },
];

export const discount_type = [
  { id: 1, label: "Amount :", value: "0" },
  { id: 2, label: "Percentage :", value: "1" },
];

export const offer_type = [
  { id: 1, label: "Membership", value: "1" },
  { id: 2, label: "Birthday Packages", value: "2" },
  { id: 3, label: "Ticket Purchase", value: "3" },
];

export const cards = [
  { id: 1, label: "Memberships", value: "1" },
  { id: 2, label: "Birthday Parties", value: "2" },
  { id: 3, label: "Jump Tickets", value: "3" },
];

// export const cardsMembership = [
//   { id: 1, label: "Memberships", value: "1" },
//   { id: 2, label: "Birthday Parties", value: "2" },
//   { id: 3, label: "Jump Tickets", value: "3" },
//   { id: 4, label: "Fuel Zone", value: "4" },
// ];

export const cardsMembership = [...cards, { id: 4, label: "Fuel Zone", value: "4" }];

export const available_prd_category = [
  "addon",
  "membership",
  "package",
  "sessionpass",
];

export const display_offer_to = [
  { id: 1, label: "All Customers", value: "0" },
  { id: 2, label: "Members only", value: "1" },
];

export const status = [
  { id: 1, label: "Active", value: "1" },
  { id: 2, label: "Inactive", value: "0" },
];

export const statusChange = [
  { id: 1, label: "Open", value: "0" },
  { id: 2, label: "In Progress", value: "1" },
  { id: 3, label: "Closed", value: "2" },
];

export const FilterstatusChange = [
  { id: -1, label: "", value: "" },
  { id: 0, label: "All", value: "3" },
  { id: 1, label: "Open", value: "0" },
  { id: 2, label: "In Progress", value: "1" },
  { id: 3, label: "Closed", value: "2" },
];

export const country_type = [
  { id: 1, label: "Canada", value: "0" },
  { id: 2, label: "USA", value: "1" },
];

export const can_access = [
  { id: 1, label: "Yes", value: "0" },
  { id: 2, label: "No", value: "1" },
];

// function to get the token from local storage
export const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  return user?.token;
};

// export const user_roles = [
//   { id: 1, value: 1, label: "Superadmin" },
//   { id: 2, value: 2, label: "Admin" },
//   { id: 3, value: 3, label: "User" },
// ];



export const weekdays = [
  { id: 0, value: "Sunday", label: "Sunday", shortLabel: "SUN" },
  { id: 1, value: "Monday", label: "Monday", shortLabel: "MON" },
  { id: 2, value: "Tuesday", label: "Tuesday", shortLabel: "TUE" },
  { id: 3, value: "Wednesday", label: "Wednesday", shortLabel: "WED" },
  { id: 4, value: "Thursday", label: "Thursday", shortLabel: "THU" },
  { id: 5, value: "Friday", label: "Friday", shortLabel: "FRI" },
  { id: 6, value: "Saturday", label: "Saturday", shortLabel: "SAT" },
];

export const getWeekNumber = (date) => {
  const target = new Date(date.valueOf());
  target.setDate(target.getDate() + 4 - (target.getDay() || 7));
  const yearStart = new Date(target.getFullYear(), 0, 1);
  return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
};

// Decrypt function
const decrypt = (encryptedMessage) => {
  // Decrypt the message
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    // Convert decrypted data to string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.log("Error", error);
    return "";
  }
};

const getRole = async () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const decUser = user !== null ? decrypt(user?.user?.role.toString()) : "";
  return decUser;
};

let IsSuperAdmin = false; // getRole() === "1" ? true : false
let IsAdmin = false; // getRole() === "2" ? true : false
let IsUser = false; // getRole() === "3" ? true : false
let IsAgent = false; // getRole() === "4" ? true : false;

getRole().then((role) => {
  IsSuperAdmin = role === "1";
  IsAdmin = role === "2";
  IsUser = role === "3";
  IsAgent = role === "4";
});

export const IsRoleSuperAdmin = (role) => (role === "1" ? true : false);
export const IsRoleAdmin = (role) => (role === "2" ? true : false);
export const IsRoleUser = (role) => (role === "3" ? true : false);
export const IsRoleAgent = (role) => (role === "4" ? true : false);

const user_role = () => {
  if (IsRoleSuperAdmin) {
    return [
      { id: 1, value: 1, label: "Superadmin" },
      { id: 2, value: 2, label: "Admin" },
      { id: 3, value: 3, label: "User" },
      { id: 4, value: 4, label: "Call-Center Agent" },
    ];
  } else {
    return [
      { id: 2, value: 2, label: "Admin" },
      { id: 3, value: 3, label: "User" },
      { id: 4, value: 4, label: "Call-Center Agent" },
    ];
  }
};

export const user_roles = user_role();

export const sa_user_roles = [
  { id: 1, value: 1, label: "Superadmin" },
  { id: 2, value: 2, label: "Admin" },
  { id: 3, value: 3, label: "User" },
  { id: 4, value: 4, label: "Call-Center Agent" },
];

export const a_user_roles = [
  { id: 2, value: 2, label: "Admin" },
  { id: 3, value: 3, label: "User" },
  { id: 4, value: 4, label: "Call-Center Agent" },
];

// Export the function
export { decrypt, getRole, IsAdmin, IsSuperAdmin, IsUser, IsAgent };

// Encrypt function
export const encrypt = (plaintext) => {
  // Encrypt the message
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  // Return the encrypted data as a base64 string
  return encrypted.toString();
};

export const messagePop = (response) => {
  if (response.status === "success") {
    SweetAlert.success("Success", response.message);
  } else if (response.status === "Info") {
    SweetAlert.info(response.status, response.message);
  } else if (response.status === "Warning") {
    SweetAlert.warning(response.status, response.message);
  } else if (response.status === "failed") {
    SweetAlert.warning(response.status, response.message);
  }
};

export const currencyFormat = (amount) => {
  if (isNaN(amount)) {
    return "$0"; // Handle invalid values
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Change this to your desired currency
    minimumFractionDigits: 2, // Ensure at least 2 decimal places
    maximumFractionDigits: 2, // Ensure at most 2 decimal places
  }).format(amount);
};

export const encodeStringToUTF8 = (str) => {
  const encoder = new TextEncoder();
  const encodedBytes = encoder.encode(str); // This returns a Uint8Array
  return encodedBytes;
};

// Decode UTF-8 bytes back to string
export const decodeUTF8String = (bytes) => {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};
