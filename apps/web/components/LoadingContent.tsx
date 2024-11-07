interface LoadingContentProps {
  loading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
}

export function LoadingContent({ loading, error, children }: LoadingContentProps) {
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return <>{children}</>;
} 