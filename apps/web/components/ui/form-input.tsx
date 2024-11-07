import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  registerProps?: any;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, registerProps, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Input
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...registerProps}
          {...props}
          ref={ref}
        />
        {error && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";