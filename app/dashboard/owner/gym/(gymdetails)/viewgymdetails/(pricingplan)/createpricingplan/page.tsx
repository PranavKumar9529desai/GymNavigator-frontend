import BackButton from '@/components/back/back-button';
import CreatePricingPlan from './_components/pricing-plan';

export default function Page() {
	return (
		<>
			<BackButton className="mb-4" />
			<CreatePricingPlan />
		</>
	);
}
