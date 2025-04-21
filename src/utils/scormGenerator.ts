import { ScormFormData } from '@/types/scorm';
import { scorm12ApiTemplate, scorm2004ApiTemplate } from './scormAPI';
import { generateScorm12Manifest, generateScorm2004Manifest } from './manifestGenerator';
import JSZip from 'jszip';
import { marked } from 'marked';

// Helper function to determine if content is a URL
const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// Helper function to get all SCORM 1.2 XSD files
const getScorm12XsdFiles = async () => {
  const xsdFiles = [
    'adlcp_rootv1p2.xsd',
    'ims_xml.xsd',
    'imscp_rootv1p1p2.xsd',
    'imsmd_rootv1p2p1.xsd'
  ];
  
  const filePromises = xsdFiles.map(async (file) => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}xsd/scorm12/${file}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return { name: file, content: await response.text() };
    } catch (error) {
      console.warn(`Failed to load ${file}, creating empty file`, error);
      return { name: file, content: `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${file} -->` };
    }
  });
  
  return Promise.all(filePromises);
};

// Helper function to get all SCORM 2004 XSD files
const getScorm2004XsdFiles = async () => {
  const rootFiles = [
    'adlcp_v1p3.xsd',
    'adlnav_v1p3.xsd',
    'adlseq_v1p3.xsd',
    'datatypes.dtd',
    'imscp_v1p1.xsd',
    'imsss_v1p0.xsd',
    'imsss_v1p0auxresource.xsd',
    'imsss_v1p0control.xsd',
    'imsss_v1p0delivery.xsd',
    'imsss_v1p0limit.xsd',
    'imsss_v1p0objective.xsd',
    'imsss_v1p0random.xsd',
    'imsss_v1p0rollup.xsd',
    'imsss_v1p0seqrule.xsd',
    'imsss_v1p0util.xsd',
    'ims_xml.xsd',
    'lom.xsd',
    'xml.xsd',
    'XMLSchema.dtd'
  ];

  const folderStructure = {
    common: [
      'anyElement.xsd',
      'dataTypes.xsd',
      'elementNames.xsd',
      'elementTypes.xsd',
      'rootElement.xsd',
      'vocabTypes.xsd',
      'vocabValues.xsd'
    ],
    extend: [
      'custom.xsd',
      'strict.xsd'
    ],
    unique: [
      'loose.xsd',
      'strict.xsd'
    ],
    vocab: [
      'custom.xsd',
      'loose.xsd',
      'strict.xsd'
    ]
  };

  // Get root files
  const rootFilePromises = rootFiles.map(async (file) => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}xsd/scorm2004/${file}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return { name: file, content: await response.text() };
    } catch (error) {
      console.warn(`Failed to load ${file}, creating empty file`, error);
      const content = file.endsWith('.dtd') 
        ? `<!-- SCORM 2004 ${file} -->`
        : `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${file} -->`;
      return { name: file, content };
    }
  });

  // Get folder files
  const folderFilePromises = Object.entries(folderStructure).flatMap(([folder, files]) =>
    files.map(async (file) => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}xsd/scorm2004/${folder}/${file}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return { 
          name: `${folder}/${file}`, 
          content: await response.text() 
        };
      } catch (error) {
        console.warn(`Failed to load ${folder}/${file}, creating empty file`, error);
        return { 
          name: `${folder}/${file}`, 
          content: `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${folder}/${file} -->` 
        };
      }
    })
  );

  const allFiles = await Promise.all([...rootFilePromises, ...folderFilePromises]);
  return allFiles;
};

// Generate SCORM package index.html content
// Add this helper function at the top level
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// In the generateIndexHtml function, update the script section:
export const generateIndexHtml = async (formData: ScormFormData): Promise<string> => {
  const { title, iframeContent, completionCode, endMessage, scormVersion, packageType } = formData;
  const scormApi = scormVersion === '1.2' ? scorm12ApiTemplate : scorm2004ApiTemplate;

  // Hash the completion code if needed
  const hashedCode = packageType === 'iframe-with-code' ? await sha256(completionCode) : '';

  // Convert markdown to HTML and escape newlines for JavaScript
  const endMessageHtml = marked(endMessage || '# Module completed\n\nCongratulations! You have completed this module.');

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
    ${packageType === 'iframe-with-code' ? `
    .header {
      background-color: ${formData.headerBgColor || '#f0f0f0'};
      color: ${formData.headerTextColor || '#000000'};
      padding: 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }
    .header img {
      height: 32px;
      margin-right: 16px;
      object-fit: contain;
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
      background-color: ${formData.buttonBgColor || '#000000'};
      color: ${formData.buttonTextColor || '#ffffff'};
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
    }` : ''}
    .content {
      flex-grow: 1;
      border: none;
    }
    ${packageType === 'iframe-with-code' ? `
    .completion-message {
      padding: 20px;
      text-align: center;
    }
    .alert {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .success, .error {
      color: #000000;
      margin: 0;
      padding: 0.9em 0.7em;
    }
    .success {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
    .error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
    }
    .hidden {
      display: none;
    }` : ''}
  </style>
</head>
<body>
  <div class="container">
    ${packageType === 'iframe-with-code' ? `
    <div class="header">
      ${formData.logo ? `<img src="${formData.logo}" alt="Logo">` : ''}
      <span>${formData.codePromptMessage || "Please enter the code given at the end of the activity:"}</span>
      <input type="text" id="completion-code">
      <button id="validate-btn">${formData.buttonText || "Validate"}</button>
    </div>
    
    <div id="alert" class="alert hidden"></div>
    
    <div id="completion-section" class="completion-message hidden prose dark:prose-invert">
      ${endMessageHtml}
    </div>
    ` : ''}
    
    <iframe id="content-frame" class="content"></iframe>
  </div>

  <script>
    // SCORM API Implementation
    ${scormApi}
    
    // Common variables for all package types
    const contentFrame = document.getElementById('content-frame');
    
    ${packageType === 'iframe-with-code' ? `
    // Variables for iframe-with-code mode
    const correctCodeHash = "${hashedCode}";
    let isCompleted = false;
    const completionSection = document.getElementById('completion-section');
    const validateBtn = document.getElementById('validate-btn');
    const codeInput = document.getElementById('completion-code');
    const alertEl = document.getElementById('alert');
    
    // Add SHA-256 hashing function
    async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }` : ''}

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
  
    ${packageType === 'iframe-with-code' ? `
    // Handle validation
    validateBtn.addEventListener('click', async () => {
      const enteredCode = codeInput.value.trim();
      const enteredCodeHash = await sha256(enteredCode);
      
      if (enteredCodeHash === correctCodeHash) {
        isCompleted = true;
        showAlert("${formData.alertMessageRight || "Congratulations!"}", true);
        contentFrame.classList.add('hidden');
        completionSection.classList.remove('hidden');
        validateBtn.disabled = true;
        codeInput.disabled = true;
        completeSCO();
      } else {
        showAlert("${formData.alertMessageWrong || "Incorrect code. Please try again."}", false);
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
    }` : ''}
  </script>
</body>
</html>
`;
};

// Update the generateScormPackage function to handle the async generateIndexHtml
export const generateScormPackage = async (formData: ScormFormData): Promise<void> => {
  try {
    const zip = new JSZip();
    
    // Add index.html (now with await)
    const indexHtml = await generateIndexHtml(formData);
    zip.file("index.html", indexHtml);
    
    // Add manifest based on SCORM version
    const manifest = formData.scormVersion === "1.2" 
      ? generateScorm12Manifest(formData)
      : generateScorm2004Manifest(formData);
    
    zip.file("imsmanifest.xml", manifest);
    
    // Add XSD files based on SCORM version
    if (formData.scormVersion === "1.2") {
      try {
        const xsdFiles = await getScorm12XsdFiles();
        xsdFiles.forEach(file => {
          zip.file(file.name, file.content);
        });
      } catch (error) {
        console.error("Error loading SCORM 1.2 XSD files:", error);
      }
    } else {
      try {
        const xsdFiles = await getScorm2004XsdFiles();
        xsdFiles.forEach(file => {
          zip.file(file.name, file.content);
        });
      } catch (error) {
        console.error("Error loading SCORM 2004 XSD files:", error);
      }
    }
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Create and trigger download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = `${formData.title || 'scorm-package'}.zip`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
  } catch (error) {
    console.error("Error generating SCORM package:", error);
    throw error;
  }
};
