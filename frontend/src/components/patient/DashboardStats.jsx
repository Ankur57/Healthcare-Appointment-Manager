import {
  FaCalendarCheck,
  FaUserMd,
  FaHistory,
} from "react-icons/fa";

function DashboardStats() {
  const stats = [
    {
      title:
        "Appointments",
      value: "5",
      icon:
        <FaCalendarCheck />,
      color:
        "bg-blue-500",
    },
    {
      title:
        "Doctors",
      value: "12",
      icon:
        <FaUserMd />,
      color:
        "bg-green-500",
    },
    {
      title:
        "History",
      value: "14",
      icon:
        <FaHistory />,
      color:
        "bg-purple-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {stats.map(
        (
          stat,
          index
        ) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-md"
          >
            <div
              className={`${stat.color} w-16 h-16 rounded-2xl text-white text-3xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>

            <h2 className="text-4xl font-bold mt-6">
              {stat.value}
            </h2>

            <p className="text-gray-500 mt-2">
              {stat.title}
            </p>
          </div>
        )
      )}

    </div>
  );
}

export default DashboardStats;