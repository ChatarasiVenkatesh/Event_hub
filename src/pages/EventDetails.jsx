import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";



export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendeesData, setAttendeesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setEvent(eventData);

          if (Array.isArray(eventData.attendees) && eventData.attendees.length > 0) {
            const users = [];
            for (const uid of eventData.attendees) {
              const userRef = doc(db, "users", uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                users.push(userSnap.data());
              }
            }
            setAttendeesData(users);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="p-6 text-gray-500 dark:text-gray-300">Loading...</div>;
  if (!event) return <div className="p-6 text-red-500 dark:text-red-400">Event not found</div>;

  const totalRegistered = attendeesData.length;
  const totalRevenue = totalRegistered * (event.price || 0);

  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-200">

      {/* Image */}
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full max-w-lg rounded-lg shadow-lg"
        />
      )}

      {/* Title + Description Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-2">{event.title || "Untitled Event"}</h1>
        <p className="text-gray-700 dark:text-gray-300">{event.description || "No description"}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Registered" value={totalRegistered} />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard label="Capacity" value={event.capacity || "N/A"} />
        <StatCard label="Category" value={event.category || "N/A"} />
        <StatCard label="Date" value={event.date || "N/A"} />
        <StatCard label="Time" value={event.time || "N/A"} />
        <StatCard label="Location" value={event.location || "N/A"} />
        <StatCard label="Online Event" value={event.isOnline ? "Yes" : "No"} />
      </div>

      {/* Attendees Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Attendees</h2>
        {attendeesData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No attendees yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Name</th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Email</th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {attendeesData.map((att, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 p-2">{att.name || "N/A"}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">{att.email || "N/A"}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">{att.phone || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
