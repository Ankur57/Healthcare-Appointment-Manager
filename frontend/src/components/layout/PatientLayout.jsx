import SidebarLayout from "./SidebarLayout";

const patientLinks = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Find Doctors", href: "/dashboard/doctors", icon: "👨‍⚕️" },
  { name: "My Appointments", href: "/dashboard/appointments", icon: "📅" },
];

export default function PatientLayout() {
  return <SidebarLayout links={patientLinks} />;
}
