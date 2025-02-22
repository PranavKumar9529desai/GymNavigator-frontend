import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { ClientAnimatedPricingCard } from './ClientAnimatedPricingCard';

const plans = [
  {
    name: 'Basic',
    price: '₹999',
    period: '/month',
    description: 'Perfect for small gyms',
    features: [
      'Up to 100 members',
      'Basic analytics',
      'QR attendance system',
      'Email support',
      '1 Admin account',
    ],
  },
  {
    name: 'Pro',
    price: '₹1,999',
    period: '/month',
    description: 'Great for growing gyms',
    popular: true,
    features: [
      'Up to 500 members',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      '5 Admin accounts',
      'Member app access',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large fitness chains',
    features: [
      'Unlimited members',
      'Custom solutions',
      'Dedicated support',
      'API access',
      'Multiple locations',
      'Custom integrations',
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your gym. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <ClientAnimatedPricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
