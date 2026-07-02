import {
  Navigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { FullPageLoader } from "../components/ui/Loader";

function ProtectedRoute({
  children,
  roles,
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading)
    return <FullPageLoader />;

  if (!user)
    return (
      <Navigate
        to="/login"
      />
    );

  if (
    roles &&
    !roles.includes(
      user.role
    )
  )
    return (
      <Navigate
        to="/login"
      />
    );

  return children;
}

export default ProtectedRoute;