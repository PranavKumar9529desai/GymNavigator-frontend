import {
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
} from '@heroicons/react/24/outline';
import { ClientAnimatedContactInfo } from './ClientAnimatedContactInfo';
import { ContactForm } from './ContactForm';
import { GradientBackground } from '@/components/theme/GradientBackground';
import { Container, Box } from '@mui/material';

const contactInfo = [
	{
		icon: <PhoneIcon className="w-6 h-6" />,
		title: 'Phone',
		detail: '+1 (555) 123-4567',
	},
	{
		icon: <EnvelopeIcon className="w-6 h-6" />,
		title: 'Email',
		detail: 'support@gymnavigator.com',
	},
	{
		icon: <MapPinIcon className="w-6 h-6" />,
		title: 'Location',
		detail: '123 Fitness Street, Gym City',
	},
];

const ContactUs = () => {
	return (
		<GradientBackground>
			<Container maxWidth="lg">
				<Box py={8}>
					<div className="text-center mb-16">
						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
							Get in Touch
						</h1>
						<p className="text-gray-300 text-lg max-w-2xl mx-auto">
							Have questions about GymNavigator? We're here to help you get
							started.
						</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-8 mb-12">
						{contactInfo.map((info, index) => (
							<ClientAnimatedContactInfo
								key={info.title}
								info={info}
								index={index}
							/>
						))}
					</div>

					<div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-8 border border-gray-700">
						<ContactForm />
					</div>
				</Box>
			</Container>
		</GradientBackground>
	);
};

export default ContactUs;
