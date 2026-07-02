import SidebarLayout from "./SidebarLayout";

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Manage Doctors", href: "/admin/doctors", icon: "👨‍⚕️" },
];

export default function AdminLayout() {
  return <SidebarLayout links={adminLinks} />;
}
