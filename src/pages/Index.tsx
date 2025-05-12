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
import React, { useState, useEffect, useRef } from 'react';
import ScormForm from '@/components/ScormForm';
import ScormPreview from '@/components/ScormPreview';
import { ScormFormData } from '@/types/scorm';
import { generateScormPackage } from '@/utils/scormGenerator';
import { toast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';

// Key for storing form data in localStorage
const STORAGE_KEY = 'scorm_form_data';

// Default form data
const defaultFormData: ScormFormData = {
  scormVersion: "1.2",
  title: "",
  description: "",
  duration: "",
  iframeContent: "",
  completionCode: "",
  endMessage: "",
  codePromptMessage: "",
  alertMessageRight: "",
  alertMessageWrong: "",
  packageType: "iframe-only"
};

const Index = () => {
  const [formData, setFormData] = useState<ScormFormData>(defaultFormData);
  const previewRef = useRef<any>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
        setFormData(defaultFormData);
      }
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleFormChange = (data: Partial<ScormFormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    toast({
      title: "Form reset",
      description: "All fields have been reset to their default values.",
    });
  };

  const handleResetPreview = () => {
    if (previewRef.current?.reset) {
      previewRef.current.reset();
      toast({
        title: "Preview reset",
        description: "The preview has been reset successfully.",
      });
    }
  };

  const handleDownload = async () => {
    try {
      if (!formData.title) {
        toast({
          title: "Missing title",
          description: "Please enter a title for your SCORM package.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.iframeContent) {
        toast({
          title: "Missing iframe Content",
          description: "Please provide a URL or HTML code.",
          variant: "destructive"
        });
        return;
      }

      if ((formData.packageType === "iframe-with-code") && !formData.completionCode) {
        toast({
          title: "Missing completion code",
          description: "Please enter an Activity completion code.",
          variant: "destructive"
        });
        return;
      }

      await generateScormPackage(formData);

      toast({
        title: "Package generated successfully",
        description: "The download should start automatically.",
      });
    } catch (error) {
      console.error("Error downloading package:", error);
      
      toast({
        title: "Generation error",
        description: "An error occurred while generating the package.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg border"
        >
          {/* Left panel: SCORM Configuration Form with ScrollArea */}
          <ResizablePanel defaultSize={33} minSize={25} className="bg-gray-100">
            <ScrollArea className="h-full black-scrollbar mr-2.5">
              <ScormForm 
                formData={formData}
                onChange={handleFormChange}
                onDownload={handleDownload}
                onReset={handleReset}
                onResetPreview={handleResetPreview}
              />
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-200 hover:bg-gray-300 transition-colors" />
          
          {/* Right panel: Live Preview */}
          <ResizablePanel defaultSize={67} minSize={25} className="bg-white">
            <ScormPreview formData={formData} ref={previewRef} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
