'use client';
import { GradientBackground } from '@/components/theme/GradientBackground';
import {
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
} from '@heroicons/react/24/outline';
import { Box, Button, Container, TextField } from '@mui/material';
import { m } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';

const ContactUs: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

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

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Add your form submission logic here
		console.log(formData);
	};

	return (
		<GradientBackground >

			<Container maxWidth="lg">
				<Box py={8}>
					<m.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-16"
					>
						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
							Get in Touch
						</h1>
						<p className="text-gray-300 text-lg max-w-2xl mx-auto">
							Have questions about GymNavigator? We're here to help you get
							started.
						</p>
					</m.div>

					<div className="grid lg:grid-cols-3 gap-8 mb-12">
						{contactInfo.map((info, index) => (
							<m.div
								key={info.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
							>
								<div className="text-blue-400 mb-4">{info.icon}</div>
								<h3 className="text-xl font-semibold text-white mb-2">
									{info.title}
								</h3>
								<p className="text-gray-400">{info.detail}</p>
							</m.div>
						))}
					</div>

					<m.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
					>
						<Box component="form" onSubmit={handleSubmit}>
							<div className="grid md:grid-cols-2 gap-6 mb-6">
								<TextField
									fullWidth
									label="Name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									variant="outlined"
									sx={{
										'& .MuiOutlinedInput-root': {
											backgroundColor: 'rgba(30, 41, 59, 0.4)',
											'& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
											'&:hover fieldset': {
												borderColor: 'rgba(148, 163, 184, 0.4)',
											},
											'&.Mui-focused fieldset': { borderColor: '#60a5fa' },
										},
										'& .MuiInputLabel-root': {
											color: 'rgba(148, 163, 184, 0.8)',
											'&.Mui-focused': {
												color: '#60a5fa',
											},
										},
										'& .MuiOutlinedInput-input': {
											color: 'rgba(255, 255, 255, 0.9)',
											'&::placeholder': {
												color: 'rgba(148, 163, 184, 0.5)',
											},
										},
									}}
								/>
								<TextField
									fullWidth
									label="Email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									required
									variant="outlined"
									sx={{
										'& .MuiOutlinedInput-root': {
											backgroundColor: 'rgba(30, 41, 59, 0.4)',
											'& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
											'&:hover fieldset': {
												borderColor: 'rgba(148, 163, 184, 0.4)',
											},
											'&.Mui-focused fieldset': { borderColor: '#60a5fa' },
										},
										'& .MuiInputLabel-root': {
											color: 'rgba(148, 163, 184, 0.8)',
											'&.Mui-focused': {
												color: '#60a5fa',
											},
										},
										'& .MuiOutlinedInput-input': {
											color: 'rgba(255, 255, 255, 0.9)',
											'&::placeholder': {
												color: 'rgba(148, 163, 184, 0.5)',
											},
										},
									}}
								/>
							</div>
							<TextField
								fullWidth
								label="Subject"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
								required
								variant="outlined"
								sx={{
									marginBottom: 3,
									'& .MuiOutlinedInput-root': {
										backgroundColor: 'rgba(30, 41, 59, 0.4)',
										'& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
										'&:hover fieldset': {
											borderColor: 'rgba(148, 163, 184, 0.4)',
										},
										'&.Mui-focused fieldset': { borderColor: '#60a5fa' },
									},
									'& .MuiInputLabel-root': {
										color: 'rgba(148, 163, 184, 0.8)',
										'&.Mui-focused': {
											color: '#60a5fa',
										},
									},
									'& .MuiOutlinedInput-input': {
										color: 'rgba(255, 255, 255, 0.9)',
										'&::placeholder': {
											color: 'rgba(148, 163, 184, 0.5)',
										},
									},
								}}
							/>
							<TextField
								fullWidth
								label="Message"
								name="message"
								multiline
								rows={4}
								value={formData.message}
								onChange={handleChange}
								required
								variant="outlined"
								sx={{
									marginBottom: 3,
									'& .MuiOutlinedInput-root': {
										backgroundColor: 'rgba(30, 41, 59, 0.4)',
										'& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
										'&:hover fieldset': {
											borderColor: 'rgba(148, 163, 184, 0.4)',
										},
										'&.Mui-focused fieldset': { borderColor: '#60a5fa' },
									},
									'& .MuiInputLabel-root': {
										color: 'rgba(148, 163, 184, 0.8)',
										'&.Mui-focused': {
											color: '#60a5fa',
										},
									},
									'& .MuiOutlinedInput-input': {
										color: 'rgba(255, 255, 255, 0.9)',
										'&::placeholder': {
											color: 'rgba(148, 163, 184, 0.5)',
										},
									},
								}}
							/>
							<Box display="flex" justifyContent="center">
								<Button
									type="submit"
									variant="contained"
									size="large"
									className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg 
									font-medium hover:shadow-lg hover:from-blue-600 hover:to-cyan-600 
                            transition-all duration-200"
							>
									Send Message
								</Button>
							</Box>
						</Box>
					</m.div>
				</Box>
			</Container>
	</GradientBackground>
	);
};

export default ContactUs;
