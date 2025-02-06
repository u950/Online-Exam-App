import { useState } from "react";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState("stats");

  const Labels = [
    { id: "stats", label: "Statistics" },
    { id: "services", label: "What you will Get" },
    { id: "faq", label: "FAQ" },
  ]
    
  const StatCounts = [
    { label: "Questions", value: "300" },
    { label: "Mock tests", value: "10" },
    { label: "Maths", value: "30" },
    { label: "Physics", value: "25" },
    { label: "Chemistry", value: "39" },
    { label: "Hours spent", value: "10+" },
  ];

  const StatsInfo = [
    "Dynamic test reports",
     "Student performance", 
     "Subject wise Analysis", 
     "Admin remarks"
    ]

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select tab
        </label>
        <select
          id="tabs"
          className="bg-gray-50 border-0 border-b border-gray-200 text-gray-900 text-sm rounded-t-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => setActiveTab(e.target.value)}
          value={activeTab}
        >
          <option value="stats">Statistics</option>
          <option value="services">Services</option>
          <option value="faq">FAQ</option>
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400 rtl:divide-x-reverse" role="tablist">
        {Labels.map((tab) => (
          <li key={tab.id} className="w-full">
            <button
              onClick={() => setActiveTab(tab.id)}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 ${
                activeTab === tab.id ? "font-bold" : ""
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 dark:border-gray-600">
        {activeTab === "stats" && (
          <div className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800">
            <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
              {StatCounts.map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                  <dt className="mb-2 text-3xl font-extrabold">{item.value}</dt>
                  <dd className="text-gray-500 dark:text-gray-400">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {activeTab === "services" && (
          <div className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800">
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              We invest in the world’s potential
            </h2>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              {StatsInfo.map(
                (item, index) => (
                  <li key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="leading-tight">{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        {activeTab === "faq" && (
          <div className="p-4 bg-white rounded-lg dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">FAQ</h2>
            <p className="text-gray-500 dark:text-gray-400">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
