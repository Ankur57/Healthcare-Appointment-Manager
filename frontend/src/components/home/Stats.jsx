function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

        <div>
          <h2 className="text-5xl font-bold text-blue-600">
            150+
          </h2>
          <p className="text-gray-500 mt-2">
            Doctors
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-green-600">
            5K+
          </h2>
          <p className="text-gray-500 mt-2">
            Appointments
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-cyan-600">
            20+
          </h2>
          <p className="text-gray-500 mt-2">
            Specializations
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-purple-600">
            98%
          </h2>
          <p className="text-gray-500 mt-2">
            Satisfaction
          </p>
        </div>

      </div>
    </section>
  );
}

export default Stats;