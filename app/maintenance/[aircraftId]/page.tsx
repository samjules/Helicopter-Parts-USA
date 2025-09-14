'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Aircraft, MaintenanceSheet, MaintenanceItem } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Plane, Plus, FileText, Calendar, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const params = useParams();
  const aircraftId = params.aircraftId as string;
  
  const [aircraft, setAircraft] = useState<Aircraft | null>(null);
  const [maintenanceSheets, setMaintenanceSheets] = useState<MaintenanceSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState('');

  const loadData = () => {
    const aircraftData = storage.getAircraft();
    const foundAircraft = aircraftData.find(a => a.id === aircraftId);
    setAircraft(foundAircraft || null);

    const sheets = storage.getMaintenanceSheetsByAircraft(aircraftId);
    setMaintenanceSheets(sheets);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [aircraftId]);

  const handleCreateSheet = () => {
    if (!newSheetTitle.trim()) return;

    const newSheet: MaintenanceSheet = {
      id: crypto.randomUUID(),
      aircraftId,
      title: newSheetTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: []
    };

    storage.addMaintenanceSheet(newSheet);
    loadData();
    setCreateSheetOpen(false);
    setNewSheetTitle('');
  };

  const getSheetStatus = (sheet: MaintenanceSheet) => {
    const overdueItems = sheet.items.filter(item => item.status === 'overdue').length;
    const dueItems = sheet.items.filter(item => item.status === 'due').length;
    
    if (overdueItems > 0) return { text: `${overdueItems} Overdue`, variant: 'destructive' as const };
    if (dueItems > 0) return { text: `${dueItems} Due`, variant: 'default' as const };
    return { text: 'Current', variant: 'secondary' as const };
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

  if (!aircraft) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Aircraft Not Found</h1>
          <Link href="/aircraft">
            <Button>Back to Aircraft</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/aircraft">
              <Button variant="outline" size="sm">← Back</Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Plane className="h-8 w-8 text-blue-600" />
                <span>{aircraft.registration}</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {aircraft.manufacturer} {aircraft.model} • {aircraft.totalHours} hours
              </p>
            </div>
          </div>
          
          <Dialog open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Maintenance Sheet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Maintenance Sheet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Sheet Title</Label>
                  <Input
                    id="title"
                    value={newSheetTitle}
                    onChange={(e) => setNewSheetTitle(e.target.value)}
                    placeholder="100-Hour Inspection Checklist"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setCreateSheetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSheet}>Create Sheet</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Aircraft Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aircraft Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Inspection</p>
                  <p className="font-semibold">
                    {aircraft.lastInspection 
                      ? new Date(aircraft.lastInspection).toLocaleDateString() 
                      : 'Not recorded'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Next Inspection</p>
                  <p className="font-semibold">
                    {aircraft.nextInspection 
                      ? new Date(aircraft.nextInspection).toLocaleDateString() 
                      : 'Not scheduled'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={
                    aircraft.nextInspection && new Date(aircraft.nextInspection) < new Date() 
                      ? 'destructive' 
                      : 'secondary'
                  }>
                    {aircraft.nextInspection && new Date(aircraft.nextInspection) < new Date() 
                      ? 'Overdue' 
                      : 'Current'
                    }
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Sheets */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Maintenance Sheets
          </h2>
          
          {maintenanceSheets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No maintenance sheets created
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first maintenance tracking sheet for {aircraft.registration}.
                </p>
                <Dialog open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Sheet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Maintenance Sheet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Sheet Title</Label>
                        <Input
                          id="title"
                          value={newSheetTitle}
                          onChange={(e) => setNewSheetTitle(e.target.value)}
                          placeholder="100-Hour Inspection Checklist"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setCreateSheetOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateSheet}>Create Sheet</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {maintenanceSheets.map((sheet) => {
                const status = getSheetStatus(sheet);
                return (
                  <Card key={sheet.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span>{sheet.title}</span>
                          <Badge variant={status.variant}>{status.text}</Badge>
                        </CardTitle>
                        <Button asChild size="sm">
                          <Link href={`/maintenance/${aircraftId}/${sheet.id}`}>
                            Open Sheet
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{sheet.items.length} maintenance items</span>
                        <span>Updated {new Date(sheet.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}