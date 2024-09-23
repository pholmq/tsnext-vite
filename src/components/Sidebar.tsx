import React, { useState, useEffect } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [settings, setSettings] = useState({ darkMode: false });
  const [chapter, setChapter] = useState("1-a-brief-look");
  const [isLeft, setIsLeft] = useState(false); // Sidebar position state

  // Load saved settings, chapter, and sidebar position from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    const savedChapter = localStorage.getItem("currentChapter");
    const savedIsLeft = localStorage.getItem("sidebarPosition");

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedChapter) setChapter(savedChapter);
    if (savedIsLeft) setIsLeft(JSON.parse(savedIsLeft)); // Retrieve sidebar position
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Save the current chapter to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("currentChapter", chapter);
  }, [chapter]);

  // Save the sidebar position (left or right) to localStorage when it changes
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
              ? "left-[25rem]" // Button when open on the left side
              : "left-[2rem]" // Button when closed on the left side
            : isOpen
            ? "right-[25rem]" // Button when open on the right side
            : "right-[2rem]" // Button when closed on the right side
        }`}
      >
        {isOpen ? "Close" : "Settings"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 h-full w-96 bg-gray-900 text-white transform ${
          isOpen ? 'translate-x-0' : isLeft ? '-translate-x-full' : 'translate-x-full'
        } transition-transform duration-500 ease-in-out shadow-lg overflow-y-auto ${
          isLeft ? 'left-0' : 'right-0'
        }`}
      >
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex justify-around">
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
              <h2 className="text-xl font-bold mb-4">Book Reader</h2>
              <div className="mb-4">
                <label className="block mb-2">Select Chapter</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="block w-full p-2 rounded bg-gray-800 border border-gray-700"
                >
                  <option value="1-a-brief-look">Chapter 1: A Brief Look</option>
                  <option value="2-another-chapter">Chapter 2: Another Chapter</option>
                </select>
              </div>
              <iframe
                src={`https://book.tychos.space/chapters/${chapter}/`}
                title="Book Reader"
                className="w-full h-96 border-none rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
