# web2scorm

## Generate SCORM packages with any web content

A web application that allows users to create SCORM-compliant e-learning packages by embedding web content through URLs or HTML code, with completion tracking capabilities.

### ▶ [Launch the tool](https://realjck.github.io/web2scorm/)

## Features

- [X] Creation of SCORM 1.2 and 2004 packages compatible with most LMS
- [X] Web content integration via URL or HTML code
- [X] Code validation system to mark the module as completed
- [X] Content preview
- [X] Direct SCORM package download
- [X] SCORM manifest description customization
- [X] Iframe interface customization with header color choices and logotype

### Roadmap for future releases

- [ ] YouTube content integration with completion tracking
- [ ] QCM/QCU quiz creation for completion, with score reporting
- [ ] Management of several packaging projects, with IndexedDB storage

## Installation and Development

1. Clone the repository:
```bash
git clone https://github.com/realjck/web2scorm.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application is built using React and TypeScript. It runs entirely on the frontend, with no backend components. All features, including SCORM package generation and content handling, are performed client-side directly in the browser.

## Suggestions and Contributions

Feel free to contribute to the improvement of web2scorm, Your suggestions are welcome.

- Open an issue to report a bug or suggest a new feature
- Submit a pull request to contribute to the code
- Share your feedback and experience
