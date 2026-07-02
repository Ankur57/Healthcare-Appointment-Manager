import { useAuth }
from "../../context/AuthContext";

function WelcomeCard() {
  const { user } =
    useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-10 text-white shadow-lg">

      <h1 className="text-4xl font-bold">
        Welcome back,
        {user?.name} 👋
      </h1>

      <p className="mt-4 text-blue-100 text-lg">
        Manage your healthcare,
        appointments and medical
        records from one place.
      </p>

    </div>
  );
}

export default WelcomeCard;