import React, { useState, useEffect } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [settings, setSettings] = useState({ darkMode: false });
  const [chapter, setChapter] = useState("1-a-brief-look");
  const [isLeft, setIsLeft] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // State to handle mobile view

  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    const savedChapter = localStorage.getItem("currentChapter");
    const savedIsLeft = localStorage.getItem("sidebarPosition");

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedChapter) setChapter(savedChapter);
    if (savedIsLeft) setIsLeft(JSON.parse(savedIsLeft));

    // Check if the screen is smaller than 768px (mobile size)
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Update on window resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("currentChapter", chapter);
  }, [chapter]);

  useEffect(() => {
    localStorage.setItem("sidebarPosition", JSON.stringify(isLeft));
  }, [isLeft]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-end items-center">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 z-50 px-4 py-2 bg-gray-800 text-white rounded ${
          isOpen ? 'opacity-100' : 'opacity-50'
        } hover:opacity-100 transition-all transform ${
          isLeft
            ? isOpen
              ? "left-[25rem]" 
              : "left-[2rem]" 
            : isOpen
            ? "right-[25rem]" 
            : "right-[2rem]"
        }${isMobile ? 'w-10 h-10':''}`}
      >
        {/* Conditionally render button content based on screen size */}
        {isMobile ? "⚙️" : isOpen ? "Close" : "⚙️ Settings"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 max-h-screen w-96 bg-gray-900 text-white transform ${
          isOpen ? 'translate-x-0' : isLeft ? '-translate-x-full' : 'translate-x-full'
        } transition-transform duration-500 ease-in-out shadow-lg overflow-y-auto ${
          isLeft ? 'left-0' : 'right-0'
        }`}
      >
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex justify-items-start">
            {['settings', 'info', 'book'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg ${
                  activeTab === tab ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={settings.darkMode}
                  onChange={(e) =>
                    setSettings({ ...settings, darkMode: e.target.checked })
                  }
                />
                <span>Enable Dark Mode</span>
              </label>
              {/* Move Sidebar Button inside Settings */}
              <button
                onClick={() => setIsLeft(!isLeft)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-all"
              >
                {isLeft ? "Move to Right" : "Move to Left"}
              </button>
            </div>
          )}

          {activeTab === "info" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Information</h2>
              <p className="text-sm">
                This sidebar allows you to configure settings, view info, and read a book.
              </p>
            </div>
          )}

          {activeTab === "book" && (
            <div>
              <h2 className="text-xl max-h-screen font-bold mb-4">Book Reader</h2>
              <div className="mb-4">
                <label className="block mb-2">Select Chapter</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="block w-full p-2 rounded bg-gray-800 border border-gray-700"
                >
                  <option value="1-a-brief-look">Chapter 1 — A brief history of geo-heliocentrism</option>
                  <option value="2-about-binary-systems">Chapter 2 — About binary / double star systems</option>
                  <option value="3-about-our-sun-mars">Chapter 3 — About our Sun-Mars binary system</option>
                  <option value="4-intro-tychos">Chapter 4 — Introducing the TYCHOS model</option>
                  <option value="5-mars">Chapter 5 — Mars, the “key” that Kepler never found</option>
                  <option value="6-sirius">Chapter 6 — Is Sirius the twin of our Solar System?</option>
                  <option value="7-the-copernican-model">Chapter 7 — The Copernican model: a geometric impossibility</option>
                  <option value="8-suns-two-moons">Chapter 8 — About the Sun's two moons: Mercury & Venus</option>
                  <option value="9-tilts-obliquities-osci">Chapter 9 — Tilts, obliquities and oscillations</option>
                  <option value="10-requiem">Chapter 10 — Requiem for the “Lunisolar Wobble” theory</option>
                  <option value="11-earths-pvp-orbit">Chapter 11 — Earth’s PVP orbit (Polaris-Vega-Polaris)</option>
                  <option value="12-relative-motions">Chapter 12 — The relative motions of the Sun and Earth</option>
                  <option value="13-the-central-driveshaft">Chapter 13 — Our system's 'central driveshaft': the Moon</option>
                  <option value="14-the-moon">Chapter 14 — The Moon: curing Newton's headache</option>
                  <option value="15-our-asteroid-belts">Chapter 15 — Our Asteroid belts and Meteor showers</option>
                  <option value="16-our-cosmic-clockwork">Chapter 16 — Our Cosmic Clockwork and the “16 factor”</option>
                  <option value="17-the-great-inequality">Chapter 17 — “The Great Inequality” - solved by the TYCHOS</option>
                  <option value="18-uranus-neptune-pluto">Chapter 18 — Uranus, Neptune & Pluto prove the PVP orbit</option>
                  <option value="19-the-tychos-great-year">Chapter 19: Understanding the TYCHOS' Great Year</option>
                  <option value="20-the-811000-mega-cycle">Chapter 20: The 811000-year Mega Cycle</option>
                  <option value="21-mans-yearly-path">Chapter 21 — A Man's Yearly Path - and the Analemma</option>
                  <option value="22-bradley-einstein">Chapter 22 — Deconstructing Bradley and Einstein</option>
                  <option value="23-are-the-stars-closer">Chapter 23 — Are the stars much closer than believed?</option>
                  <option value="24-dayton-miller">Chapter 24 — Dayton Miller - and the speed of Earth</option>
                  <option value="25-negative-parallax">Chapter 25 — The 'Negative' Stellar Parallax demystified</option>
                  <option value="26-probing-kapteyn">Chapter 26 — Probing Kapteyn, Hubble and Esclangon</option>
                  <option value="27-the-momentous-incongruity">Chapter 27 — The MOMENTOUS incongruity</option>
                  <option value="28-the-barnards-star">Chapter 28 — The Barnard's star confirms the TYCHOS</option>
                  <option value="29-eros-and-tychos">Chapter 29 — EROS and TYCHOS: love at first sight</option>
                  <option value="30-halleys-comet">Chapter 30 — Halley's comet: the Great Deceiver</option>
                  <option value="31-list-of-puzzles">Chapter 31 — List of puzzles solved by the TYCHOS</option>
                  <option value="32-epilogue">Chapter 32 — Epilogue: may reason prevail</option>
                  </select>
              </div>
              <iframe
                src={`https://book.tychos.space/chapters/${chapter}/`}
                title="Book Reader"
                className="w-full h-screen border-none rounded"
                style={{ maxWidth: "95vw", maxHeight: "80vh" }}
                 />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
