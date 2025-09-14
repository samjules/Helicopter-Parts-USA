'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CreateAircraftDialog from '@/components/CreateAircraftDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Aircraft } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Plane, Edit, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AircraftPage() {
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

  const handleDeleteAircraft = (id: string) => {
    if (confirm('Are you sure you want to delete this aircraft? This will also delete all associated maintenance records.')) {
      storage.deleteAircraft(id);
      loadAircraft();
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Aircraft Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your fleet and aircraft details
            </p>
          </div>
          <CreateAircraftDialog onAircraftCreated={loadAircraft} />
        </div>

        {aircraft.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
          <div className="grid gap-6">
            {aircraft.map((aircraft) => (
              <Card key={aircraft.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Plane className="h-6 w-6 text-blue-600" />
                      <span className="text-xl">{aircraft.registration}</span>
                      <Badge variant="outline">
                        {aircraft.manufacturer} {aircraft.model}
                      </Badge>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/maintenance/${aircraft.id}`}>
                          <FileText className="h-4 w-4 mr-2" />
                          Maintenance
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAircraft(aircraft.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Serial Number</p>
                      <p className="text-gray-900">{aircraft.serialNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Total Hours</p>
                      <p className="text-gray-900 font-semibold">{aircraft.totalHours}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Last Inspection</p>
                      <p className="text-gray-900">
                        {aircraft.lastInspection ? new Date(aircraft.lastInspection).toLocaleDateString() : 'Not recorded'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Next Inspection</p>
                      <p className="text-gray-900">
                        {aircraft.nextInspection ? new Date(aircraft.nextInspection).toLocaleDateString() : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}