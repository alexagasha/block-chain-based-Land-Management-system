// Home.js
import { Link } from "react-router-dom";
import "./LoginRegister.css";
import "./LandManagement.css";
import "./LoginRegister.js"
import "./LandManagement.js"


// ✅ Import images
import logo from "./photos/logo.png";
import dev1 from "./photos/dev1.JPG";
import dev2 from "./photos/dev2.jpg";
import dev3 from "./photos/dev3.png";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 font-unbounded">
      <header className="header-section">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between relative">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <h1 className="header-title text-2xl font-bold text-white tracking-wide absolute left-1/2 transform -translate-x-1/2 text-center">
            Land Management System
          </h1>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="btn btn-primary px-4 py-2 rounded-md hover:scale-105 transition-transform"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="btn btn-outline px-4 py-2 rounded-md hover:scale-105 transition-transform"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="main-section flex-grow py-16 relative">
        <div className="container mx-auto px-4">
          {/* Info Section */}
          <div className="info-section card p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              About Land in Uganda
            </h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              Uganda, known as the "Pearl of Africa," has a rich and diverse
              landscape with a significant portion of its economy and culture
              tied to land. Land ownership plays a central role in agriculture,
              settlement, and cultural heritage. However, issues such as unclear
              land titles, disputes, and limited access to reliable records
              continue to challenge development. The Land Management System
              seeks to modernize land registration, promote transparency,
              enhance security of ownership, and support sustainable development
              for all Ugandans.
            </p>
          </div>

          {/* Developers Team Section */}
          <div className="team-section card mt-12 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Meet the Developers
            </h2>

            {/* Top row: Developer 1 & 2 */}
            <div className="developer-row flex flex-wrap justify-center gap-8 mb-8">
              <div className="developer-card text-center">
                <img src={dev1} alt="Developer 1" className="developer-img" />
                <h3 className="text-xl font-semibold text-blue-900">Agasha Alex</h3>
                <p className="text-gray-600">Blockchain Engineer</p>
              </div>
              <div className="developer-card text-center">
                <img src={dev2} alt="Developer 2" className="developer-img" />
                <h3 className="text-xl font-semibold text-blue-900">Etama Peter</h3>
                <p className="text-gray-600">Frontend Developer</p>
              </div>
            </div>

            {/* Bottom row: Developer 3 */}
            <div className="developer-row flex justify-center">
              <div className="developer-card text-center">
                <img src={dev3} alt="Developer 3" className="developer-img developer-img-large mb-2" />
                <h3 className="text-2xl font-bold text-blue-900">Mr. Ojuka Nelson</h3>
                <p className="text-gray-600">Project Supervisor</p>
              </div>
            </div>
          </div>

          {/* Animated Objects */}
          <div className="moving-object leaf-1"></div>
          <div className="moving-object leaf-2"></div>
          <div className="moving-object coffee-bean"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-section mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-gray-400">
            © {new Date().getFullYear()} <span className="text-cyan-400 font-semibold">Lands Management System</span>. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-500">
            Powered by <span className="text-emerald-400">Blockchain Technology</span> • Built with ❤️ by the Dev Team
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
