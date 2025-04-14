
import React, { useState, useEffect } from 'react';
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
  duration: "",
  iframeContent: "",
  completionCode: "",
  endMessage: ""
};

const Index = () => {
  const [formData, setFormData] = useState<ScormFormData>(defaultFormData);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
        // If parsing fails, use default form data
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
      title: "Formulaire réinitialisé",
      description: "Tous les champs ont été réinitialisés à leur valeur par défaut.",
    });
  };

  const handleDownload = async () => {
    try {
      if (!formData.title) {
        toast({
          title: "Titre manquant",
          description: "Veuillez entrer un titre pour votre package SCORM.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.completionCode) {
        toast({
          title: "Code de complétion manquant",
          description: "Veuillez entrer un code de complétion.",
          variant: "destructive"
        });
        return;
      }

      await generateScormPackage(formData);

      toast({
        title: "Package généré avec succès",
        description: "Le téléchargement devrait commencer automatiquement.",
      });
    } catch (error) {
      console.error("Error downloading package:", error);
      
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération du package.",
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
          <ResizablePanel defaultSize={50} minSize={30} className="bg-gray-100">
            <ScrollArea className="h-full black-scrollbar">
              <ScormForm 
                formData={formData}
                onChange={handleFormChange}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-200 hover:bg-gray-300 transition-colors" />
          
          {/* Right panel: Live Preview */}
          <ResizablePanel defaultSize={50} minSize={30} className="bg-white">
            <ScormPreview formData={formData} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
