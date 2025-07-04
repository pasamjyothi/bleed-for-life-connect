
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Settings,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    blood_type: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    date_of_birth: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        navigate('/login');
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileError && profile) {
        setUserProfile(profile);
        setEditForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          blood_type: profile.blood_type || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          zip_code: profile.zip_code || '',
          emergency_contact_name: profile.emergency_contact_name || '',
          emergency_contact_phone: profile.emergency_contact_phone || '',
          date_of_birth: profile.date_of_birth || ''
        });
      }

      // Fetch donations
      const { data: userDonations, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id)
        .order('donation_date', { ascending: false });

      if (!donationsError && userDonations) {
        setDonations(userDonations);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
        setIsEditing(false);
        fetchUserData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Droplets className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userName = userProfile ? 
    `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'User' 
    : 'User';
  
  const userInitials = userProfile ? 
    `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}` || 'U'
    : 'U';

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
                  <AvatarFallback className="bg-red-100 text-red-600 text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0 blood-gradient"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold">{userName}</h2>
                <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4">
                  {userProfile?.blood_type && (
                    <Badge className="blood-gradient">
                      <Droplets className="w-3 h-3 mr-1" />
                      {userProfile.blood_type}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-green-200 text-green-600">
                    <Shield className="w-3 h-3 mr-1" />
                    {userProfile?.is_available_donor ? 'Available to Give' : 'Not Available'}
                  </Badge>
                </div>
                {userProfile?.city && userProfile?.state && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile.city}, {userProfile.state}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-red-600">{donations.length}</div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-600">{donations.length * 3}</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-green-600">
                {donations.length > 0 ? new Date(donations[0].donation_date).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-sm text-gray-600">Last Donation</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name" 
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name" 
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Blood Type</Label>
                    <Select 
                      value={editForm.blood_type} 
                      onValueChange={(value) => setEditForm({...editForm, blood_type: value})}
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

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={editForm.city}
                      onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      value={editForm.state}
                      onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input 
                      id="zip_code" 
                      value={editForm.zip_code}
                      onChange={(e) => setEditForm({...editForm, zip_code: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input 
                      id="emergency_contact_name" 
                      value={editForm.emergency_contact_name}
                      onChange={(e) => setEditForm({...editForm, emergency_contact_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input 
                      id="emergency_contact_phone" 
                      value={editForm.emergency_contact_phone}
                      onChange={(e) => setEditForm({...editForm, emergency_contact_phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input 
                    id="date_of_birth" 
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="blood-gradient" 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{userProfile?.first_name} {userProfile?.last_name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{userProfile?.phone || 'Not provided'}</span>
                  </div>
                </div>
                {userProfile?.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>
                      {userProfile.address}
                      {userProfile.city && `, ${userProfile.city}`}
                      {userProfile.state && `, ${userProfile.state}`}
                      {userProfile.zip_code && ` ${userProfile.zip_code}`}
                    </span>
                  </div>
                )}
                {userProfile?.date_of_birth && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Born {new Date(userProfile.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Joined {new Date(userProfile?.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donation History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="w-5 h-5" />
              <span>Donation History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length > 0 ? (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{new Date(donation.donation_date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">
                        {donation.donation_center || 'Unknown Center'} • {donation.units_donated || 1} unit(s)
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-600">
                      {donation.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Droplets className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No donations recorded yet</p>
                <p className="text-sm">Start your journey by making your first donation!</p>
              </div>
            )}
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
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/donation-history')}>
              <Calendar className="w-4 h-4 mr-2" />
              Donation History
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
