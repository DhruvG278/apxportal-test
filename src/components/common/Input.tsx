import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, Mail, Lock, User, Search } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;
  variant?: "default" | "outlined" | "filled";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = "right",
      onIconClick,
      variant = "outlined",
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Handle password visibility toggle
    const handlePasswordToggle = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    // Determine the actual input type
    const inputType = type === "password" && isPasswordVisible ? "text" : type;

    // Auto-generate password visibility icon for password inputs
    const displayIcon =
      type === "password" && !icon ? (
        <button
          type="button"
          onClick={handlePasswordToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      ) : (
        icon
      );

    const handleIconClick = () => {
      if (type === "password" && !icon) {
        handlePasswordToggle();
      } else if (onIconClick) {
        onIconClick();
      }
    };

    const baseClasses =
      "!w-full !px-4 !py-3 !text-base !transition-all !duration-200 focus:!outline-none disabled:!opacity-50 disabled:!cursor-not-allowed !appearance-none !box-border";

    const variantClasses = {
      default:
        "!border-0 !border-b-2 !border-gray-200 !bg-transparent focus:!border-blue-500 !rounded-none",
      outlined:
        "!border-2 !border-solid !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 hover:!border-gray-400",
      filled:
        "!border-2 !border-solid !border-transparent !bg-gray-100 !rounded-lg focus:!bg-white focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 hover:!bg-gray-200",
    };

    const errorClasses = error
      ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
      : "";

    const paddingClasses =
      iconPosition === "left" && displayIcon
        ? "!pl-12"
        : iconPosition === "right" && displayIcon
        ? "!pr-12"
        : "";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`${baseClasses} ${variantClasses[variant]} ${errorClasses} ${paddingClasses} ${className}`}
            style={{
              // Force styles to override browser defaults
              width: "100%",
              padding: "12px 16px",
              fontSize: "16px",
              lineHeight: "1.5",
              border:
                variant === "outlined"
                  ? "2px solid #d1d5db"
                  : variant === "filled"
                  ? "2px solid transparent"
                  : "none",
              borderBottom:
                variant === "default" ? "2px solid #d1d5db" : undefined,
              borderRadius: variant === "default" ? "0" : "8px",
              backgroundColor:
                variant === "filled"
                  ? "#f3f4f6"
                  : variant === "outlined"
                  ? "#ffffff"
                  : "transparent",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              boxSizing: "border-box",
              margin: 0,
              fontFamily: "inherit",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
              appearance: "none",
              paddingLeft:
                iconPosition === "left" && displayIcon ? "48px" : "16px",
              paddingRight:
                iconPosition === "right" && displayIcon ? "48px" : "16px",
              ...(error && {
                borderColor: "#ef4444",
              }),
            }}
            onFocus={(e) => {
              // Apply focus styles via inline styles for maximum reliability
              if (variant === "outlined") {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              } else if (variant === "filled") {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              } else {
                e.target.style.borderBottomColor = "#3b82f6";
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              // Reset focus styles
              if (variant === "outlined") {
                e.target.style.borderColor = error ? "#ef4444" : "#d1d5db";
                e.target.style.boxShadow = "none";
              } else if (variant === "filled") {
                e.target.style.backgroundColor = "#f3f4f6";
                e.target.style.borderColor = "transparent";
                e.target.style.boxShadow = "none";
              } else {
                e.target.style.borderBottomColor = error
                  ? "#ef4444"
                  : "#d1d5db";
              }
              props.onBlur?.(e);
            }}
            {...(props as any)}
          />

          {displayIcon && (
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                iconPosition === "left" ? "left-3" : "right-3"
              } ${onIconClick || type === "password" ? "cursor-pointer" : ""}`}
              onClick={handleIconClick}
            >
              {displayIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
