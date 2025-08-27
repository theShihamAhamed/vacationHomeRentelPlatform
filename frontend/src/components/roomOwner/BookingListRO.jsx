import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CalendarCheck,
  Trash2,
  Download,
} from "lucide-react";
import { useBookingStore } from "../../stores/useBookingStore";

const BookingsList = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const { bookings, fetchBookingsByOwnerId, completeBooking, loading } = useBookingStore();

  const ownerId = "64f5a2d9f2d7b23e5a1f2b22";

  // Load active bookings
  useEffect(() => {
  fetchBookingsByOwnerId(ownerId);
}, [ownerId]);

  // Pagination
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const currentBookings = bookings.slice(
    startIndex,
    startIndex + bookingsPerPage
  );

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

const completeButtonClicked = async (bookingId) => {
  try {
    await completeBooking(bookingId); // complete the booking
    await fetchBookingsByOwnerId(ownerId); // refetch updated bookings
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-29">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by guest name, property, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none w-80"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{bookings.length}</span> bookings
                found
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Booking ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{booking._id.slice(-6)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.fullName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.phoneNumber}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {booking.idCardNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.homeId?.title}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.homeId?.location?.city},{" "}
                        {booking.homeId?.location?.province}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.bookedDates?.length} nights
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Check-in:</span>
                        </div>
                        <div className="text-gray-600 ml-6">
                          {formatDate(booking.checkInDate)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-900 mt-2">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Check-out:</span>
                        </div>
                        <div className="text-gray-600 ml-6">
                          {formatDate(booking.checkOutDate)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {calculateNights(
                          booking.checkInDate,
                          booking.checkOutDate
                        )}{" "}
                        nights
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${booking.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        $
                        {Math.round(
                          booking.totalPrice /
                            calculateNights(
                              booking.checkInDate,
                              booking.checkOutDate
                            )
                        ).toLocaleString()}
                        /night
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors duration-200">
                          <CalendarCheck
                            onClick={() => completeButtonClicked(booking._id)}
                            className="h-4 w-4"
                          />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No bookings have been made yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsList;
