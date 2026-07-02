import {
  useEffect,
  useState,
} from "react";

import {
  getDoctors,
} from "../../services/doctor.service";

import DoctorCard
from "../../components/patient/DoctorCard";

import SearchBar
from "../../components/patient/SearchBar";

function Doctors() {
  const [doctors, setDoctors] =
    useState([]);

  const [
    specialization,
    setSpecialization,
  ] = useState("");

  useEffect(() => {
    loadDoctors();
  }, [specialization]);

  const loadDoctors =
    async () => {
      const data =
        await getDoctors(
          specialization
        );

      setDoctors(data);
    };

  return (
    <div>

      <h1 className="text-4xl font-bold">
        Find Doctors
      </h1>

      <div className="mt-8">

        <SearchBar
          value={
            specialization
          }
          setValue={
            setSpecialization
          }
        />

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

        {doctors.map(
          (doctor) => (
            <DoctorCard
              key={
                doctor._id
              }
              doctor={
                doctor
              }
            />
          )
        )}

      </div>

    </div>
  );
}

export default Doctors;