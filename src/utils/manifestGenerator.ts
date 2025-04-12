
import { ScormFormData } from '@/types/scorm';

// Generate imsmanifest.xml for SCORM 1.2
export const generateScorm12Manifest = (formData: ScormFormData): string => {
  const uniqueId = "SCORM_" + Date.now();
  const title = formData.title || "SCORM Module";

  return `<?xml version="1.0" standalone="no" ?>
<manifest identifier="${uniqueId}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
    <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1">
      <general>
        <title>
          <langstring>${escapeXml(title)}</langstring>
        </title>
        <description>
          <langstring>SCORM content generated with SCORM Packager</langstring>
        </description>
      </general>
      <educational>
        <typicallearningtime>
          <datetime>${escapeXml(formData.duration || "0:30")}</datetime>
        </typicallearningtime>
      </educational>
    </lom>
  </metadata>
  
  <organizations default="default_org">
    <organization identifier="default_org">
      <title>${escapeXml(title)}</title>
      <item identifier="item_1" identifierref="resource_1" isvisible="true">
        <title>${escapeXml(title)}</title>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>
`;
};

// Generate imsmanifest.xml for SCORM 2004
export const generateScorm2004Manifest = (formData: ScormFormData): string => {
  const uniqueId = "SCORM_" + Date.now();
  const title = formData.title || "SCORM Module";
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<manifest identifier="${uniqueId}" version="1"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                      http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                      http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                      http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                      http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
    <lom xmlns="http://ltsc.ieee.org/xsd/LOM">
      <general>
        <title>
          <string language="en-US">${escapeXml(title)}</string>
        </title>
        <description>
          <string language="en-US">SCORM content generated with SCORM Packager</string>
        </description>
      </general>
      <educational>
        <typicalLearningTime>
          <duration>${escapeXml(formData.duration || "PT30M")}</duration>
        </typicalLearningTime>
      </educational>
    </lom>
  </metadata>
  
  <organizations default="default_org">
    <organization identifier="default_org">
      <title>${escapeXml(title)}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${escapeXml(title)}</title>
        <imsss:sequencing>
          <imsss:objectives>
            <imsss:primaryObjective objectiveID="completionobj" satisfiedByMeasure="false" />
          </imsss:objectives>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>
`;
};

// Helper function to escape XML entities
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
