
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Clock,
  Heart,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels = ['Critical', 'High', 'Medium'];

const EmergencyRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: '',
    urgency: '',
    unitsNeeded: '',
    hospital: '',
    contactNumber: '',
    description: '',
    requestorName: '',
    relationship: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Emergency Request Sent!",
        description: "We're notifying compatible donors in your area immediately.",
      });
      navigate('/dashboard');
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-bold text-red-600">Emergency Blood Request</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Alert Banner */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Emergency Protocol Active</h3>
                <p className="text-red-700 text-sm mt-1">
                  This request will be immediately sent to all compatible donors within a 25km radius. 
                  Please ensure all information is accurate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Blood Request Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type Required *</Label>
                    <Select 
                      value={formData.bloodType} 
                      onValueChange={(value) => handleInputChange('bloodType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select 
                      value={formData.urgency} 
                      onValueChange={(value) => handleInputChange('urgency', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unitsNeeded">Units Needed *</Label>
                    <Input
                      id="unitsNeeded"
                      type="number"
                      min="1"
                      value={formData.unitsNeeded}
                      onChange={(e) => handleInputChange('unitsNeeded', e.target.value)}
                      placeholder="Number of units"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location & Contact</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Medical Center *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="hospital"
                      value={formData.hospital}
                      onChange={(e) => handleInputChange('hospital', e.target.value)}
                      placeholder="Enter hospital name and address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      placeholder="Emergency contact number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Requestor Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Requestor Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestorName">Your Name *</Label>
                    <Input
                      id="requestorName"
                      value={formData.requestorName}
                      onChange={(e) => handleInputChange('requestorName', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship to Patient *</Label>
                    <Input
                      id="relationship"
                      value={formData.relationship}
                      onChange={(e) => handleInputChange('relationship', e.target.value)}
                      placeholder="e.g., Family member, Friend, Doctor"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide any additional context about the emergency (optional)"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 blood-gradient hover:opacity-90 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Sending Emergency Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Emergency Request
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-600 text-center">
                  By submitting this request, you confirm that this is a genuine medical emergency 
                  and all provided information is accurate.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyRequest;
