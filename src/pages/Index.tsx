
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Droplets } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="blood-gradient w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <Droplets className="w-12 h-12 text-white" />
          </div>
          <Heart className="w-8 h-8 text-red-500 absolute -top-2 -right-2 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">BleedForLife</h1>
          <p className="text-lg text-gray-600 max-w-md">
            Connecting hearts, saving lives through blood donation
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate('/onboarding')}
            className="blood-gradient hover:opacity-90 transition-opacity px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Already have an account?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
