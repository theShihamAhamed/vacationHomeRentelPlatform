import React from "react";
import Dashboard from "./Dashboard";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react";
import UserManagement from "./UserManagement";
import RoomManagement from "./RoomManagement";

const ContentArea = ({ activeSection }) => {
  if (activeSection === "dashboard") {
    return <Dashboard />;
  }

  if (activeSection === "users") {
    return <UserManagement />;
  }
  
  if (activeSection === "allrooms") {
    return <RoomManagement />;
  }
};

export default ContentArea;
