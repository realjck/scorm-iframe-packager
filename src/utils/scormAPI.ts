// SCORM API implementations for both 1.2 and 2004 standards

// SCORM 1.2 API template
export const scorm12ApiTemplate = `
// SCORM 1.2 API Implementation
var API = null;

function findAPI(win) {
  if (win.API != null && typeof(win.API) === "object")
    return win.API;
  
  if (win.parent && win.parent !== win)
    return findAPI(win.parent);
  
  if (win.opener && win.opener !== null && win.opener !== win)
    return findAPI(win.opener);
  
  return null;
}

function getAPI() {
  if (API !== null) return API;
  
  API = findAPI(window);
  
  if (API === null && window.opener !== null) 
    API = findAPI(window.opener);
  
  return API;
}

// Initialize SCORM
function initializeSCORM() {
  const api = getAPI();
  if (api) {
    api.LMSInitialize("");
    // Set initial status to "incomplete"
    api.LMSSetValue("cmi.core.lesson_status", "incomplete");
    // Set session start time
    sessionStartTime = new Date();
    // Start tracking time
    trackTime();
  } else {
    console.error("SCORM API not found");
  }
}

var sessionStartTime;
var sessionTimerInterval;

// Track time spent in the module
function trackTime() {
  sessionTimerInterval = setInterval(function() {
    const api = getAPI();
    if (api) {
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - sessionStartTime) / 1000);
      const formattedTime = formatTime(elapsedSeconds);
      api.LMSSetValue("cmi.core.session_time", formattedTime);
    }
  }, 3000); // Update every 3 seconds
}

// Format time as HH:MM:SS
function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  
  return hours.toString().padStart(2, '0') + ':' +
         minutes.toString().padStart(2, '0') + ':' + 
         seconds.toString().padStart(2, '0');
}

// Mark completion
function completeSCO() {
  const api = getAPI();
  if (api) {
    api.LMSSetValue("cmi.core.lesson_status", "completed");
    api.LMSCommit("");
  }
}

// Close SCORM connection
function terminateSCORM() {
  const api = getAPI();
  if (api) {
    clearInterval(sessionTimerInterval);
    api.LMSFinish("");
  }
}

// Initialize SCORM when the page loads
window.addEventListener("load", initializeSCORM);
window.addEventListener("unload", terminateSCORM);

// Function to check entered code and mark as complete if correct
function validateCompletionCode(enteredCode, correctCode) {
  if (enteredCode.toLowerCase() === correctCode.toLowerCase()) {
    completeSCO();
    return true;
  }
  return false;
}
`;

// SCORM 2004 API template
export const scorm2004ApiTemplate = `
// SCORM 2004 API Implementation
var API_1484_11 = null;

function findAPI(win) {
  if (win.API_1484_11 != null && typeof(win.API_1484_11) === "object") {
    return win.API_1484_11;
  }
  
  if (win.parent && win.parent !== win) {
    return findAPI(win.parent);
  }
  
  if (win.opener && win.opener !== null && win.opener !== win) {
    return findAPI(win.opener);
  }
  
  return null;
}

function getAPI() {
  if (API_1484_11 !== null) return API_1484_11;
  
  API_1484_11 = findAPI(window);
  
  if (API_1484_11 === null && window.opener !== null) {
    API_1484_11 = findAPI(window.opener);
  }
  
  return API_1484_11;
}

// Initialize SCORM
function initializeSCORM() {
  const api = getAPI();
  if (api) {
    api.Initialize("");
    // Set initial status to "incomplete"
    api.SetValue("cmi.completion_status", "incomplete");
    api.SetValue("cmi.success_status", "unknown");
    // Set session start time
    sessionStartTime = new Date();
    // Start tracking time
    trackTime();
  } else {
    console.error("SCORM 2004 API not found");
  }
}

var sessionStartTime;
var sessionTimerInterval;

// Track time spent in the module
function trackTime() {
  sessionTimerInterval = setInterval(function() {
    const api = getAPI();
    if (api) {
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - sessionStartTime) / 1000);
      const formattedTime = formatTime(elapsedSeconds);
      api.SetValue("cmi.session_time", formattedTime);
      api.Commit("");
    }
  }, 3000); // Update every 3 seconds
}

// Format time as ISO 8601 for SCORM 2004
function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  
  return "PT" + hours + "H" + minutes + "M" + seconds + "S";
}

// Mark completion
function completeSCO() {
  const api = getAPI();
  if (api) {
    api.SetValue("cmi.completion_status", "completed");
    api.SetValue("cmi.success_status", "passed");
    api.Commit("");
  }
}

// Close SCORM connection
function terminateSCORM() {
  const api = getAPI();
  if (api) {
    clearInterval(sessionTimerInterval);
    api.Terminate("");
  }
}

// Initialize SCORM when the page loads
window.addEventListener("load", initializeSCORM);
window.addEventListener("unload", terminateSCORM);
`;
