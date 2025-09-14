'use client';

import { Aircraft } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

interface AircraftCardProps {
  aircraft: Aircraft;
}

export default function AircraftCard({ aircraft }: AircraftCardProps) {
  const getStatusColor = (nextInspection: string) => {
    const days = Math.ceil((new Date(nextInspection).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'destructive';
    if (days < 30) return 'default';
    return 'secondary';
  };

  const getStatusText = (nextInspection: string) => {
    const days = Math.ceil((new Date(nextInspection).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days < 30) return `Due in ${days} days`;
    return `Due in ${days} days`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">{aircraft.registration}</span>
          </CardTitle>
          <Badge variant={getStatusColor(aircraft.nextInspection)}>
            {getStatusText(aircraft.nextInspection)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {aircraft.manufacturer} {aircraft.model}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Total Hours:</span>
              <span className="font-medium">{aircraft.totalHours}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Last Inspection:</span>
              <span className="font-medium">
                {new Date(aircraft.lastInspection).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/aircraft/${aircraft.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href={`/maintenance/${aircraft.id}`}>
                Maintenance
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}