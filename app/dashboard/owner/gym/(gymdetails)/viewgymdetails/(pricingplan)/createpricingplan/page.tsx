import CreatePricingPlan from './_components/pricing-plan';
import BackButton from '@/components/back/back-button';

export default function Page() {
	return (
		<>
			<BackButton className="mb-4" />
			<CreatePricingPlan />
		</>
	);
}
