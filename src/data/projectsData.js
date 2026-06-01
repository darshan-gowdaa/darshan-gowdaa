import axiomPulseCloneThumbnail from '../assets/axiom-pulse-clone-thumbnail.avif';
import petrolBunkThumbnail from '../assets/petrol-bunk-management-thumbnail.avif';
import eduWorldThumbnail from '../assets/eduworld-thumbnail.avif';
import headlinesHubThumbnail from '../assets/headlines-hub-thumbnail.avif';
import loginDashboardThumbnail from '../assets/login-dashboard-thumbnail.avif';
import zapierCloneThumbnail from '../assets/zapier-clone-thumbnail.avif';
import expenseTrackerThumbnail from '../assets/expense-tracker-thumbnail.avif';
import adminPortalBackendThumbnail from '../assets/admin-portal-backend-thumbnail.avif';
import wslHadoopThumbnail from '../assets/wsl-hadoop-installer-thumbnail.avif';

export const projects = [
  {
    title: "Petrol Bunk Management System",
    description: "A comprehensive MERN-Stack solution for managing petrol bunk operations. Streamlines inventory tracking, sales reporting, and employee management with real-time data visualization.",
    tags: ["MERN Stack", "Dashboard", "Analytics"],
    image: petrolBunkThumbnail,
    githubLink: "https://github.com/darshan-gowdaa/petrol-bunk-management-system",
    liveLink: "https://petrol-bunk-management-system-alpha.vercel.app/",
  },
  {
    title: "Axiom Pulse Clone",
    description: "A pixel-perfect, high-performance clone of the Axiom Trade Pulse token discovery interface. Built with Next.js 16, TypeScript, Redux Toolkit, and Tailwind CSS, featuring real-time price simulations, atomic architecture, and a fully responsive design.",
    tags: ["Next.js 16", "TypeScript", "Redux Toolkit"],
    image: axiomPulseCloneThumbnail,
    githubLink: "https://github.com/darshan-gowdaa/axiom-trade-pulse-clone",
    liveLink: "https://axiom-pulse-clone-gamma.vercel.app",
  },
  {
    title: "Admin Portal Backend",
    description: "A robust RESTful backend service built with Python and Flask, powering a full-featured admin portal. Implements secure API routing, authentication flows, business logic processing, and acts as the bridge between the React frontend and the database.",
    tags: ["Python", "Flask", "REST API"],
    image: adminPortalBackendThumbnail,
    githubLink: "https://github.com/darshan-gowdaa/admin-portal-backend-py-flask",
    demoVideo: "https://drive.google.com/file/d/1d-CmdBSWoVJl9tIseu0rKCgbN8Hsqudk/view",
  },
  {
    title: "Headlines Hub",
    description: "Modern news aggregator leveraging NewsAPI. Features infinite scrolling, category filtering, and a responsive reading experience built with React and Vite.",
    tags: ["React", "API Integration", "News"],
    image: headlinesHubThumbnail,
    liveLink: "https://headlineshub-react.vercel.app/",
    githubLink: "https://github.com/darshan-gowdaa/headlinesHub-React",
  },
  {
    title: "WSL Hadoop Ecosystem Installer",
    description: "Automated Hadoop ecosystem installer for WSL Ubuntu (learning environment). Provides an interactive menu to install Hadoop, Spark, Kafka, Pig, Hive and Eclipse IDE.",
    tags: ["WSL", "Bash", "Hadoop", "Ubuntu"],
    image: wslHadoopThumbnail,
    githubLink: "https://github.com/darshan-gowdaa/wsl-hadoop-installer",
  },
  {
    title: "EduWorld-FullStack",
    description: "Complete education management ecosystem featuring admission portals, course administration, and an integrated AI chatbot for student enquiries.",
    tags: ["MERN Stack", "AI Chatbot", "Management"],
    image: eduWorldThumbnail,
    githubLink: "https://github.com/darshan-gowdaa/eduworld-fullstack",
    liveLink: "https://eduworld-phi.vercel.app/",
  },
  {
    title: "Login & Dashboard Panel",
    description: "A pixel-perfect admin dashboard featuring interactive charts, user management tables, and comprehensive authentication flows. Built for scalability and responsiveness.",
    tags: ["Vite + JSX", "Tailwind CSS", "Recharts"],
    image: loginDashboardThumbnail,
    liveLink: "https://darshan-gowdaa.github.io/Login-and-Dashboard-Vite/",
    githubLink: "https://github.com/darshan-gowdaa/Login-and-Dashboard-Vite",
  },
  {
    title: "Zapier Interface Clone",
    description: "A meticulous recreation of the Zapier Interface tab, demonstrating advanced search logic, dynamic filtering, and complex state management with TypeScript.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    image: zapierCloneThumbnail,
    liveLink: "https://darshan-gowdaa.github.io/Zapier-Clone-React/",
    githubLink: "https://github.com/darshan-gowdaa/Zapier-Clone-React",
  },
  {
    title: "Expense Tracker",
    description: "A full-stack web application to manage finances. Users can track income/expenses with CRUD capabilities. Built with a responsive LAMP stack architecture.",
    tags: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
    image: expenseTrackerThumbnail,
    githubLink: "https://github.com/darshan-gowdaa/expense-tracker",
    demoVideo: "https://drive.google.com/file/d/1zOWsi7jQCVbzGqryi4eOY65X6LACZpXT/view?usp=drivesdk",
    isVignette: true,
  },
];
