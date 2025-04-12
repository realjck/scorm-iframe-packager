
import { ScormFormData } from '@/types/scorm';
import { scorm12ApiTemplate, scorm2004ApiTemplate } from './scormAPI';
import { generateScorm12Manifest, generateScorm2004Manifest } from './manifestGenerator';
import JSZip from 'jszip';

// Helper function to determine if content is a URL
const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// Generate SCORM package index.html content
export const generateIndexHtml = (formData: ScormFormData): string => {
  const { title, iframeContent, completionCode, endMessage, scormVersion } = formData;
  const scormApi = scormVersion === '1.2' ? scorm12ApiTemplate : scorm2004ApiTemplate;

  // Determine if content is a URL or HTML
  const contentIsUrl = isUrl(iframeContent);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'SCORM Module'}</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: Arial, sans-serif;
    }
    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .header {
      background-color: #f0f0f0;
      padding: 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }
    .header span {
      margin-right: 10px;
    }
    .header input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 10px;
    }
    .header button {
      padding: 8px 16px;
      background-color: #000;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .header button:hover {
      background-color: #333;
    }
    .header button:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
    .content {
      flex-grow: 1;
      border: none;
    }
    .completion-message {
      padding: 20px;
      text-align: center;
    }
    .alert {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }
    .error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span>Veuillez entrer le code donné en fin d'activité :</span>
      <input type="text" id="completion-code">
      <button id="validate-btn">Valider</button>
    </div>
    
    <div id="alert" class="alert hidden"></div>
    
    <div id="completion-section" class="completion-message hidden">
      <h2>Module terminé</h2>
      <p id="end-message">${endMessage || 'Félicitations ! Vous avez terminé ce module.'}</p>
    </div>
    
    <iframe id="content-frame" class="content"></iframe>
  </div>

  <script>
    // SCORM API Implementation
    ${scormApi}
    
    // Module variables
    const correctCode = "${completionCode}";
    let isCompleted = false;
    const contentFrame = document.getElementById('content-frame');
    const completionSection = document.getElementById('completion-section');
    const validateBtn = document.getElementById('validate-btn');
    const codeInput = document.getElementById('completion-code');
    const alertEl = document.getElementById('alert');
    
    // Initialize content
    window.addEventListener('DOMContentLoaded', () => {
      ${contentIsUrl 
        ? `contentFrame.src = "${iframeContent}";` 
        : `const doc = contentFrame.contentDocument || contentFrame.contentWindow.document;
          doc.open();
          doc.write(\`${iframeContent.replace(/`/g, '\\`')}\`);
          doc.close();`
      }
    });
    
    // Handle validation
    validateBtn.addEventListener('click', () => {
      const enteredCode = codeInput.value.trim();
      
      if (validateCompletionCode(enteredCode, correctCode)) {
        isCompleted = true;
        showAlert("${endMessage || 'Félicitations ! Vous avez terminé ce module.'}", true);
        contentFrame.classList.add('hidden');
        completionSection.classList.remove('hidden');
        validateBtn.disabled = true;
        codeInput.disabled = true;
      } else {
        showAlert("Code incorrect. Veuillez réessayer.", false);
      }
    });
    
    function showAlert(message, isSuccess) {
      alertEl.textContent = message;
      alertEl.classList.remove('hidden', 'success', 'error');
      alertEl.classList.add(isSuccess ? 'success' : 'error');
      
      if (!isSuccess) {
        setTimeout(() => {
          alertEl.classList.add('hidden');
        }, 3000);
      }
    }
  </script>
</body>
</html>
`;
};

// Generate and download SCORM package
export const generateScormPackage = async (formData: ScormFormData): Promise<void> => {
  try {
    const zip = new JSZip();
    
    // Add index.html
    const indexHtml = generateIndexHtml(formData);
    zip.file("index.html", indexHtml);
    
    // Add manifest based on SCORM version
    const manifest = formData.scormVersion === "1.2" 
      ? generateScorm12Manifest(formData)
      : generateScorm2004Manifest(formData);
    
    zip.file("imsmanifest.xml", manifest);
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = `${formData.title || 'scorm-package'}.zip`;
    
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
  } catch (error) {
    console.error("Error generating SCORM package:", error);
    throw error;
  }
};
