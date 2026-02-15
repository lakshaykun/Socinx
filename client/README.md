# Socinx - Modern Social Media Platform

![Socinx Logo](./public/assets/images/socinx.png)

Socinx is a modern, feature-rich social media platform built with React, TypeScript, and Vite. It combines powerful front-end technologies with an intelligent recommendation engine to deliver a personalized social networking experience.

## ✨ Features

- **Authentication & Authorization**
  - Secure user signup and signin
  - Google authentication integration
  - Protected routes and user sessions

- **Social Interaction**
  - Create, edit, and delete posts
  - Like and bookmark posts
  - Follow/unfollow users
  - Comment on posts
  - Real-time post statistics

- **Profile Management**
  - Customizable user profiles
  - Profile picture upload
  - Bio and personal information management
  - Activity tracking (likes, posts, saved items)

- **Content Discovery**
  - Smart content recommendation engine
  - Explore page for discovering new content
  - Search functionality for posts and users
  - Trending posts and popular users

- **Responsive Design**
  - Mobile-first approach
  - Bottom navigation for mobile users
  - Sidebar navigation for desktop
  - Optimized media viewing experience

## 🚀 Technologies

- **Frontend**
  - React + TypeScript
  - Vite (Build tool)
  - TailwindCSS (Styling)
  - React Query (Data fetching)
  - React Hook Form (Form handling)
  - Shadcn (UI components)

- **Backend & Services**
  - Appwrite (Backend as a Service)
  - External Recommendation Engine
  - File Storage & CDN

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/socinx.git
   cd socinx
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_URL=your_appwrite_url
   VITE_APPWRITE_STORAGE_ID=your_storage_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_SAVES_COLLECTION_ID=your_saves_collection_id
   VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
   VITE_APPWRITE_POST_COLLECTION_ID=your_post_collection_id
   VITE_RECOMMENDER_API_URL=your_recommender_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Usage

1. Sign up for a new account or sign in
2. Create your profile and customize it
3. Start creating posts and engaging with other users
4. Explore recommended content based on your interests
5. Save posts and follow users you're interested in

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌐 Architecture

Socinx uses a modern web architecture with:
- Client-side rendering using React
- Appwrite for backend services
- External recommendation engine for personalized content
- Query caching and optimistic updates
- Responsive and accessible UI components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from [public/assets/icons](./public/assets/icons)
- UI Components from Shadcn
- Styling inspiration from modern social media platforms

---

Created by [Lakshay]
