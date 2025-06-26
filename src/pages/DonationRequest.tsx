
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Droplets, 
  Heart,
  Phone,
  Navigation,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const donationRequests = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    bloodType: "O+",
    urgency: "Critical",
    location: "Manhattan General Hospital",
    distance: "2.3 km",
    timePosted: "15 min ago",
    unitsNeeded: 3,
    description: "Emergency surgery required"
  },
  {
    id: 2,
    patientName: "Michael Chen",
    bloodType: "A-",
    urgency: "High",
    location: "Brooklyn Medical Center",
    distance: "5.7 km",
    timePosted: "1 hour ago",
    unitsNeeded: 2,
    description: "Cancer treatment support"
  },
  {
    id: 3,
    patientName: "Emma Davis",
    bloodType: "B+",
    urgency: "Medium",
    location: "Queens Hospital",
    distance: "8.1 km",
    timePosted: "3 hours ago",
    unitsNeeded: 1,
    description: "Planned surgery preparation"
  }
];

const DonationRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleDonate = (requestId: number, patientName: string) => {
    toast({
      title: "Donation Confirmed!",
      description: `Thank you for helping ${patientName}. You'll receive location details shortly.`,
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Donation Requests</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="nearby">Nearby</SelectItem>
                <SelectItem value="compatible">Compatible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-gray-600">Active Requests</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">Critical</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">2.3 km</div>
              <div className="text-sm text-gray-600">Nearest</div>
            </CardContent>
          </Card>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {donationRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gray-100">
                        {request.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{request.patientName}</h3>
                      <p className="text-gray-600 text-sm">{request.description}</p>
                    </div>
                  </div>
                  
                  <Badge className={`${getUrgencyColor(request.urgency)} text-white`}>
                    {request.urgency}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-red-500" />
                    <span className="font-medium">{request.bloodType}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>{request.unitsNeeded} units</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{request.distance}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{request.timePosted}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    className="flex-1 blood-gradient hover:opacity-90"
                    onClick={() => handleDonate(request.id, request.patientName)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Can't Find a Match?</h3>
            <p className="mb-4">Register for future notifications when someone needs your blood type.</p>
            <Button variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              Set Up Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationRequest;
