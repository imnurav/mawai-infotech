export default function Layout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {title && (
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </header>
        )}

        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
