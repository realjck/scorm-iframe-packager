/**

 * This file is part of a project licensed under the GNU General Public License v3.0.
 * 
 * Copyright (c) 2025 JCK
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * See <https://www.gnu.org/licenses/> for more details.
 */

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScormFormData } from '@/types/scorm';
import ReactMarkdown from 'react-markdown';

interface ScormPreviewProps {
  formData: ScormFormData;
}

// Using forwardRef to allow the component to receive a ref from its parent
const ScormPreview = forwardRef<any, ScormPreviewProps>(({ formData }, ref) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState('incomplete');

  // Function to reset the preview state
  const resetPreview = () => {
    setEnteredCode('');
    setIsCompleted(false);
    setShowAlert(false);
    setAlertMessage('');
    setStatus('incomplete');
    // Attendre que isCompleted soit mis à jour avant de réafficher l'iframe
    setTimeout(() => {
      renderIframeContent();
    }, 0);
  };

  // Expose the reset function to the parent via ref
  useImperativeHandle(ref, () => ({
    reset: resetPreview,
  }));

  const handleValidate = () => {
    if (enteredCode.toLowerCase() === formData.completionCode.toLowerCase()) {
      setIsCompleted(true);
      setStatus('completed');
      setShowAlert(true);
      setAlertMessage(formData.alertMessageRight || "Congratulations!");
    } else {
      setShowAlert(true);
      setAlertMessage(formData.alertMessageWrong || "Incorrect code. Please try again.");
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
    
    if (!content || content.length <= 8) return;
    
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
    setShowAlert(false);
  }, [formData.iframeContent]);

  return (
    <div className="h-full flex flex-col">
      {/* Header only shown for iframe-with-code */}
      {formData.packageType === 'iframe-with-code' && (
        <div 
          className="preview-header p-4 flex items-center" 
          style={{
            backgroundColor: formData.headerBgColor || '#f0f0f0',
            color: formData.headerTextColor || '#000000'
          }}
        >
          {formData.logo && (
            <img 
              src={formData.logo} 
              alt="Logo" 
              className="h-8 mr-4 object-contain"
            />
          )}
          <span className="mr-3">{formData.codePromptMessage || "Please enter the code given at the end of the activity:"}</span>
          <Input 
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            className="w-52 mr-2 text-black"
            disabled={isCompleted}
          />
          <Button 
            onClick={handleValidate} 
            style={{
              backgroundColor: formData.buttonBgColor || '#1a57d1',
              color: formData.buttonTextColor || '#ffffff'
            }}
            disabled={isCompleted}
          >
            {formData.buttonText || "Validate"}
          </Button>
        </div>
      )}
      
      {showAlert && formData.packageType === 'iframe-with-code' && (
        <Alert className={isCompleted ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      {(isCompleted && formData.packageType === 'iframe-with-code') ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center prose dark:prose-invert">
            <ReactMarkdown>
              {formData.endMessage || '# Module completed\n\nCongratulations! You have completed this module.'}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <>
          {!formData.iframeContent ? (
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-semibold text-white mb-4">No Content Available</h2>
            <p className="text-gray-300">
              Please enter a URL or HTML code in the "Iframe content" field to see the preview.
            </p>
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
        </>
      )}
    </div>
  );
});

ScormPreview.displayName = 'ScormPreview';

export default ScormPreview;
