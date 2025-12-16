import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{message}</p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
