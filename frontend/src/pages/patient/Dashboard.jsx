import WelcomeCard from "../../components/patient/WelcomeCard";
import DashboardStats from "../../components/patient/DashboardStats";
import QuickActions from "../../components/patient/QuickActions";
import AppointmentCard from "../../components/patient/AppointmentCard";
import UpcomingAppointmentCard from "../../components/patient/UpcomingAppointment";

function Dashboard() {
  return (
    <div className="space-y-8">

      <WelcomeCard />

      <DashboardStats />

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <UpcomingAppointmentCard />
        </div>

        <QuickActions />

      </div>

    </div>
  );
}

export default Dashboard;