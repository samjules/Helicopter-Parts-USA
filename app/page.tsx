'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AircraftCard from '@/components/AircraftCard';
import CreateAircraftDialog from '@/components/CreateAircraftDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aircraft } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Plane, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
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

  // Calculate dashboard stats
  const totalAircraft = aircraft.length;
  const overdueCount = aircraft.filter(a => new Date(a.nextInspection) < new Date()).length;
  const dueThisMonth = aircraft.filter(a => {
    const dueDate = new Date(a.nextInspection);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return dueDate > new Date() && dueDate <= thirtyDaysFromNow;
  }).length;
  const currentCount = totalAircraft - overdueCount - dueThisMonth;

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Overview of your aircraft maintenance status
            </p>
          </div>
          <CreateAircraftDialog onAircraftCreated={loadAircraft} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Aircraft</CardTitle>
              <Plane className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAircraft}</div>
              <p className="text-xs text-muted-foreground">
                Registered aircraft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{currentCount}</div>
              <p className="text-xs text-muted-foreground">
                Up to date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{dueThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Next 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              <p className="text-xs text-muted-foreground">
                Needs attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Aircraft Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aircraft Fleet
          </h2>
          {aircraft.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No aircraft registered
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first aircraft to track maintenance schedules.
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
      </div>
    </Layout>
  );
}