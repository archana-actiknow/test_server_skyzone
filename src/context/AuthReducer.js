import { decrypt } from "../utils/Common";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      let role_id = decrypt(action?.payload?.user?.user?.role);
      return {
        isLoggedIn: true,
        isLoading: false,
        role: {
          id: role_id,
          IsSuperAdmin: role_id === "1" || false,
          IsAdmin: role_id === "2" || false,
          IsUser: role_id === "3" || false,
          IsAgent: role_id === "4" || false,
        },
        user: action?.payload?.user || null,
      };

    case "LOGOUT":
      return {
        isLoggedIn: false,
        isLoading: null,
        role: null,
        socketId: null,
        user: null,
      };

    default:
      return state;
  }
};

export default AuthReducer;
