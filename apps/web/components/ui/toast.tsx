import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description: string;
};
export const toastError = ({ title, description }: ToastProps) => {
  toast.error(description);
};

export const toastSuccess = ({ title, description }: ToastProps) => {
  toast.success(description);
};