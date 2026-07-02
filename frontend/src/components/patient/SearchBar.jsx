function SearchBar({
  value,
  setValue,
}) {
  return (
    <input
      type="text"
      placeholder="Search by specialization..."
      className="w-full p-4 rounded-2xl border bg-white"
      value={value}
      onChange={(e) =>
        setValue(
          e.target.value
        )
      }
    />
  );
}

export default SearchBar;