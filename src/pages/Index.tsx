
import React, { useState } from 'react';
import ScormForm from '@/components/ScormForm';
import ScormPreview from '@/components/ScormPreview';
import { ScormFormData } from '@/types/scorm';
import { generateScormPackage } from '@/utils/scormGenerator';
import { toast } from '@/hooks/use-toast';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-2rem)]">
          {/* Left panel: SCORM Configuration Form */}
          <div className="bg-gray-100 rounded-lg overflow-auto">
            <ScormForm 
              formData={formData}
              onChange={handleFormChange}
              onDownload={handleDownload}
            />
          </div>
          
          {/* Right panel: Live Preview */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <ScormPreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
