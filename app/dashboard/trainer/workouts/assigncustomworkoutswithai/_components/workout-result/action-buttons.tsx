import { Button } from "@/components/ui/button";
import { Save, MessageSquare } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  onDiscard: () => void;
  isLoading: boolean;
  showFeedbackChat?: boolean;
  toggleFeedback?: () => void;
}

export default function ActionButtons({ 
  onSave, 
  onDiscard, 
  isLoading,
  showFeedbackChat = false,
  toggleFeedback
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t">
      <Button 
        variant="outline" 
        onClick={onDiscard} 
        className="h-12 sm:h-11 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
      >
        Discard Plan
      </Button>
      
      {toggleFeedback && (
        <Button
          variant="outline"
          onClick={toggleFeedback}
          className={`h-12 sm:h-11 ${
            showFeedbackChat 
              ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
              : "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
          } transition-colors`}
        >
          <MessageSquare className="h-4 w-4 mr-2" /> 
          {showFeedbackChat ? "Hide Feedback" : "Provide Feedback"}
        </Button>
      )}
      
      <Button 
        onClick={onSave} 
        disabled={isLoading} 
        className="h-12 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" /> Save Workout Plan
          </>
        )}
      </Button>
    </div>
  );
}
