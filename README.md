# RateMinistereSite

A collaborative platform where students can rate and review professors and schools. Built with Next.js, this app provides an easy-to-use interface for students to share their experiences and help others choose courses.

## Maintenance Status

**We are no longer maintaining this project.**

This project was created by PowerTeddy and Learnmore_smart over 6 months of hard work. As our first major project, it has a really messy UI, and the features are not well organized. We truly believe that the future of education must be transparent, where students can leave unharmful feedback without feeling shame.

**Personal Story:** A teacher discovered the website and informed the school, which then cancelled Learnmore_Smart's graduation speech.

We also tried to create an AstrArena, where we hoped to combine games and learning together. Learnmore_Smart crafted all the images, and it had a Clash Royale feeling. However, we discontinued it because the game was impossible and the logic was not aligning with a teacher rating platform - our first project is a mess.

If you can, please help and build it better. Contributions are welcome!

## Features

- **Student Ratings and Reviews**: Rate professors and schools based on teaching quality, ease, and overall experience.
- **Detailed Profiles**: Each professor and school profile displays average ratings, reviews, and course details.
- **Search Functionality**: Easily search for professors or schools by name or department.
- **User Authentication**: Secure user login via Google OAuth to leave ratings and prevent spam.
- **Real-time Notifications**: Get notified about replies and updates.
- **Forum Integration**: SSO with Discourse for community discussions.
- **AI-Powered Moderation**: Uses Google Gemini AI for content moderation.
- **Gamification**: Earn badges and points for contributions.
- **AstrArena**: Interactive game feature for engagement.
- **Admin Panel**: Manage users, comments, and reports.

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Google Generative AI (Gemini)
- **Real-time**: Socket.io
- **Deployment**: Cloudflare Workers
- **Styling**: CSS Modules, Framer Motion for animations

## Prerequisites

- Node.js 18+
- MongoDB database
- Google Cloud account for OAuth and Gemini AI
- Cloudflare account for deployment

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Learnmore-smart/RateMinistereSite.git
   cd RateMinistereSite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your environment variables in `.env.local`:
   - `NEXTAUTH_URL`: Your app's URL (e.g., http://localhost:3000 for development)
   - `NEXTAUTH_SECRET`: A random secret string
   - `MONGODB_URI`: Your MongoDB connection string
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
   - `GEMINI_API_KEY`: Google Gemini AI API key
   - `NotAPassword`: Custom password for beta features
   - `sso`: Secret key for Discourse SSO
   - `discourseSsoUrl`: Discourse SSO URL

5. Set up MongoDB and create the necessary collections (they will be created automatically on first run).

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Students
- Sign up/login with Google
- Search for schools or professors
- Leave ratings and reviews
- Participate in the forum
- Earn badges and points

### For Admins
- Access the admin panel at `/admin`
- Manage users, comments, and reports
- Moderate content

### Development
- Use `npm run build` to build for production
- Use `npm run start` to start the production server
- Use `npm run lint` to check for code issues

## Deployment

### Cloudflare Workers
1. Install Wrangler: `npm install -g wrangler`
2. Authenticate: `wrangler auth login`
3. Deploy: `npm run deploy:worker`

### Vercel
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Known Issues and TODOs

### High Priority
- **Users can't delete their comments**: Critical functionality bug preventing users from managing their own content.
- **UI is very unfriendly with all colors**: Poor color scheme and design makes the interface difficult to use.
- **Home page is not professional**: The main landing page lacks a professional appearance and user experience.
- **ESLint Warnings**: Many React Hook dependency warnings need to be fixed for better performance and to avoid potential bugs.
- **Image Optimization**: Replace `<img>` tags with Next.js `<Image>` component for better performance.
- **Environment Variables**: Ensure all sensitive data is properly secured and not hardcoded.

### Medium Priority
- **Error Handling**: Improve error handling in API routes and components.
- **Testing**: Add unit and integration tests.
- **Accessibility**: Improve accessibility features (ARIA labels, keyboard navigation).
- **Performance**: Optimize database queries and implement caching.

### Low Priority
- **Internationalization**: Expand support for more languages beyond English and French.
- **Mobile Responsiveness**: Fine-tune mobile UI/UX.
- **Documentation**: Add API documentation and component stories.

### Specific Fixes Needed
1. Fix missing dependencies in useEffect/useCallback hooks across multiple files.
2. Replace all `<img>` tags with `<Image>` from next/image.
3. Add proper error boundaries.
4. Implement proper loading states.
5. Add form validation.
6. Fix any potential security vulnerabilities.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Apache License 2.0 Summary

The Apache License 2.0 is a permissive open source license that allows you to:
- ✅ Use the software for any purpose
- ✅ Modify and distribute the software
- ✅ Use patents granted by contributors
- ✅ Include the software in proprietary products

**Requirements:**
- Include a copy of the license in any redistribution
- State any changes made to the original files
- Include copyright and license notices in derivative works

For the full license text, please see the [LICENSE](LICENSE) file in the root directory.

## Support

For support, please open an issue on GitHub or contact the maintainers.

## Acknowledgments

- Built with Next.js and the open-source community
- Icons from Phosphor Icons
- Animations with Framer Motion
