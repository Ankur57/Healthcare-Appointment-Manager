import SidebarLayout from "./SidebarLayout";

const doctorLinks = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: "📊" },
  { name: "Appointments", href: "/doctor/appointments", icon: "📅" },
];

export default function DoctorLayout() {
  return <SidebarLayout links={doctorLinks} />;
}
