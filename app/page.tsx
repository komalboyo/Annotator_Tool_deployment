export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between px-8 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Section */}
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold mb-6">Annotator</h1>
          <p className="text-gray-300 text-lg mb-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="/register"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-full"
            >
              Create Account
            </a>
            <p className="text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-teal-400 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-64 h-64 bg-gray-300 flex items-center justify-center text-black text-xl">
            IMAGE
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-400 border-t border-gray-700 pt-6">
        Copyright @ 2025 Annotator Inc.
      </footer>
    </div>
  );
}
