import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { ScormFormData } from '@/types/scorm';

interface ScormFormProps {
  formData: ScormFormData;
  onChange: (data: Partial<ScormFormData>) => void;
  onDownload: () => void;
}

const ScormForm = ({ formData, onChange, onDownload }: ScormFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-muted rounded-md">
      <h1 className="text-4xl font-light mb-6 text-gray-600">SCORM packager</h1>
      
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
              <Label htmlFor="scorm2004">SCORM 2004</Label>
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
          <Label htmlFor="duration" className="mb-2 block">Durée (ex: 30mn) :</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="iframeContent" className="mb-2 block">Contenu de l'iframe :</Label>
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
          <Label htmlFor="endMessage" className="mb-2 block">Message de fin :</Label>
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
