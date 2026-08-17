import * as RadixSelect from "@radix-ui/react-select";
import { IconCheck } from "./icons.jsx";
import "./Select.css";

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Select({ id, label, value, onValueChange, options, placeholder = "Elegir...", disabled }) {
  return (
    <div className="text-field">
      {label && <label id={id ? `${id}-label` : undefined}>{label}</label>}
      <RadixSelect.Root value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger className="select-trigger" aria-labelledby={id ? `${id}-label` : undefined} id={id}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="select-icon">
            <ChevronIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="select-content" position="popper" sideOffset={4}>
            <RadixSelect.Viewport className="select-viewport">
              {options.map((option) => (
                <RadixSelect.Item key={option.value} value={option.value} className="select-item">
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="select-item-indicator">
                    <IconCheck size={14} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

export default Select;
