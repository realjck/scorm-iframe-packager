
export interface ScormFormData {
  scormVersion: "1.2" | "2004";
  title: string;
  duration: string;
  iframeContent: string;
  completionCode: string;
  endMessage: string;
}
