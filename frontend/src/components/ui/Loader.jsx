export function Loader({ className, size = "md" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4"
  };

  return (
    <div className={`flex justify-center items-center ${className || ""}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-gray-200 border-t-teal-600`}
      ></div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <Loader size="xl" />
    </div>
  );
}
