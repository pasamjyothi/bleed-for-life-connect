
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Camera, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Droplets,
  Award,
  Shield,
  Settings
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bloodType: "O+",
    location: "New York, NY",
    joinDate: "January 2024",
    totalDonations: 12,
    lastDonation: "March 15, 2024",
    availableToGive: true,
    emergencyContact: "+1 (555) 987-6543"
  };

  const achievements = [
    { name: "First Donation", icon: "🩸", date: "Jan 2024" },
    { name: "Lifesaver", icon: "💝", date: "Feb 2024" },
    { name: "Regular Donor", icon: "⭐", date: "Mar 2024" }
  ];

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
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-red-100 text-red-600 text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0 blood-gradient"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4">
                  <Badge className="blood-gradient">
                    <Droplets className="w-3 h-3 mr-1" />
                    {userProfile.bloodType}
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Available to Give
                  </Badge>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userProfile.location}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-red-600">{userProfile.totalDonations}</div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-600">{userProfile.totalDonations * 3}</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-green-600">{userProfile.lastDonation}</div>
              <div className="text-sm text-gray-600">Last Donation</div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={userProfile.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={userProfile.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input id="emergency" defaultValue={userProfile.emergencyContact} />
                </div>
                <div className="flex space-x-2">
                  <Button className="blood-gradient">Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{userProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Donation History
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
