'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AircraftCard from '@/components/AircraftCard';
import CreateAircraftDialog from '@/components/CreateAircraftDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aircraft } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Plane, FileText } from 'lucide-react';

export default function MaintenancePage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAircraft = () => {
    const savedAircraft = storage.getAircraft();
    setAircraft(savedAircraft);
    setLoading(false);
  };

  useEffect(() => {
    loadAircraft();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Overview</h1>
            <p className="text-gray-600 mt-1">
              Select an aircraft to view and manage maintenance schedules
            </p>
          </div>
          <CreateAircraftDialog onAircraftCreated={loadAircraft} />
        </div>

        {aircraft.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No aircraft registered
              </h3>
              <p className="text-gray-500 mb-4">
                Add aircraft to your fleet to start tracking maintenance schedules.
              </p>
              <CreateAircraftDialog onAircraftCreated={loadAircraft} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aircraft.map((aircraft) => (
              <AircraftCard key={aircraft.id} aircraft={aircraft} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}