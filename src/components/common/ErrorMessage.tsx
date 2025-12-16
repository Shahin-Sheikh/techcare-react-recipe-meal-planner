import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Card className="max-w-md w-full border-red-200 bg-red-50/50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="shrink-0 mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Oops!</h3>
              <p className="text-sm text-red-700 mb-4">{message}</p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
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
