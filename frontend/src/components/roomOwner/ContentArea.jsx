import Dashboard from "./Dashboard";
import AddNewHome from "./AddHome";
import BookingsList from "./BookingListRO";

const ContentArea = ({ activeSection }) => {
  if (activeSection === "dashboard") {
    return <Dashboard />;
  }

  if (activeSection === "add-home") {
    return <AddNewHome />;
  }

  if (activeSection === "all-bookings") {
    return <BookingsList />;
  }
};

export default ContentArea;
