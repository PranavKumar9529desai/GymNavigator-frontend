'use client';

import { Box, Button, TextField } from '@mui/material';
import type React from 'react';
import { useState } from 'react';

export const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

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
	);
};
