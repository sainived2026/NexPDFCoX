You are an expert full-stack developer. Build a production-grade PDF Tools Suite with the following comprehensive specifications:

=== PROJECT OVERVIEW ===
Create a responsive, multi-functional PDF manipulation tool that allows users to convert, merge, and compress PDFs. This is a 3-in-1 application (PDF to Image, Image to PDF, PDF Compressor). The application must be monetization-ready (Google AdSense), SEO-optimized, and Vercel-deployable.

=== TECH STACK ===
- Framework: React 18+ with TypeScript
- Styling: Tailwind CSS v3
- PDF Processing: pdf-lib, pdfjs-dist (client-side only, no server needed)
- Image Processing: sharp (client-side with WASM), canvas API
- Compression: pako (gzip compression library)
- Drag & Drop: react-dropzone
- File handling: FileSaver.js
- State Management: React Hooks
- Deployment: Vercel (completely free, serverless)

=== CORE FEATURES ===

1. TOOL #1: PDF TO IMAGE CONVERTER
   
   Functionality:
   - Upload single or batch PDF files (up to 50MB each)
   - Select which pages to convert (all pages, specific range, or individual pages)
   - Choose output format: JPG (75%, 85%, 95% quality options), PNG, WebP
   - Set image quality/resolution: 72dpi, 150dpi, 300dpi
   - Batch processing with progress tracking
   - Download as ZIP file for multiple conversions
   
   UI Elements:
   - Drag & drop zone with file icon
   - "Browse Files" button for file picker
   - File size warning if exceeds 50MB
   - Page range input: "Convert pages 1-5, 10-15"
   - Quality slider (0-100%)
   - Format selector radio buttons
   - Preview thumbnail of first page
   - "Convert Now" button (large, primary color)
   - Progress bar with percentage and time remaining
   
   Error Handling:
   - Warn if PDF is corrupted
   - Handle OCR requirement notification
   - Manage file size limits gracefully
   - Show "Max 10 pages for free" (optional premium feature)

2. TOOL #2: IMAGE TO PDF CONVERTER
   
   Functionality:
   - Upload multiple images: JPG, PNG, WebP, GIF
   - Drag & drop support for batch uploads
   - Arrange images in custom order (drag to reorder)
   - Set page size: A4, Letter, Custom dimensions
   - Set margins: None, Small (0.25"), Medium (0.5"), Large (1")
   - Orientation: Portrait or Landscape
   - Compression level: None, Medium, High
   - Merge multiple images into single PDF
   - Rename output file before download
   
   UI Elements:
   - Drag & drop zone
   - Image preview grid (thumbnails)
   - Reorder interface (drag handles)
   - Remove image button (X icon on hover)
   - Add more images button
   - Settings panel: Page size, margins, orientation
   - "Create PDF" button
   - Preview of final PDF (first page)
   
   Advanced Features:
   - Batch process 50+ images
   - Auto-detect image orientation
   - Watermark text option (optional premium)
   - Automatic rotation detection

3. TOOL #3: PDF COMPRESSOR
   
   Functionality:
   - Upload PDF file (up to 100MB)
   - Show original file size
   - Compression levels:
     * Light (minimal compression, large file)
     * Medium (balanced, ~40% size reduction)
     * High (aggressive, ~70% size reduction)
     * Maximum (extreme, ~90% size reduction)
   - Real-time file size estimation
   - Preview comparison (original vs compressed)
   - Quality selector (for image-heavy PDFs)
   - Remove embedded fonts option (smaller file)
   - Strip metadata option (privacy feature)
   - Batch compression (multiple PDFs)
   
   UI Elements:
   - File upload with drag & drop
   - Original vs compressed size display (large numbers, easy to read)
   - Compression level selector (buttons or slider)
   - Preview toggle (side-by-side comparison)
   - Quality settings
   - Advanced options (collapsible section)
   - "Compress PDF" button
   - Download button showing new file size
   - Savings percentage display (e.g., "45% smaller")

4. UNIFIED UI STRUCTURE
   - Top navigation: Logo, 3 tool tabs (PDF→Image, Image→PDF, Compress)
   - Active tool highlighted with underline
   - Side panel for settings (on desktop, collapsible on mobile)
   - Main content area for upload/preview
   - Bottom bar: Ad space + tool info

5. UPLOAD & FILE HANDLING
   - Drag & drop support for all tools
   - Click to browse files
   - File type validation with clear error messages
   - File size validation (show max size for each tool)
   - Multiple file support (batch processing)
   - Upload progress tracking
   - Cancel upload button
   - Recent uploads quick-access

6. PREVIEW FUNCTIONALITY
   - PDF preview: Show first page thumbnail
   - Image preview: Grid view of uploaded images
   - Side-by-side comparison (before/after compression)
   - Zoom functionality on preview (100%, 150%, 200%)
   - Full-page preview modal

7. DOWNLOAD OPTIONS
   - Single file download
   - Batch download as ZIP
   - Email download link (optional, requires email input)
   - Copy download link to clipboard
   - Auto-delete files after 24 hours (privacy assurance)
   - Download progress indicator

8. MONETIZATION & ADS
   - Google AdSense integration:
     * Vertical banner ad (300x600) - right sidebar on desktop
     * Horizontal ad (728x90) - below header
     * In-content ad (300x250) - after preview section
     * Responsive ad unit for mobile
   - Ad-free premium option ($2.99/month) - optional feature
   - Affiliate links to PDF editing software (Foxit, Adobe)
   - Email capture for newsletter (optional, gate advanced features)

9. SEO & META TAGS
   - Title: "Free PDF Tools - Convert, Merge & Compress PDFs Online"
   - Meta description: "Free online PDF tools: convert PDFs to images, merge images into PDFs, and compress PDFs. No registration required."
   - Keywords: pdf converter, pdf to image, image to pdf, pdf compressor, merge pdf
   - Schema.org structured data (SoftwareApplication)
   - Open Graph tags for social sharing
   - Mobile viewport tag

10. PERFORMANCE REQUIREMENTS
    - Page load: < 2 seconds
    - FCP: < 1.5 seconds
    - Lighthouse score: 85+/100
    - Client-side processing (no backend delays)
    - Web Workers for PDF processing (don't block UI)
    - Efficient memory management (cleanup after processing)
    - Lazy loading of libraries
    - Gzip compression for assets

11. ACCESSIBILITY (WCAG 2.1 Level AA)
    - Keyboard navigation for all tools
    - ARIA labels on all buttons
    - Semantic HTML (form elements, labels)
    - Color contrast 4.5:1 minimum
    - Focus indicators visible
    - Screen reader support
    - Error messages linked to form fields

12. RESPONSIVE DESIGN
    - Mobile (320px-640px): Stack tools vertically, full-width upload
    - Tablet (641px-1024px): Side panel collapses to hamburger menu
    - Desktop (1025px+): Two-column layout with sidebar
    - Touch-friendly: 44px minimum tap targets

13. DARK MODE
    - Toggle in header (sun/moon icon)
    - Remember preference in localStorage
    - Smooth transition between modes
    - Proper contrast in dark mode

14. NOTIFICATIONS & FEEDBACK
    - Success toast: "PDF compressed successfully! 42% smaller."
    - Error toast: "File size exceeds 50MB. Please try a smaller file."
    - Loading states with spinner
    - Progress bars for processing
    - Estimated time remaining for large files
    - Completion notifications (optional: desktop notifications)

15. SETTINGS & PREFERENCES
    - Default compression level (remember last selection)
    - Default output format preference
    - Language selection (English, Spanish, French, German, etc.)
    - Email notifications opt-in
    - Privacy mode toggle (don't save to history)

=== FILE STRUCTURE ===
project/
├── public/
│   ├── index.html
│   ├── workers/
│   │   └── pdfWorker.js (Web Worker for PDF processing)
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── TabNavigation.tsx
│   │   ├── Tools/
│   │   │   ├── PDFToImage.tsx
│   │   │   ├── ImageToPDF.tsx
│   │   │   └── PDFCompressor.tsx
│   │   ├── Upload/
│   │   │   ├── DragDropZone.tsx
│   │   │   └── FileInput.tsx
│   │   ├── Preview/
│   │   │   ├── PDFPreview.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   └── ComparisonView.tsx
│   │   ├── Settings/
│   │   │   ├── FormatSelector.tsx
│   │   │   ├── QualitySlider.tsx
│   │   │   └── AdvancedOptions.tsx
│   │   ├── Download/
│   │   │   └── DownloadButton.tsx
│   │   ├── AdUnits.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── usePDFProcessing.ts
│   │   ├── useImageProcessing.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDarkMode.ts
│   ├── utils/
│   │   ├── pdfUtils.ts
│   │   ├── imageUtils.ts
│   │   ├── fileHandling.ts
│   │   └── formatting.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vercel.json

=== DEPENDENCIES ===
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^3.11.174",
    "react-dropzone": "^14.2.3",
    "file-saver": "^2.0.5",
    "pako": "^2.1.0"
  }
}
```

=== BROWSER SUPPORT ===
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

=== TESTING ===
- Test PDF to Image with multi-page PDFs
- Test batch image to PDF with 50+ images
- Test compression on PDF sizes: 1MB, 10MB, 50MB, 100MB
- Test mobile upload on poor 3G connection
- Test all 3 tools simultaneously in different tabs
- Test dark mode switching
- Test with corrupted/invalid files

Generate production-ready code with proper error handling, loading states, and user feedback. All processing should be client-side (no server needed). Include progress bars for large file processing. Ensure the code is modular and maintainable.