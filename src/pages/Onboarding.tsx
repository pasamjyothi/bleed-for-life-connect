
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MapPin, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Heart,
    title: "Save Lives",
    description: "Your blood donation can save up to 3 lives. Join our community of life-savers.",
    color: "bg-red-500"
  },
  {
    icon: Users,
    title: "Connect with Donors",
    description: "Find compatible donors nearby and connect with recipients who need your help.",
    color: "bg-blue-500"
  },
  {
    icon: MapPin,
    title: "Location-Based Matching",
    description: "We'll connect you with donation centers and requests in your area.",
    color: "bg-green-500"
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your health information is protected with enterprise-grade security.",
    color: "bg-purple-500"
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/register');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content Card */}
        <Card className="mb-8 shadow-xl border-0">
          <CardContent className="p-8 text-center space-y-6">
            <div className={`w-20 h-20 ${currentStepData.color} rounded-full mx-auto flex items-center justify-center`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
              <p className="text-gray-600 leading-relaxed">{currentStepData.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-gray-500"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <Badge variant="secondary" className="px-4 py-2">
            {currentStep + 1} of {onboardingSteps.length}
          </Badge>

          <Button
            onClick={nextStep}
            className="blood-gradient hover:opacity-90"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate('/register')}
            className="text-gray-500 text-sm"
          >
            Skip introduction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
