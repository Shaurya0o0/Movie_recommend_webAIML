function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-4 text-indigo-400 font-semibold">
        Fetching recommendations...
      </span>
    </div>
  );
}

export default LoadingSpinner;
