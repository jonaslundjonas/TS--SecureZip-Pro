// Fix: Add imports for React and ReactDOM.
import React from 'react';
import ReactDOM from 'react-dom/client';

// --- ICONS ---
const ZipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-3 9h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2z" />
  </svg>
);

const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
  </svg>
);

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const EyeOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
    </svg>
);

const EyeClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 7.61 17 4.5 12 4.5c-1.77 0-3.39.53-4.79 1.4L8.91 7.58C9.82 7.21 10.87 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L21.46 22 23 20.46 3.54 2.73 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.21 0-4-1.79-4-4 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- APP ---
// Tell TypeScript that the zip object will be available on the window
declare const zip: any;

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const PasswordRequirement: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
    <li className={`flex items-center gap-2 transition-colors ${met ? 'text-green-400' : 'text-gray-500'}`}>
        {met ? <CheckIcon className="w-4 h-4" /> : <CloseIcon className="w-4 h-4" />}
        <span>{label}</span>
    </li>
);

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = React.useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false,
  });
  const [compressionLevel, setCompressionLevel] = React.useState<number>(5);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [statusText, setStatusText] = React.useState<string>('');
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const totalSizeRef = React.useRef<number>(0);
  const bytesZippedRef = React.useRef<number>(0);

  React.useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  React.useEffect(() => {
    if (!password) {
        setPasswordValidation({ minLength: false, hasNumber: false, hasSpecialChar: false, hasUpperCase: false });
        return;
    }
    const minLength = password.length >= 12;
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    setPasswordValidation({ minLength, hasNumber, hasSpecialChar, hasUpperCase });
  }, [password]);

  const handleFileChange = React.useCallback((selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(selectedFiles)]);
    }
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);
  
  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateZip = async () => {
    if (files.length === 0) {
      setError('Please select at least one file.');
      return;
    }
    
    const isPasswordSet = password.length > 0;
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    if (isPasswordSet && !isPasswordValid) {
        setError('Password does not meet the security requirements.');
        return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
    bytesZippedRef.current = 0;
    totalSizeRef.current = files.reduce((acc, file) => acc + file.size, 0);

    try {
        if (typeof zip === 'undefined') {
            throw new Error('zip.js library is not loaded.');
        }
        zip.configure({
            useWebWorkers: true
        });

        const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

        for (const file of files) {
            setStatusText(`Compressing ${file.name}...`);
            const onprogress = (current: number, total: number) => {
                const fileProgressBytes = bytesZippedRef.current + current;
                const totalProgress = (fileProgressBytes / totalSizeRef.current) * 100;
                setProgress(totalProgress);
            };
            
            await zipWriter.add(file.name, new zip.BlobReader(file), {
                level: compressionLevel,
                password: password || undefined,
                encryptionStrength: password ? 3 : undefined, // 1: 128-bit, 2: 192-bit, 3: 256-bit AES
                zipCrypto: password ? false : undefined, // Use AES, not legacy ZipCrypto
                onprogress,
            });
            bytesZippedRef.current += file.size;
        }

        setStatusText('Finalizing archive...');
        const zipBlob = await zipWriter.close();
        const url = URL.createObjectURL(zipBlob);
        setDownloadUrl(url);
        setStatusText('Your secure zip is ready!');

    } catch (e: any) {
        setError(`An error occurred: ${e.message}`);
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setFiles([]);
    setPassword('');
    setCompressionLevel(5);
    setIsProcessing(false);
    setProgress(0);
    setDownloadUrl(null);
    setError(null);
    setStatusText('');
  };

  const totalFilesSize = files.reduce((acc, file) => acc + file.size, 0);
  const isPasswordSet = password.length > 0;
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isCreateButtonDisabled = files.length === 0 || (isPasswordSet && !isPasswordValid);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4">
                <ZipIcon className="w-12 h-12 text-blue-400" />
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">SecureZip Pro</h1>
            </div>
            <p className="mt-4 text-lg text-gray-400">Create encrypted & compressed Zip archives in your browser.</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8 border border-gray-700">
          
          {downloadUrl ? (
             <div className="text-center p-8 border-2 border-dashed border-green-500 rounded-lg bg-green-900/20">
                <h2 className="text-2xl font-semibold text-green-300 mb-4">{statusText}</h2>
                <a 
                  href={downloadUrl} 
                  download={`secure-archive-${new Date().toISOString().slice(0,10)}.zip`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                >
                  <DownloadIcon className="w-6 h-6" />
                  Download Secure Zip
                </a>
                <button 
                  onClick={handleReset} 
                  className="mt-6 block mx-auto text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Create another archive
                </button>
            </div>
          ) : (
            <>
              {/* File Drop Zone */}
              <div>
                <label 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="flex justify-center w-full h-48 px-4 transition bg-gray-900/50 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-gray-400">
                      Drop files to Attach, or
                      <span className="text-blue-400 underline ml-1">browse</span>
                    </span>
                  </span>
                  <input type="file" multiple className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">Selected Files ({files.length}) - Total: {formatBytes(totalFilesSize)}</h3>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="truncate text-sm" title={file.name}>{file.name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
                        <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                    Encryption Password (Optional)
                  </label>
                  <div className="relative">
                    <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-200 transition-colors" title={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <EyeClosedIcon className="w-5 h-5" /> : <EyeOpenIcon className="w-5 h-5" />}
                        </button>
                    </div>
                  </div>
                  {isPasswordSet && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                        <PasswordRequirement met={passwordValidation.minLength} label="At least 12 characters" />
                        <PasswordRequirement met={passwordValidation.hasUpperCase} label="One uppercase letter" />
                        <PasswordRequirement met={passwordValidation.hasNumber} label="One number" />
                        <PasswordRequirement met={passwordValidation.hasSpecialChar} label="One special character" />
                    </ul>
                  )}
                </div>
                <div>
                  <label htmlFor="compression" className="block text-sm font-medium text-gray-300 mb-2">
                    Compression Level: <span className="font-bold text-blue-400">{compressionLevel}</span>
                  </label>
                  <input
                    id="compression"
                    type="range"
                    min="1"
                    max="9"
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Faster</span>
                    <span>Smaller</span>
                  </div>
                </div>
              </div>

              {/* Action Button & Progress */}
              <div>
                {isProcessing ? (
                   <div className="w-full text-center">
                        <div className="w-full bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                            <div className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-sm text-blue-300 font-medium">{statusText} ({Math.round(progress)}%)</p>
                    </div>
                ) : (
                  <button 
                    onClick={handleCreateZip} 
                    disabled={isCreateButtonDisabled}
                    className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:scale-100"
                  >
                    <ZipIcon className="w-6 h-6" />
                    Create Secure Zip
                  </button>
                )}
                {error && <p className="text-red-400 text-center mt-4">{error}</p>}
              </div>
            </>
          )}

        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm space-y-2">
            <p>
                <strong>Privacy First:</strong> Nothing is stored on a server. All file processing happens locally on your machine.
            </p>
            <p>Created by Jonas Lund</p>
        </footer>
      </div>
    </div>
  );
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);