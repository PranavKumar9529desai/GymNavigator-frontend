import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Enrollment } from './types';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800',
};

export function EnrollmentCards({
  enrollments,
}: { enrollments: Enrollment[] }) {
  return (
    <div className="space-y-4">
      {enrollments.map((enrollment: Enrollment) => (
        <Card key={enrollment.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{enrollment.userName}</span>
              <Badge className={statusColors[enrollment.status]}>
                {enrollment.status.charAt(0).toUpperCase() +
                  enrollment.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Start Date:{' '}
              {enrollment.startDate
                ? enrollment.startDate.toLocaleDateString()
                : '-'}
            </p>
            <p className="text-sm text-gray-500">
              End Date:{' '}
              {enrollment.endDate
                ? enrollment.endDate.toLocaleDateString()
                : '-'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
