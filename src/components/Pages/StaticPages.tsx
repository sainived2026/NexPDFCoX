import React from 'react'

export function AboutPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in text-sm" style={{ color: 'var(--text-secondary)' }}>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
        About NexPDFCoX
      </h1>
      
      <p>
        NexPDFCoX is a modern, high-performance suite of PDF utilities designed with a single philosophy: 
        <strong style={{ color: 'var(--text-primary)' }}> privacy by design.</strong>
      </p>

      <p>
        Traditional online PDF tools force you to upload your sensitive documents to remote servers. This poses significant security risks, requires you to trust third-party data retention policies, and often involves waiting in queues or paying for premium subscriptions just to get your files back faster.
      </p>

      <p>
        We built NexPDFCoX differently. Using cutting-edge web technologies like WebAssembly (Wasm) and HTML5 Canvas, 
        <strong style={{ color: '#B75D69' }}> all processing happens entirely within your web browser.</strong>
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>Key Advantages</h3>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li><strong>Zero Uploads:</strong> Your files never leave your device. They are not transmitted over the internet to any server.</li>
        <li><strong>Lightning Fast:</strong> Because there is no uploading or downloading of files, processing begins instantly.</li>
        <li><strong>No Limits:</strong> Convert as many pages as you want, completely free of charge. No registration walls.</li>
        <li><strong>Offline Capable:</strong> Once the page loads, you can technically disconnect from the internet and the tools will still work.</li>
      </ul>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in text-sm" style={{ color: 'var(--text-secondary)' }}>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
        Privacy Policy
      </h1>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        At NexPDFCoX, we take your privacy incredibly seriously. Our application architecture is fundamentally designed to prevent us from ever accessing your data.
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>1. File Processing & Storage</h3>
      <p>
        <strong>We do not upload, collect, store, or transmit your files.</strong> All PDF and Image processing happens locally on your device via your web browser. When you select a file, it is loaded directly into your device's memory. When you click "Download," the resulting file is generated locally and saved to your hard drive. 
      </p>
      <p>
        We do not have access to the contents of your documents, their filenames, or their metadata.
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>2. Information We Collect</h3>
      <p>
        Because we use Google Analytics and Google AdSense to sustain this free tool, certain non-personally identifiable information may be collected automatically by these third-party services. This includes:
      </p>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>Browser type and operating system</li>
        <li>General location (country/city level)</li>
        <li>Pages visited and interactions (e.g., clicking the "Compress" button)</li>
      </ul>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>3. Cookies & Local Storage</h3>
      <p>
        We use your browser's local storage solely to remember your preferences (such as your choice of Dark or Light mode). 
        Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.
      </p>
    </div>
  )
}

export function TermsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in text-sm" style={{ color: 'var(--text-secondary)' }}>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
        Terms of Service
      </h1>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        By using NexPDFCoX ("the Service"), you agree to the following terms and conditions.
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>1. Acceptance of Terms</h3>
      <p>
        The Service is provided free of charge "as is" and "as available". We reserve the right to modify or discontinue the Service at any time without notice.
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>2. Use of Service</h3>
      <p>
        You are solely responsible for the files you process using the Service. While all processing occurs locally on your machine, you agree not to use the Service for any illegal activities or to process illegal content.
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>3. Disclaimer of Warranties</h3>
      <p>
        The Service is provided without warranty of any kind. We do not guarantee that the Service will meet your requirements, be uninterrupted, timely, secure, or error-free. We are not responsible for any corrupted files or data loss resulting from the use of the Service. Always maintain backups of your original files.
      </p>

      <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>4. Limitation of Liability</h3>
      <p>
        In no event shall NexPDFCoX, its creators, or contributors be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.
      </p>
    </div>
  )
}
