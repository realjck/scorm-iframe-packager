/**

 * This file is part of a project licensed under the GNU General Public License v3.0.
 * 
 * Copyright (c) 2025 JCK
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * See <https://www.gnu.org/licenses/> for more details.
 */
export interface ScormFormData {
  scormVersion: "1.2" | "2004";
  title: string;
  description: string;
  duration: string;
  iframeContent: string;
  completionCode: string;
  alertMessageRight: string;
  alertMessageWrong: string;
  endMessage: string;
  codePromptMessage: string;
  headerBgColor?: string;
  headerTextColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonText?: string;
  logo?: string; // base64 string
  packageType: "iframe-with-code" | "iframe-only" | "youtube";
  youtubeVideoId?: string;
  autoCompleteEnabled?: boolean;
  autoCompleteDuration?: string;
}
