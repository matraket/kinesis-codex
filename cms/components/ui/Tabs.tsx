type TabOption = {
  id: string;
  label: string;
  description?: string;
};

type Props = {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
};

export function TabSwitcher({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-white/5 p-1 text-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex min-w-[140px] flex-col gap-0.5 rounded-md px-3 py-2 text-left transition ${
            activeTab === tab.id
              ? 'bg-primary/80 text-white shadow-sm'
              : 'text-muted hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="font-semibold">{tab.label}</span>
          {tab.description ? <span className="text-xs text-muted">{tab.description}</span> : null}
        </button>
      ))}
    </div>
  );
}
