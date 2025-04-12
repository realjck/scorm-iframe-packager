
import React, { useState } from 'react';
import ScormForm from '@/components/ScormForm';
import ScormPreview from '@/components/ScormPreview';
import { ScormFormData } from '@/types/scorm';
import { generateScormPackage } from '@/utils/scormGenerator';
import { toast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [formData, setFormData] = useState<ScormFormData>({
    scormVersion: "1.2",
    title: "",
    duration: "",
    iframeContent: "",
    completionCode: "",
    endMessage: ""
  });

  const handleFormChange = (data: Partial<ScormFormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
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
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[calc(100vh-2rem)] rounded-lg shadow-md overflow-hidden"
        >
          {/* Left panel: SCORM Configuration Form */}
          <ResizablePanel defaultSize={50} minSize={30} className="bg-gray-800 text-white overflow-auto">
            <ScormForm 
              formData={formData}
              onChange={handleFormChange}
              onDownload={handleDownload}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-600 hover:bg-gray-500 transition-colors" />
          
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
