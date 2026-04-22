interface CustomTableFilterSectionProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomTableFilterSection({
  value,
  onChange,
  placeholder = 'Ara...',
}: CustomTableFilterSectionProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
      />
    </div>
  );
}
