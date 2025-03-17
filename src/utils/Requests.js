import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/Common";
// import { useEffect, useRef, useState } from "react";

const baseURL = process.env.REACT_APP_API_URL;
const getHeader = async (token = false, up_file = false) => {
  const auth = token ? { Authorization: `Bearer ${token}` } : {};
  const file_header = up_file
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-type": "application/json" };
  return {
    "x-authorization": process.env.REACT_APP_X_API_KEY,
    ...(token && auth),
    ...file_header,
  };
};

// POST WITHOUT TOKEN
export const PostRequest = async (endpoint, data) => {
  let url = baseURL + endpoint;

  try {
    const headers = await getHeader();
    const res = await axios.post(url, data, { headers });
    return { status: true, data: res };
  } catch (error) {
    return { status: false, data: error };
  }
};

// USE REQUEST //
export const useRequest = () => {
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();

  const api = axios.create({ baseURL: baseURL });

  const request = async (config, up_file = false, auth = true) => {
    if (auth) {
      const headers = await getHeader(user.token, up_file);

      config.headers = {
        ...config.headers,
        ...headers,
      };
    }

    try {
      const res = await api(config);

      return res.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        dispatch({ type: "LOGOUT" });
        navigate("/");
      }
    }
  };

  return request;
};

// Common function for making HTTP requests
export const PostAuthRequest = async (endpoint, method, data = {}) => {
  const token = getToken();
  const header = await getHeader(token);

  if (!token) {
    // Handle no token scenario, such as throwing an error or managing it in another way
    throw new Error("No authentication token found.");
  }

  try {
    const config = {
      method: method,
      url: `${baseURL}${endpoint}`,
      data: method === "POST" || method === "PUT" ? data : undefined,
      params: method === "GET" || method === "get" ? data : undefined,
      headers: header,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Handle errors as needed
    console.error("API request error:", error);
    // Optionally handle logout or other actions here
    throw error; // Re-throw the error if you want to handle it at a higher level
  }
};

// const headers = {
//   "Content-type": "application/json",
//   "x-authorization": process.env.REACT_APP_X_API_KEY,
// };

// const api_axios = axios.create({
//   baseURL: baseURL,
//   headers: headers,
// });

// CALL API HOOK
// export const useAuthFetch = (initialConfig, auth = true) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState(false);
//   const navigate = useNavigate();
//   const { dispatch, user } = useAuthContext();
//   const token = auth ? user.token : false;

//   const configRef = useRef(initialConfig);

//   useEffect(() => {
//     let source = axios.CancelToken.source();

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const headers = {
//           ...api_axios.defaults.headers,
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         };

//         const response = await api_axios({
//           ...configRef.current,
//           headers,
//           cancelToken: source.token,
//         });

//         setData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.log(error);

//         if (
//           error.response &&
//           (error.response.status === 401 || error.response.status === 403)
//         ) {
//           setErr(true);
//         } else if (axios.isCancel(error)) {
//           console.log("Request canceled:", error.message);
//         } else {
//           console.error("Error fetching data:", error);
//         }
//         setLoading(false);
//       }
//     };

//     // Check if config has necessary properties and token exists
//     if (configRef.current && configRef.current.url && token) {
//       fetchData().then(() => {
//         source = axios.CancelToken.source();
//       });

//       return () => {
//         source.cancel(
//           "Request canceled - Component unmounted or config/token changed"
//         );
//       };
//     }
//   }, [token]); // Only depend on token, configRef.current is used inside useEffect

//   // Update configRef.current when initialConfig changes
//   useEffect(() => {
//     configRef.current = initialConfig;
//   }, [initialConfig]);

//   if (err) {
//     dispatch({ type: "LOGOUT" });
//     navigate("/");
//   } else return { data, loading };
// };
