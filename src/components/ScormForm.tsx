import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from 'lucide-react';
import { ScormFormData } from '@/types/scorm';

interface ScormFormProps {
  formData: ScormFormData;
  onChange: (data: Partial<ScormFormData>) => void;
  onDownload: () => void;
  onReset: () => void;
  onResetPreview: () => void;
}

const ScormForm = ({ formData, onChange, onDownload, onReset, onResetPreview }: ScormFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ [e.target.name]: e.target.value });
  };

  const handleReloadIframe = () => {
    // Now this will only reset the preview part
    onResetPreview();
  };

  return (
    <div className="p-6 bg-muted rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-600">SCORM iframe packager</h1>
      <h2 className="text-1xl mb-6 text-gray-600">Générez facilement un package SCORM avec votre contenu HTML. La partie droite de l'écran affiche le contenu de votre package.</h2>
      <div className="space-y-6">
        <div>
          <p className="mb-2">Version :</p>
          <RadioGroup
            name="scormVersion"
            value={formData.scormVersion}
            onValueChange={(value: "1.2" | "2004") => onChange({ scormVersion: value })}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1.2" id="scorm12" />
              <Label htmlFor="scorm12">SCORM 1.2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2004" id="scorm2004" />
              <Label htmlFor="scorm2004">SCORM 2004 (à venir)</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="title" className="mb-2 block">Titre du package :</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="duration" className="mb-2 block">Durée en minutes (ex: 30) :</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="iframeContent">Contenu de l'iframe :</Label>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleReloadIframe}
              title="Recharger"
              className="h-8 w-8 border-gray-300 hover:bg-black hover:text-white"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
          <Textarea
            id="iframeContent"
            name="iframeContent"
            value={formData.iframeContent}
            onChange={handleChange}
            placeholder="URL ou code HTML"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="completionCode" className="mb-2 block">Code de fin d'activité :</Label>
          <Input
            id="completionCode"
            name="completionCode"
            value={formData.completionCode}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="endMessage" className="mb-2 block">Message de fin (optionnel) :</Label>
          <Textarea
            id="endMessage"
            name="endMessage"
            value={formData.endMessage}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>

        <Button 
          onClick={onDownload} 
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          <Download className="mr-2 h-4 w-4" /> Télécharger le package
        </Button>
      </div>
    </div>
  );
};

export default ScormForm;
