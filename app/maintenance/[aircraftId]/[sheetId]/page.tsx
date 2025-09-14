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
import { Checkbox } from '@/components/ui/checkbox';
import { Aircraft, MaintenanceSheet, MaintenanceItem } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Plane, Plus, FileText, Calendar, Clock, CheckCircle, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MaintenanceSheetPage() {
  const params = useParams();
  const aircraftId = params.aircraftId as string;
  const sheetId = params.sheetId as string;
  
  const [aircraft, setAircraft] = useState<Aircraft | null>(null);
  const [sheet, setSheet] = useState<MaintenanceSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    description: '',
    interval: '',
    lastCompleted: '',
    notes: ''
  });

  const loadData = () => {
    const aircraftData = storage.getAircraft();
    const foundAircraft = aircraftData.find(a => a.id === aircraftId);
    setAircraft(foundAircraft || null);

    const sheets = storage.getMaintenanceSheets();
    const foundSheet = sheets.find(s => s.id === sheetId);
    setSheet(foundSheet || null);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [aircraftId, sheetId]);

  const calculateStatus = (item: MaintenanceItem): 'current' | 'due' | 'overdue' => {
    if (!item.lastCompleted) return 'due';
    
    const lastCompletedDate = new Date(item.lastCompleted);
    const intervalInDays = item.interval; // Assuming interval is in days for simplicity
    const nextDueDate = new Date(lastCompletedDate.getTime() + (intervalInDays * 24 * 60 * 60 * 1000));
    const now = new Date();

    if (nextDueDate < now) return 'overdue';
    if (nextDueDate.getTime() - now.getTime() <= 30 * 24 * 60 * 60 * 1000) return 'due'; // Due within 30 days
    return 'current';
  };

  const handleAddItem = () => {
    if (!sheet || !newItem.description.trim()) return;

    const item: MaintenanceItem = {
      id: crypto.randomUUID(),
      description: newItem.description,
      interval: parseInt(newItem.interval) || 100,
      lastCompleted: newItem.lastCompleted,
      nextDue: '', // Will be calculated
      status: 'current',
      notes: newItem.notes
    };

    // Calculate status
    item.status = calculateStatus(item);

    // Calculate next due date
    if (item.lastCompleted) {
      const lastDate = new Date(item.lastCompleted);
      const nextDate = new Date(lastDate.getTime() + (item.interval * 24 * 60 * 60 * 1000));
      item.nextDue = nextDate.toISOString();
    }

    const updatedSheet = {
      ...sheet,
      items: [...sheet.items, item],
      updatedAt: new Date().toISOString()
    };

    storage.updateMaintenanceSheet(sheet.id, updatedSheet);
    loadData();
    setAddItemOpen(false);
    setNewItem({ description: '', interval: '', lastCompleted: '', notes: '' });
  };

  const handleCompleteItem = (itemId: string) => {
    if (!sheet) return;

    const updatedItems = sheet.items.map(item => {
      if (item.id === itemId) {
        const now = new Date().toISOString();
        const nextDue = new Date(Date.now() + (item.interval * 24 * 60 * 60 * 1000)).toISOString();
        return {
          ...item,
          lastCompleted: now,
          nextDue,
          status: 'current' as const
        };
      }
      return item;
    });

    const updatedSheet = {
      ...sheet,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };

    storage.updateMaintenanceSheet(sheet.id, updatedSheet);
    loadData();
  };

  const handleDeleteItem = (itemId: string) => {
    if (!sheet || !confirm('Are you sure you want to delete this maintenance item?')) return;

    const updatedItems = sheet.items.filter(item => item.id !== itemId);
    const updatedSheet = {
      ...sheet,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };

    storage.updateMaintenanceSheet(sheet.id, updatedSheet);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'secondary';
      case 'due': return 'default';
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-4 w-4" />;
      case 'due': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  if (!aircraft || !sheet) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sheet Not Found</h1>
          <Link href={`/maintenance/${aircraftId}`}>
            <Button>Back to Maintenance</Button>
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
            <Link href={`/maintenance/${aircraftId}`}>
              <Button variant="outline" size="sm">← Back</Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <span>{sheet.title}</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {aircraft.registration} • {aircraft.manufacturer} {aircraft.model}
              </p>
            </div>
          </div>
          
          <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Maintenance Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Oil change, filter replacement, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interval">Interval (days) *</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={newItem.interval}
                    onChange={(e) => setNewItem({ ...newItem, interval: e.target.value })}
                    placeholder="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastCompleted">Last Completed</Label>
                  <Input
                    id="lastCompleted"
                    type="date"
                    value={newItem.lastCompleted}
                    onChange={(e) => setNewItem({ ...newItem, lastCompleted: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Additional notes or specifications..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sheet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{sheet.items.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Current</p>
                <p className="text-2xl font-bold text-green-600">
                  {sheet.items.filter(item => item.status === 'current').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Due</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {sheet.items.filter(item => item.status === 'due').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {sheet.items.filter(item => item.status === 'overdue').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Items */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Maintenance Items
          </h2>
          
          {sheet.items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No maintenance items added
                </h3>
                <p className="text-gray-500 mb-4">
                  Start building your maintenance checklist by adding items.
                </p>
                <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Maintenance Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                          id="description"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          placeholder="Oil change, filter replacement, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="interval">Interval (days) *</Label>
                        <Input
                          id="interval"
                          type="number"
                          value={newItem.interval}
                          onChange={(e) => setNewItem({ ...newItem, interval: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastCompleted">Last Completed</Label>
                        <Input
                          id="lastCompleted"
                          type="date"
                          value={newItem.lastCompleted}
                          onChange={(e) => setNewItem({ ...newItem, lastCompleted: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newItem.notes}
                          onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                          placeholder="Additional notes or specifications..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddItem}>Add Item</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sheet.items.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.description}
                          </h3>
                          <Badge variant={getStatusColor(item.status)} className="flex items-center space-x-1">
                            {getStatusIcon(item.status)}
                            <span className="capitalize">{item.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Interval:</span> {item.interval} days
                          </div>
                          <div>
                            <span className="font-medium">Last Completed:</span>{' '}
                            {item.lastCompleted 
                              ? new Date(item.lastCompleted).toLocaleDateString() 
                              : 'Not completed'
                            }
                          </div>
                          <div>
                            <span className="font-medium">Next Due:</span>{' '}
                            {item.nextDue 
                              ? new Date(item.nextDue).toLocaleDateString() 
                              : 'Not scheduled'
                            }
                          </div>
                        </div>
                        
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteItem(item.id)}
                          disabled={item.status === 'current'}
                        >
                          Mark Complete
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}