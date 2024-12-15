

// eslint-disable-next-line react/prop-types
const Tabs = ({activeTab,setActiveTab}) => {
  return (
    <div className="flex flex-wrap justify-center md:justify-start border-b mb-14">
    {[
      { label: "Summary", value: "summary" },
      { label: "Chart", value: "chart" },
      { label: "Statistics", value: "statistics" },
      { label: "Analysis", value: "analysis" },
      { label: "Settings", value: "settings" },
    ].map((tab) => (
      <button
        key={tab.value}
        className={`px-4 py-2 text-sm font-medium border-b-2 ${
          activeTab === tab.value
            ? "border-[#4B40EE] text-[#1A243A]"
            : "border-transparent text-[#6F7177]"
        }`}
        onClick={() => setActiveTab(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
  )
}

export default Tabs