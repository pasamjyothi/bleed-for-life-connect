
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Droplets, 
  Calendar,
  MapPin,
  Plus,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DonationHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUnits: 0,
    livesImpacted: 0
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        navigate('/login');
        return;
      }

      const { data: donations, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id)
        .order('donation_date', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
        toast({
          title: "Error",
          description: "Failed to load donation history.",
          variant: "destructive"
        });
      } else {
        setDonations(donations || []);
        
        // Calculate stats
        const totalDonations = donations?.length || 0;
        const totalUnits = donations?.reduce((sum, d) => sum + (d.units_donated || 1), 0) || 0;
        
        setStats({
          totalDonations,
          totalUnits,
          livesImpacted: totalUnits * 3
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load donation history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Droplets className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Donation History</h1>
          </div>
          
          <Button
            className="blood-gradient"
            onClick={() => navigate('/donation-request')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.totalDonations}</div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUnits}</div>
              <div className="text-sm text-gray-600">Units Donated</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.livesImpacted}</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </CardContent>
          </Card>
        </div>

        {/* Donation History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="w-5 h-5" />
              <span>Your Donations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(donation.donation_date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="blood-gradient">
                          <Droplets className="w-3 h-3 mr-1" />
                          {donation.blood_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{donation.units_donated || 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{donation.donation_center || 'Not specified'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={donation.status === 'completed' ? 'default' : 'outline'}
                          className={donation.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {donation.notes || 'No notes'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                <p className="text-gray-600 mb-6">Start your journey as a blood donor today!</p>
                <Button 
                  className="blood-gradient"
                  onClick={() => navigate('/donation-request')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Your First Donation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Section */}
        {donations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 rounded-lg ${stats.totalDonations >= 1 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-2">🩸</div>
                  <div className="font-medium">First Donation</div>
                  <div className="text-sm text-gray-600">
                    {stats.totalDonations >= 1 ? 'Achieved!' : 'Make your first donation'}
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${stats.totalDonations >= 5 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-medium">Regular Donor</div>
                  <div className="text-sm text-gray-600">
                    {stats.totalDonations >= 5 ? 'Achieved!' : `${stats.totalDonations}/5 donations`}
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${stats.totalDonations >= 10 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-medium">Hero Donor</div>
                  <div className="text-sm text-gray-600">
                    {stats.totalDonations >= 10 ? 'Achieved!' : `${stats.totalDonations}/10 donations`}
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${stats.totalDonations >= 25 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-2">👑</div>
                  <div className="font-medium">Legend</div>
                  <div className="text-sm text-gray-600">
                    {stats.totalDonations >= 25 ? 'Achieved!' : `${stats.totalDonations}/25 donations`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
