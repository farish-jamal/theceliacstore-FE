"use client";

import clsx from "clsx";

type FloatingLabelInputProps = {
  id: string;
  type?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
};

export const FloatingLabelInput = ({
  id,
  type = "text",
  label,
  value = "",
  onChange,
  placeholder = " ",
  required = false,
  name
}: FloatingLabelInputProps) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "peer w-full rounded-md border border-gray-300 px-3 pt-3 pb-3 text-sm shadow-sm transition-all",
          "focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
        )}
      />
      <label
        htmlFor={id}
        className={clsx(
          "absolute -top-2 left-2 px-1 text-xs text-gray-950 bg-white",
          "transition-all duration-200"
        )}
      >
        {label}
      </label>
    </div>
  );
};
