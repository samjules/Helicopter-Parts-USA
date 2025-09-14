'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Aircraft } from '@/lib/types';
import { storage } from '@/lib/storage';

interface CreateAircraftDialogProps {
  onAircraftCreated: () => void;
}

export default function CreateAircraftDialog({ onAircraftCreated }: CreateAircraftDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    registration: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    totalHours: '',
    lastInspection: '',
    nextInspection: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const aircraft: Aircraft = {
      id: crypto.randomUUID(),
      registration: formData.registration,
      manufacturer: formData.manufacturer,
      model: formData.model,
      serialNumber: formData.serialNumber,
      totalHours: parseFloat(formData.totalHours) || 0,
      lastInspection: formData.lastInspection,
      nextInspection: formData.nextInspection,
      createdAt: new Date().toISOString()
    };

    storage.addAircraft(aircraft);
    onAircraftCreated();
    setOpen(false);
    setFormData({
      registration: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      totalHours: '',
      lastInspection: '',
      nextInspection: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Aircraft
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Aircraft</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registration">Registration *</Label>
            <Input
              id="registration"
              value={formData.registration}
              onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
              placeholder="N12345"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Cessna"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="172"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              placeholder="17280001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalHours">Total Hours</Label>
            <Input
              id="totalHours"
              type="number"
              step="0.1"
              value={formData.totalHours}
              onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastInspection">Last Inspection</Label>
              <Input
                id="lastInspection"
                type="date"
                value={formData.lastInspection}
                onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextInspection">Next Inspection</Label>
              <Input
                id="nextInspection"
                type="date"
                value={formData.nextInspection}
                onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Aircraft</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}