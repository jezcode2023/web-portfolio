import { Link, useNavigate } from "react-router-dom";
import Jezreel from "../assets/jezortiz.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBars, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative">
      <div className="flex flex-col gap-4 mb-16">
        <div className="flex justify-between items-center">
          <a href="./">
          <h3 
          className="text-3xl font-bold"
         onClick={() => navigate('./')}

          >Jez.Code</h3> </a>
          <div className="flex gap-8">
            <Link to="https://jezcode2023.github.io/jez-code/" className="hover:text-orange-400">Home</Link>
            <Link to="https://github.com/jezcode2023" className="hover:text-orange-400">Portfolio</Link>
            <Link to="https://drive.google.com/file/d/1_kvMS9BfKlG4YyyXUFXHQ5PNN1TRQBmX/view" className="border border-black px-4 py-1 rounded hover:bg-black hover:text-white transition-all">Resume</Link>
          </div>
        </div>
        
        {/* Hamburger Menu */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="flex items-center gap-2 text-gray-700 hover:text-orange-400 transition-all"
          >
            <FaBars size={24} />
            <span></span>
          </button>

          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md z-50 w-40"
            >
              {['Students', 'Subjects', 'Grades'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-100 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto mt-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 space-y-4"
        >
          <h1 className="text-5xl font-bold mb-4">
            Hello,<br />
            I am Jezreel.
          </h1>
          <h2 className="text-2xl text-yellow-400 mb-4">Web Developer</h2>
          <p className="text-gray-600 max-w-lg">
            Hello, I am an aspiring web developer with the ability to translate designs 
            into functional front-end applications.
          </p>
           <a
            href="https://jezcode2023.github.io/jez-code/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-orange-400 text-white px-8 py-3 rounded-md mt-6"
            >
              Hire Me
            </motion.button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 2, x: 0 }}
          transition={{ duration: 2 }}
          className="md:w-1/2 relative"
        >
          <div className="bg-blue-900 rounded-full w-[450px] h-[450px] absolute top-1 right-0 -z-10" />
          <img
            src={Jezreel}
            alt="Jezreel"
            className="w-[400px] h-[400px] object-cover rounded-full"
          />
        </motion.div>
      </div>

      <footer className="bg-gray-50 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-800">Jezreel Ortiz</h3>
              <p className="text-gray-600 mt-1">Web Developer</p>
            </div>

            <div className="flex space-x-6">
              <a href="https://jezcode2023.github.io/jez-code/" className="text-gray-600 hover:text-orange-400">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/jezreel-ortiz/" className="text-gray-600 hover:text-orange-400">
                <FaLinkedin size={24} />
              </a>
              <a href="https://x.com/jzrlortz" className="text-gray-600 hover:text-orange-400">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <p className="text-gray-600 text-sm text-center md:text-center">
                © {new Date().getFullYear()} Jez.Code. All rights reserved.
              </p>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}