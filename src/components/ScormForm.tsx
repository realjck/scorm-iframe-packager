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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <img src="./assets/images/icon.png" alt="SCORM Packager Icon" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-gray-600">Web2SCORM</h1>
      </div>
      <h2 className="text-1xl mb-6 text-gray-600">Easily generate a SCORM package with your HTML content. The right side of the screen displays your package content.</h2>
      
      <div className="space-y-8">
        {/* Section Manifest SCORM */}
        <div className="rounded-lg border border-gray-400 p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">SCORM Manifest</h3>
          <div className="space-y-6">
            <div>
              <p className="mb-2">Version:</p>
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
              <Label htmlFor="title" className="mb-2 block">SCORM manifest title:</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">SCORM manifest description:</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="SCORM content generated with Web2SCORM"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="duration" className="mb-2 block">SCORM manifest duration in minutes (e.g., 30):</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Package Content Section */}
        <div className="rounded-lg border border-gray-400 p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">Package Content</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="iframeContent">Iframe content:</Label>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleReloadIframe}
                  title="Reload"
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
                placeholder="URL or HTML code"
                className="min-h-[120px]"
              />
            </div>

            {/* Customization section */}
            <div className="rounded-lg border border-gray-300 p-4 bg-gray-50">
              <h4 className="text-md font-semibold mb-4 text-gray-700">Interface Customization</h4>
              
              <div className="space-y-4">
                {/* Logo upload field */}
                <div className="mb-4">
                  <Label htmlFor="logo" className="mb-2 block">Logo:</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1024 * 1024) {
                            alert("File is too large. Maximum size: 1MB");
                            e.target.value = '';
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            onChange({ logo: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="flex-1"
                    />
                    {formData.logo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChange({ logo: undefined })}
                        className="px-2"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {formData.logo && (
                    <img 
                      src={formData.logo} 
                      alt="Logo preview" 
                      className="mt-2 h-8 object-contain"
                    />
                  )}
                </div>

                {/* Color pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headerBgColor" className="mb-2 block">Header background color:</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="headerBgColor"
                        name="headerBgColor"
                        value={formData.headerBgColor || "#f0f0f0"}
                        onChange={handleChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.headerBgColor || "#f0f0f0"}
                        onChange={handleChange}
                        name="headerBgColor"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="headerTextColor" className="mb-2 block">Header text color:</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="headerTextColor"
                        name="headerTextColor"
                        value={formData.headerTextColor || "#000000"}
                        onChange={handleChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.headerTextColor || "#000000"}
                        onChange={handleChange}
                        name="headerTextColor"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Button customization */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buttonBgColor" className="mb-2 block">Button background color:</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="buttonBgColor"
                        name="buttonBgColor"
                        value={formData.buttonBgColor || "#1a57d1"}
                        onChange={handleChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.buttonBgColor || "#1a57d1"}
                        onChange={handleChange}
                        name="buttonBgColor"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="buttonTextColor" className="mb-2 block">Button text color:</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="buttonTextColor"
                        name="buttonTextColor"
                        value={formData.buttonTextColor || "#ffffff"}
                        onChange={handleChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.buttonTextColor || "#ffffff"}
                        onChange={handleChange}
                        name="buttonTextColor"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buttonText" className="mb-2 block">Button text:</Label>
                    <Input
                      id="buttonText"
                      name="buttonText"
                      value={formData.buttonText || "Validate"}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>

                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="codePromptMessage" className="mb-2 block">Code entry message:</Label>
              <Input
                id="codePromptMessage"
                name="codePromptMessage"
                value={formData.codePromptMessage}
                onChange={handleChange}
                placeholder="Please enter the code given at the end of the activity:"
              />
            </div>

            <div>
              <Label htmlFor="completionCode" className="mb-2 block">Activity completion code:</Label>
              <Input
                id="completionCode"
                name="completionCode"
                value={formData.completionCode}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="alertMessageRight" className="mb-2 block">Alert message right:</Label>
              <Input
                id="alertMessageRight"
                name="alertMessageRight"
                value={formData.alertMessageRight}
                onChange={handleChange}
                placeholder="Congratulations!"
              />
            </div>

            <div>
              <Label htmlFor="alertMessageWrong" className="mb-2 block">Alert message wrong:</Label>
              <Input
                id="alertMessageWrong"
                name="alertMessageWrong"
                value={formData.alertMessageWrong}
                onChange={handleChange}
                placeholder="Incorrect code. Please try again."
              />
            </div>

            <div>
              <Label htmlFor="endMessage" className="mb-2 block">End message (Markdown supported):</Label>
              <Textarea
                id="endMessage"
                name="endMessage"
                value={formData.endMessage}
                onChange={handleChange}
                className="min-h-[200px] font-mono"
                placeholder="# Module completed

Congratulations! You have completed this module.

You can use Markdown syntax:
- **Bold text**
- *Italic text*
- Lists
- Etc."
              />
            </div>
          </div>
        </div>

        {/* Download button */}
        <Button 
          onClick={onDownload} 
          className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg"
        >
          <Download className="mr-2 h-5 w-5" /> Download package
        </Button>
      </div>
    </div>
  );
};

export default ScormForm;
