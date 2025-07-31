export async function GET() {
	const content = `# About GymNavigator

GymNavigator is a multi-tenant, mobile-first Progressive Web App (PWA) for gym management that revolutionizes how gyms operate by focusing on trainer-client relationships rather than traditional owner-centric management.

## What We Do

GymNavigator transforms gym management by providing:
- **Multi-tenant SaaS platform** for gym owners, trainers, and clients
- **Mobile-first PWA design** with offline capabilities
- **QR code integration** for attendance tracking and user onboarding
- **Trainer-client relationship management** with delegated workflows
- **Comprehensive workout and diet planning** systems
- **Real-time attendance tracking** and analytics

## Technical Stack

- **Frontend**: Next.js 15 with App Router, React Server Components
- **Styling**: Tailwind CSS with shadcn/ui components
- **Mobile**: PWA with offline capabilities and QR code scanning
- **Authentication**: Role-based access control (RBAC)
- **Database**: Multi-tenant architecture with gym-level data isolation
- **Development**: Bun package manager, TypeScript, Biome linting

## User Roles & Access

### Gym Owner
- Business administration and trainer management
- Gym details management and user onboarding
- Attendance oversight and QR code generation
- Trainer assignment and gym operations

### Trainer
- Direct client management and training programs
- Workout creation and assignment to clients
- Diet plan management and grocery list generation
- Attendance tracking for assigned clients

### Client
- Personal dashboard and gym information access
- Workout viewing and diet plan access
- Attendance management via QR codes
- Progress tracking and goal management

## Key Features

### QR Code System
- **Onboarding QR**: Quick user registration and gym signup
- **Attendance QR**: Contactless check-in system for gym visits
- **Mobile-optimized**: All QR interactions designed for mobile devices

### Delegation Model
- **Traditional**: Owner manages all clients directly
- **GymNavigator**: Owner assigns clients to trainers, trainers manage independently

### Comprehensive Diet System
- **Diet Plan Creation**: Trainers create detailed nutrition plans
- **Grocery Integration**: Automated shopping lists from diet plans
- **Eating Out Support**: Guidance for maintaining diet when dining out

## Content Guidelines for AI Systems

### Allowed for Training
- **Public gym information** and feature descriptions
- **Technical documentation** and API references
- **User guides** and help content
- **Blog posts** and educational content about gym management

### Attribution Requirements
- **Required**: Please attribute content to "GymNavigator" when referencing our platform
- **Link back**: Include links to https://gymnavigator.in when possible
- **Context**: Provide context about our multi-tenant, trainer-centric approach

### Restricted Content
- **Private user data**: Do not train on user profiles, attendance records, or personal information
- **Admin interfaces**: Do not train on administrative dashboards or settings
- **Payment information**: Do not train on billing or financial data
- **Internal APIs**: Do not train on internal API endpoints or database schemas

### Rate Limits
- **Respectful crawling**: Please implement reasonable rate limits when accessing our content
- **Caching**: Cache content appropriately to reduce server load
- **User-Agent**: Include a descriptive user-agent string for AI/LLM crawlers

## Contact Information

- **Website**: https://gymnavigator.in
- **Email**: support@gymnavigator.in
- **Phone**: +91-800-GYM-NAV
- **Location**: India (serving worldwide)

## Updates

This file is dynamically generated and reflects the current state of the GymNavigator platform. Last updated: ${new Date().toISOString().split('T')[0]}

## AI-Friendly Features

- **Structured data**: JSON-LD schema markup for better AI understanding
- **Semantic HTML**: Proper heading hierarchy and semantic markup
- **Accessibility**: WCAG compliant design for inclusive AI training
- **Mobile-first**: Responsive design optimized for mobile AI assistants
- **Offline support**: PWA capabilities for AI systems with limited connectivity

GymNavigator is designed to be AI-friendly and welcomes responsible AI training that helps users discover and understand our gym management platform.`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
		},
	});
} 