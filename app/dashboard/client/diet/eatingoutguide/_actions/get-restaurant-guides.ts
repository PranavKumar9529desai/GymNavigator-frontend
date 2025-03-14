'use server';

interface RestaurantGuide {
  type: string;
  recommendations: string[];
}

export async function getRestaurantGuides(): Promise<RestaurantGuide[]> {
  // This would typically fetch from a database
  return [
    {
      type: 'Fast Food',
      recommendations: [
        'Choose grilled over fried options',
        'Skip sugary drinks for water',
        'Ask for dressings and sauces on the side',
      ],
    },
    {
      type: 'Fine Dining',
      recommendations: [
        'Choose lean proteins like fish or chicken',
        'Ask about cooking methods',
        'Control portion sizes by sharing or taking leftovers',
      ],
    },
  ];
}
