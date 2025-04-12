
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScormFormData } from '@/types/scorm';

interface ScormPreviewProps {
  formData: ScormFormData;
}

const ScormPreview = ({ formData }: ScormPreviewProps) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState('incomplete');

  const handleValidate = () => {
    if (enteredCode === formData.completionCode) {
      setIsCompleted(true);
      setStatus('completed');
      setShowAlert(true);
      setAlertMessage(formData.endMessage || "Félicitations! Vous avez terminé ce module.");
    } else {
      setShowAlert(true);
      setAlertMessage("Code incorrect. Veuillez réessayer.");
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Function to determine if content is a URL
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Function to render content in iframe
  const renderIframeContent = () => {
    const content = formData.iframeContent;
    
    if (!content) return;
    
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      if (isUrl(content)) {
        iframe.src = content;
      } else {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(content);
          doc.close();
        }
      }
    }
  };

  // Render iframe content whenever it changes
  useEffect(() => {
    renderIframeContent();
    // Reset status to incomplete when content changes
    setStatus('incomplete');
    setIsCompleted(false);
  }, [formData.iframeContent]);

  return (
    <div className="h-full flex flex-col">
      <div className="preview-header p-4 flex items-center">
        <span className="mr-3">Veuillez entrer le code donné en fin d'activité :</span>
        <Input 
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
          className="w-52 mr-2"
          disabled={isCompleted}
        />
        <Button 
          onClick={handleValidate} 
          variant="default"
          disabled={isCompleted}
        >
          Valider
        </Button>
        <span className="ml-3 text-xs italic text-gray-500">
          Status: {status}
        </span>
      </div>
      
      {showAlert && (
        <Alert className={isCompleted ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      {isCompleted ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Module terminé</h2>
            <p className="text-gray-600">{formData.endMessage}</p>
          </div>
        </div>
      ) : (
        <iframe 
          ref={iframeRef}
          className="iframe-preview flex-1 w-full"
          title="SCORM Content Preview"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      )}
    </div>
  );
};

export default ScormPreview;
