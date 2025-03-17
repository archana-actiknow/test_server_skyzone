import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./pages/auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TwoFactorAuth from "./pages/auth/TwoFactorAuth";
import Users from "./pages/users/Users";
import Rewards from "./pages/rewards/Rewards";
import Auth from "./utils/Auth";
import Offers from "./pages/offerings/Offers";
import AddRewardRule from "./pages/rewards/AddRewardRule";
import Addons from "./pages/addons/Addons";
import CreateAddon from "./pages/addons/CreateAddon";
import MenuItems from "./pages/menu/MenuItems";
import PushNotifications from "./pages/push_notifications/PushNotifications";
import AddNotification from "./pages/push_notifications/AddNotification";
import EditNotification from "./pages/push_notifications/EditNotification";
import AddRule from "./pages/offerings/AddRules";
import Payments from "./pages/payments/Payment";
import EditRule from "./pages/offerings/EditRules";
import StripeIntegration from "./pages/stripe/StripeIntegration";
import ProfileSettings from "./pages/profile/ProfileSettings";
import ChangePassword from "./pages/profile/ChangePassword";
import AddMenuItems from "./pages/menu/AddMenuItems";
import AccountDeleteRequest from "./pages/auth/AccountDeleteRequest";
import { IsAgent, IsSuperAdmin, IsUser } from "./utils/Common";
import Scheduling from "./pages/cost_optimization/Scheduling";
import Products from "./pages/mobile_avail_products/Products";
import CustomerQueries from "./pages/queries/CustomerQueries";
import HolidayCalendar from "./pages/location_setup/HolidayCalendar";
import List from "./pages/locatoin_user_setup/List";
import MobileCustomers from "./pages/mobile_users/List";
import GeneralQueries from "./pages/queries/GeneralQueries";
import EncDec from "./pages/users/EncDec";
import LocationSetup from "./pages/location_setup/LocationSetup";
import AddLocations from "./pages/location_setup/AddLocations";
import EditLocation from "./pages/location_setup/EditLocations";

import KitchenSlider from "./pages/slider/KitchenSlider";

function App() {
  const humanityRoute = [
    {
      path: "/scheduling",
      element: (
        <Auth title="Scheduling">
          <Scheduling />
        </Auth>
      ),
    },
    {
      path: "/enc-dec",
      element: (
        <Auth title="Encrypt Decrypt">
          <EncDec />
        </Auth>
      ),
    },
  ];

  const userRoutes = [
    {
      path: "/users",
      element: (
        <Auth title="User Management" adminOnly={true}>
          <Users />
        </Auth>
      ),
    },
    {
      path: "/location-setup",
      element: (
        <Auth title="Locations Setup">
          <LocationSetup />
        </Auth>
      ),
    },
    {
      path: "/add-locations",
      element: (
        <Auth title="Add Locations">
          <AddLocations />
        </Auth>
      ),
    },
    {
      path: "/edit-location",
      element: (
        <Auth title="Edit Locations">
          <EditLocation />
        </Auth>
      ),
    },
    {
      path: "/push-notifications",
      element: (
        <Auth title="Push Notifications">
          <PushNotifications />
        </Auth>
      ),
    },
    {
      path: "/add-notification",
      element: (
        <Auth title="Add Notifications">
          <AddNotification />
        </Auth>
      ),
    },
    {
      path: "/edit-notification",
      element: (
        <Auth title="Edit Notifications">
          <EditNotification />
        </Auth>
      ),
    },
    {
      path: "/holiday-calendar",
      element: (
        <Auth title="Holiday Calendar">
          <HolidayCalendar />
        </Auth>
      ),
    },
  ];

  const allRoutes = [
    {
      path: "/location-manager-setup",
      element: (
        <Auth title="Manager Setup">
          <List />
        </Auth>
      ),
    },
    {
      path: "/mobile-users",
      element: (
        <Auth title="Mobile Users">
          <MobileCustomers />
        </Auth>
      ),
    },
    {
      path: "/rewards",
      element: (
        <Auth title="Rewards">
          <Rewards />
        </Auth>
      ),
    },
    {
      path: "/add-reward-rule",
      element: (
        <Auth title="Add Rule">
          <AddRewardRule />
        </Auth>
      ),
    },
    {
      path: "/latest-offerings",
      element: (
        <Auth title="Latest Offerings">
          <Offers />
        </Auth>
      ),
    },
    {
      path: "/stripe",
      element: (
        <Auth title="Stripe Integration">
          <StripeIntegration />
        </Auth>
      ),
    },
    {
      path: "/payments",
      element: (
        <Auth title="Payments">
          <Payments />
        </Auth>
      ),
    },
    {
      path: "/update-offer",
      element: (
        <Auth title="Update Offer">
          {/* <UpdateRule /> */}
          <EditRule />
        </Auth>
      ),
    },
    {
      path: "/add-offer",
      element: (
        <Auth title="Add Offer">
          <AddRule />
        </Auth>
      ),
    },
    {
      path: "/addons",
      element: (
        <Auth title="Addons">
          <Addons />
        </Auth>
      ),
    },
    {
      path: "/create-addons",
      element: (
        <Auth title="Create Addons">
          <CreateAddon />
        </Auth>
      ),
    },
    {
      path: "/menu-items",
      element: (
        <Auth title="Menu Items">
          <MenuItems />
        </Auth>
      ),
    },
    {
      path: "/add-menu-items",
      element: (
        <Auth title="Menu Items">
          <AddMenuItems />
        </Auth>
      ),
    },

    {
      path: "/menu-slider",
      element: (
        <Auth title="Slider Image">
          <KitchenSlider />
        </Auth>
      ),
    },

    {
      path: "/profile",
      element: (
        <Auth title="Edit Profile">
          <ProfileSettings />
        </Auth>
      ),
    },
    {
      path: "/change-password",
      element: (
        <Auth title="Change Password">
          <ChangePassword />
        </Auth>
      ),
    },
    {
      path: "/mobile-available-products",
      element: (
        <Auth title="Products">
          <Products />
        </Auth>
      ),
    },
  ];

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/two-factor-auth", element: <TwoFactorAuth /> },
    { path: "/account-delete-request", element: <AccountDeleteRequest /> },
    {
      path: "/customer-queries",
      element: (
        <Auth title="Customer Queries">
          <CustomerQueries />
        </Auth>
      ),
    },
    {
      path: "/general-queries",
      element: (
        <Auth title="General Queries">
          <GeneralQueries />
        </Auth>
      ),
    },
    ...(!IsUser && !IsAgent ? userRoutes : []),
    ...(!IsAgent ? allRoutes : []),
    ...(IsSuperAdmin ? humanityRoute : []),
  ]);

  return <RouterProvider router={router} />;
}

export default App;
