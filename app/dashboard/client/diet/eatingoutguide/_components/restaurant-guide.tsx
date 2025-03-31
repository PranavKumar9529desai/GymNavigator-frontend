interface RestaurantGuideProps {
	restaurantType: string;
	recommendations: string[];
}

export function RestaurantGuide({
	restaurantType,
	recommendations,
}: RestaurantGuideProps) {
	return (
		<div className="p-4 border rounded-lg mb-4">
			<h2 className="text-xl font-semibold mb-3">{restaurantType}</h2>
			<ul className="space-y-2">
				{recommendations.map((item) => (
					<li key={item} className="list-disc ml-4">
						{item}
					</li>
				))}
			</ul>
		</div>
	);
}
