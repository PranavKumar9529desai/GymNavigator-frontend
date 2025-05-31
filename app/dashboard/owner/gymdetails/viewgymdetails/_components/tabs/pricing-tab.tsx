"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isFeatured?: boolean; // To indicate if it has the black border
}

interface AdditionalService {
  name: string;
  price: string;
  duration: string;
  description?: string;
}

const defaultPricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    description: "Perfect for beginners",
    price: "$29.99",
    duration: "/month",
    features: ["Gym equipment access", "Locker room access", "Free WiFi"],
  },
  {
    name: "Premium",
    description: "Everything you need",
    price: "$49.99",
    duration: "/month",
    features: [
      "All Basic features",
      "Group classes included",
      "Sauna & steam room",
      "Guest privileges (2/month)",
    ],
    isFeatured: true,
  },
  {
    name: "Elite",
    description: "Ultimate experience",
    price: "$79.99",
    duration: "/month",
    features: [
      "All Premium features",
      "Personal training (2/month)",
      "Nutrition consultation",
      "Priority booking",
    ],
  },
];

const defaultAdditionalServices: AdditionalService[] = [
  {
    name: "Registration Fee",
    price: "$25",
    duration: "One-time only",
  },
  {
    name: "Personal Training",
    price: "$75",
    duration: "Per session",
  },
  {
    name: "Day Pass",
    price: "$20",
    duration: "Single visit",
  },
  {
    name: "Guest Pass",
    price: "$15",
    duration: "Per guest",
  },
];

interface PricingTabProps {
  pricingPlans?: PricingPlan[];
  additionalServices?: AdditionalService[];
}

export function PricingTab({
  pricingPlans = defaultPricingPlans,
  additionalServices = defaultAdditionalServices,
}: PricingTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className={`border shadow-lg ${plan.isFeatured ? "border-2 border-black" : ""}`}>
            <CardHeader className="bg-gray-900 text-white">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-300">{plan.description}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.duration}</span>
              </div>
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-black" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Fees */}
      <Card className="border shadow-lg">
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Additional Services</h3>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <div key={index} className="text-center">
                <p className="font-semibold text-gray-900">{service.name}</p>
                <p className="text-2xl font-bold text-gray-900">{service.price}</p>
                <p className="text-sm text-gray-500">{service.duration}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
