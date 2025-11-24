import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technician Interface | WIS',
  description: 'Workshop technician workflow interface',
};

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container-tablet py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Workshop Intelligence System</h1>
              <p className="text-sm text-primary-100">Technician Interface</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary btn-sm">
                My Jobs
              </button>
              <button className="btn btn-ghost btn-sm">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container-tablet py-6">
        {children}
      </main>
    </div>
  );
}
