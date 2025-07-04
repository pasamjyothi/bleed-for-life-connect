
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Droplets, 
  Heart, 
  MapPin, 
  Bell, 
  User, 
  Calendar, 
  Award,
  AlertTriangle,
  Plus,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for user data
  const [userProfile, setUserProfile] = useState(null);
  const [donationStats, setDonationStats] = useState({
    totalDonations: 0,
    livesImpacted: 0,
    nextDonation: "Available",
    bloodType: ""
  });
  const [loading, setLoading] = useState(true);
  
  const [notifications] = useState([
    { id: 1, title: "Emergency Request Nearby", type: "emergency", time: "2 min ago" },
    { id: 2, title: "Donation Scheduled Tomorrow", type: "reminder", time: "1 hour ago" },
    { id: 3, title: "Thank You Message Received", type: "message", time: "3 hours ago" }
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          navigate('/login');
          return;
        }

        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive"
          });
          return;
        }

        setUserProfile(profile);
        
        // Update donation stats with real data
        setDonationStats({
          totalDonations: 0, // This will be updated when we add donations table
          livesImpacted: 0,  // Calculated as totalDonations * 3
          nextDonation: "Available",
          bloodType: profile.blood_type
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Droplets className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = userProfile ? userProfile.first_name : 'User';
  const userInitials = userProfile ? 
    `${userProfile.first_name[0]}${userProfile.last_name[0]}` : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Droplets className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold">BleedForLife</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs blood-gradient">
                  {notifications.length}
                </Badge>
              )}
            </Button>
            
            <Avatar 
              className="w-8 h-8 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-red-100 text-red-600">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h2>
          <p className="text-gray-600">Ready to make a difference today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Heart className="w-8 h-8 text-red-500 mx-auto" />
                <div className="text-2xl font-bold text-gray-900">{donationStats.totalDonations}</div>
                <div className="text-sm text-gray-600">Total Donations</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Activity className="w-8 h-8 text-blue-500 mx-auto" />
                <div className="text-2xl font-bold text-gray-900">{donationStats.livesImpacted}</div>
                <div className="text-sm text-gray-600">Lives Impacted</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Calendar className="w-8 h-8 text-green-500 mx-auto" />
                <div className="text-2xl font-bold text-gray-900">{donationStats.nextDonation}</div>
                <div className="text-sm text-gray-600">Next Donation</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Droplets className="w-8 h-8 text-red-500 mx-auto" />
                <div className="text-2xl font-bold text-gray-900">{donationStats.bloodType}</div>
                <div className="text-sm text-gray-600">Blood Type</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-20 flex-col space-y-2 blood-gradient hover:opacity-90"
              onClick={() => navigate('/donation-request')}
            >
              <Droplets className="w-6 h-6" />
              <span>Donate Blood</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/emergency')}
            >
              <AlertTriangle className="w-6 h-6" />
              <span>Emergency Request</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/find-centers')}
            >
              <MapPin className="w-6 h-6" />
              <span>Find Centers</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'emergency' ? 'bg-red-500' :
                    notification.type === 'reminder' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                    <div className="text-xs text-gray-500">{notification.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Your Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold">Lifesaver Badge</h3>
                <p className="text-sm text-gray-600">You've helped save {donationStats.livesImpacted}+ lives through your donations!</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to next milestone</span>
                  <span>{donationStats.livesImpacted}/50 lives</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="blood-gradient h-2 rounded-full" style={{ width: `${Math.min((donationStats.livesImpacted / 50) * 100, 100)}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
