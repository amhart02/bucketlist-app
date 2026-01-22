interface AuthErrorProps {
  message: string;
}

export default function AuthError({ message }: AuthErrorProps) {
  return (
    <div
      className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md"
      role="alert"
    >
      <p className="text-sm">{message}</p>
    </div>
  );
}
