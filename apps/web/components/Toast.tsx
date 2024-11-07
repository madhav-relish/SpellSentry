import { toast, ToastT } from "sonner";

interface ToastOptions {
  title?: string;
  description: string;
}

export const toastError = ({ title = "Error", description }: ToastOptions) => {
  toast.error(description, {
    description: title,
  });
};

export const toastSuccess = ({ title = "Success", description }: ToastOptions) => {
  toast.success(description, {
    description: title,
  });
}; 