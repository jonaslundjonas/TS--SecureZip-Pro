document.addEventListener('DOMContentLoaded', () => {
    /**
     * Libraries
     */
    const zip = window.zip;
    let libArchivePromise = null;

    /**
     * Dynamically loads libarchive.js
     */
    const loadLibArchive = async () => {
        if (libArchivePromise) return libArchivePromise;

        libArchivePromise = (async () => {
            console.log('Loading libarchive.js...');
            try {
                const module = await import('./vendor/libarchive/libarchive.js');
                const Archive = module.Archive;

                const workerUrl = './vendor/libarchive/worker-bundle.js';
                Archive.init({
                    workerUrl: workerUrl,
                    getWorker: () => {
                        // Use a Blob bridge to ensure the worker is loaded as a classic worker
                        // to support importScripts within the libarchive worker.
                        const script = `importScripts('${new URL(workerUrl, import.meta.url).href}');`;
                        const blob = new Blob([script], { type: 'application/javascript' });
                        return new Worker(URL.createObjectURL(blob));
                    }
                });
                console.log('libarchive.js loaded successfully from vendor');
                return Archive;
            } catch (e) {
                console.error('Failed to load libarchive.js:', e);
                libArchivePromise = null; // Allow retry
                throw e;
            }
        })();

        return libArchivePromise;
    };

    // Pre-load libarchive.js
    loadLibArchive().catch(e => console.warn('Delayed libarchive loading:', e));

    // --- STATE ---
    let appMode = 'compress'; // 'compress' or 'extract'
    let files = [];
    let totalSize = 0;
    let password = '';
    let compressionLevel = 5;
    let passwordValidation = {
        minLength: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasUpperCase: false,
    };
    let currentlyExtractedFiles = [];
    
    // --- DOM ELEMENTS ---
    const tabCompress = document.getElementById('tab-compress');
    const tabExtract = document.getElementById('tab-extract');

    const setupView = document.getElementById('setup-view');
    const processingView = document.getElementById('processing-view');
    const successView = document.getElementById('success-view');

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileListContainer = document.getElementById('file-list-container');
    const fileListHeader = document.getElementById('file-list-header');
    const fileListEl = document.getElementById('file-list');
    
    const compressOptions = document.getElementById('compress-options');
    const passwordInput = document.getElementById('password-input');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    const eyeOpenIcon = document.getElementById('eye-open-icon');
    const eyeClosedIcon = document.getElementById('eye-closed-icon');
    const passwordRequirementsEl = document.getElementById('password-requirements');
    
    const compressionSlider = document.getElementById('compression-slider');
    const compressionLevelValue = document.getElementById('compression-level-value');
    
    const actionBtn = document.getElementById('action-btn');
    const actionIcon = document.getElementById('action-icon');
    const actionText = document.getElementById('action-text');
    const errorMessageEl = document.getElementById('error-message');
    
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');

    const successHeader = document.getElementById('success-header');
    const downloadActions = document.getElementById('download-actions');
    const downloadLink = document.getElementById('download-link');
    const extractedFilesContainer = document.getElementById('extracted-files-container');
    const extractedFileList = document.getElementById('extracted-file-list');
    const resetBtn = document.getElementById('reset-btn');

    // Password Modal
    const passwordModal = document.getElementById('password-modal');
    const modalForm = document.getElementById('modal-form');
    const modalPasswordInput = document.getElementById('modal-password-input');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalUnlockBtn = document.getElementById('modal-unlock-btn');
    const modalErrorMessage = document.getElementById('modal-error-message');

    // --- ICONS ---
    const iconCheck = document.getElementById('icon-check').cloneNode(true);
    const iconClose = document.getElementById('icon-close').cloneNode(true);
    const iconFile = document.getElementById('icon-file').cloneNode(true);
    const iconTrash = document.getElementById('icon-trash').cloneNode(true);
    const iconDownload = document.getElementById('icon-download').cloneNode(true);

    // --- HELPERS ---
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const isArchive = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        return ['zip', '7z', 'rar'].includes(ext);
    };

    // --- UI UPDATE FUNCTIONS ---
    const updateModeUI = () => {
        if (appMode === 'compress') {
            tabCompress.classList.add('bg-blue-600', 'text-white', 'shadow-lg');
            tabCompress.classList.remove('text-gray-400');
            tabExtract.classList.remove('bg-blue-600', 'text-white', 'shadow-lg');
            tabExtract.classList.add('text-gray-400');
            compressOptions.classList.remove('hidden');
            actionText.textContent = 'Create Secure Zip';
            fileInput.multiple = true;
        } else {
            tabExtract.classList.add('bg-blue-600', 'text-white', 'shadow-lg');
            tabExtract.classList.remove('text-gray-400');
            tabCompress.classList.remove('bg-blue-600', 'text-white', 'shadow-lg');
            tabCompress.classList.add('text-gray-400');
            compressOptions.classList.add('hidden');
            actionText.textContent = 'Extract Archive';
            fileInput.multiple = false;
        }
        resetApp();
    };

    const renderFileList = () => {
        fileListEl.innerHTML = '';
        if (files.length === 0) {
            fileListContainer.classList.add('hidden');
            return;
        }

        totalSize = files.reduce((acc, file) => acc + file.size, 0);
        fileListHeader.textContent = `Selected Files (${files.length}) - Total: ${formatBytes(totalSize)}`;
        fileListContainer.classList.remove('hidden');

        files.forEach((file, index) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'flex items-center justify-between bg-gray-700/50 p-3 rounded-lg animate-fade-in';

            const leftSection = document.createElement('div');
            leftSection.className = 'flex items-center gap-3 overflow-hidden';
            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-container w-5 h-5 text-gray-400 flex-shrink-0';
            iconContainer.appendChild(iconFile.cloneNode(true));
            const fileNameSpan = document.createElement('span');
            fileNameSpan.className = 'truncate text-sm';
            fileNameSpan.textContent = file.name;
            fileNameSpan.title = file.name;
            leftSection.appendChild(iconContainer);
            leftSection.appendChild(fileNameSpan);

            const rightSection = document.createElement('div');
            rightSection.className = 'flex items-center gap-3 flex-shrink-0';
            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'text-xs text-gray-400';
            sizeSpan.textContent = formatBytes(file.size);
            const removeBtn = document.createElement('button');
            removeBtn.dataset.index = index;
            removeBtn.className = 'remove-file-btn p-1 text-gray-400 hover:text-red-400 transition-colors';
            const trashIconContainer = document.createElement('div');
            trashIconContainer.className = 'icon-container w-5 h-5';
            trashIconContainer.appendChild(iconTrash.cloneNode(true));
            removeBtn.appendChild(trashIconContainer);
            rightSection.appendChild(sizeSpan);
            rightSection.appendChild(removeBtn);

            fileElement.appendChild(leftSection);
            fileElement.appendChild(rightSection);
            fileListEl.appendChild(fileElement);
        });
    };

    const updatePasswordValidationUI = () => {
        if (appMode === 'extract') return;
        if (password.length > 0) {
            passwordRequirementsEl.classList.remove('hidden');
            passwordRequirementsEl.classList.add('grid');
        } else {
            passwordRequirementsEl.classList.add('hidden');
            passwordRequirementsEl.classList.remove('grid');
        }

        for (const requirement in passwordValidation) {
            const li = passwordRequirementsEl.querySelector(`[data-req="${requirement}"]`);
            if (!li) continue;
            const met = passwordValidation[requirement];
            li.innerHTML = '';
            li.appendChild(met ? iconCheck.cloneNode(true) : iconClose.cloneNode(true));
            const span = document.createElement('span');
            span.textContent = {
                minLength: 'At least 12 characters',
                hasUpperCase: 'One uppercase letter',
                hasNumber: 'One number',
                hasSpecialChar: 'One special character',
            }[requirement];
            li.appendChild(span);
            li.className = `flex items-center gap-2 transition-colors ${met ? 'text-green-400' : 'text-gray-500'}`;
        }
    };

    const updateCreateButtonState = () => {
        if (appMode === 'compress') {
            const isPasswordSet = password.length > 0;
            const isPasswordValid = Object.values(passwordValidation).every(Boolean);
            actionBtn.disabled = files.length === 0 || (isPasswordSet && !isPasswordValid);
        } else {
            actionBtn.disabled = files.length === 0;
        }
    };

    // --- EVENT HANDLERS ---
    tabCompress.addEventListener('click', () => {
        appMode = 'compress';
        updateModeUI();
    });
    tabExtract.addEventListener('click', () => {
        appMode = 'extract';
        updateModeUI();
    });

    const handleFileSelection = (selectedFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        if (appMode === 'extract') {
            const file = selectedFiles[0];
            if (isArchive(file.name)) {
                files = [file];
            } else {
                errorMessageEl.textContent = 'Please select a valid archive file (.zip, .7z, .rar)';
                return;
            }
        } else {
            files.push(...Array.from(selectedFiles));
        }

        renderFileList();
        updateCreateButtonState();
    };
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('border-blue-500');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('border-blue-500');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('border-blue-500');
        handleFileSelection(e.dataTransfer ? e.dataTransfer.files : null);
    });
    fileInput.addEventListener('change', () => handleFileSelection(fileInput.files));

    fileListEl.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-file-btn');
        if (removeBtn) {
            const indexToRemove = parseInt(removeBtn.dataset.index, 10);
            files = files.filter((_, index) => index !== indexToRemove);
            renderFileList();
            updateCreateButtonState();
        }
    });

    passwordInput.addEventListener('input', (e) => {
        password = e.target.value;
        passwordValidation.minLength = password.length >= 12;
        passwordValidation.hasNumber = /[0-9]/.test(password);
        passwordValidation.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        passwordValidation.hasUpperCase = /[A-Z]/.test(password);
        updatePasswordValidationUI();
        updateCreateButtonState();
    });

    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeOpenIcon.classList.toggle('hidden', isPassword);
        eyeClosedIcon.classList.toggle('hidden', !isPassword);
        togglePasswordBtn.title = isPassword ? 'Hide password' : 'Show password';
    });

    compressionSlider.addEventListener('input', (e) => {
        compressionLevel = parseInt(e.target.value, 10);
        compressionLevelValue.textContent = String(compressionLevel);
    });

    actionBtn.addEventListener('click', async () => {
        if (appMode === 'compress') {
            handleCompress();
        } else {
            handleExtract();
        }
    });

    const handleCompress = async () => {
        errorMessageEl.textContent = '';
        const isPasswordSet = password.length > 0;
        const isPasswordValid = Object.values(passwordValidation).every(Boolean);

        if (files.length === 0) {
            errorMessageEl.textContent = 'Please select at least one file.';
            return;
        }
        if (isPasswordSet && !isPasswordValid) {
            errorMessageEl.textContent = 'Password does not meet the security requirements.';
            return;
        }

        setupView.classList.add('hidden');
        processingView.classList.remove('hidden');
        
        let bytesZipped = 0;
        try {
            if (typeof zip === 'undefined') {
                throw new Error('zip.js library is not loaded.');
            }
            zip.configure({ useWebWorkers: true });

            const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

            for (const file of files) {
                statusText.textContent = `Compressing ${file.name}...`;
                await zipWriter.add(file.name, new zip.BlobReader(file), {
                    level: compressionLevel,
                    password: password || undefined,
                    encryptionStrength: password ? 3 : undefined,
                    zipCrypto: password ? false : undefined,
                    onprogress: (current, total) => {
                        const fileProgressBytes = bytesZipped + current;
                        const totalProgress = (fileProgressBytes / totalSize) * 100;
                        progressBar.style.width = `${totalProgress}%`;
                        statusText.textContent = `Compressing ${file.name}... (${Math.round(totalProgress)}%)`;
                    },
                });
                bytesZipped += file.size;
            }

            statusText.textContent = 'Finalizing archive...';
            const zipBlob = await zipWriter.close();
            const url = URL.createObjectURL(zipBlob);
            
            processingView.classList.add('hidden');
            successView.classList.remove('hidden');
            successHeader.textContent = 'Your secure zip is ready!';
            downloadLink.classList.remove('hidden');
            downloadLink.href = url;
            downloadLink.download = `secure-archive-${new Date().toISOString().slice(0,10)}.zip`;
            extractedFilesContainer.classList.add('hidden');

        } catch (e) {
            resetApp();
            errorMessageEl.textContent = `An error occurred: ${e.message}`;
            console.error(e);
        }
    };

    const handleExtract = async () => {
        errorMessageEl.textContent = '';
        if (files.length === 0) return;
        const file = files[0];
        const ext = file.name.split('.').pop().toLowerCase();

        setupView.classList.add('hidden');
        processingView.classList.remove('hidden');
        statusText.textContent = `Preparing to extract ${file.name}...`;
        progressBar.style.width = '0%';

        try {
            if (ext === 'zip') {
                await extractZip(file);
            } else if (ext === '7z' || ext === 'rar') {
                await extractWithLibArchive(file);
            }
        } catch (e) {
            resetApp();
            errorMessageEl.textContent = `Extraction failed: ${e.message}`;
            console.error(e);
        }
    };

    const promptForPassword = (isRetry = false) => {
        return new Promise((resolve) => {
            passwordModal.classList.remove('hidden');
            modalPasswordInput.value = '';
            if (isRetry) {
                modalErrorMessage.classList.remove('hidden');
            } else {
                modalErrorMessage.classList.add('hidden');
            }
            modalPasswordInput.focus();

            const handleUnlock = (e) => {
                if (e) e.preventDefault();
                const pass = modalPasswordInput.value;
                if (pass) {
                    passwordModal.classList.add('hidden');
                    cleanup();
                    resolve(pass);
                }
            };

            const handleCancel = () => {
                passwordModal.classList.add('hidden');
                cleanup();
                resolve(null);
            };

            const handleKeyPress = (e) => {
                if (e.key === 'Enter') handleUnlock();
            };

            const cleanup = () => {
                modalUnlockBtn.removeEventListener('click', handleUnlock);
                modalForm.removeEventListener('submit', handleUnlock);
                modalCancelBtn.removeEventListener('click', handleCancel);
                modalPasswordInput.removeEventListener('keypress', handleKeyPress);
            };

            modalUnlockBtn.addEventListener('click', handleUnlock);
            modalForm.addEventListener('submit', handleUnlock);
            modalCancelBtn.addEventListener('click', handleCancel);
            modalPasswordInput.addEventListener('keypress', handleKeyPress);
        });
    };

    const extractZip = async (file, zipPassword) => {
        let zipReader;
        try {
            zipReader = new zip.ZipReader(new zip.BlobReader(file), { password: zipPassword });
            const entries = await zipReader.getEntries();
            const extractedFiles = [];

            let entriesProcessed = 0;
            for (const entry of entries) {
                if (!entry.directory) {
                    statusText.textContent = `Extracting ${entry.filename}...`;
                    try {
                        const blob = await entry.getData(new zip.BlobWriter(), {
                            onprogress: (current, total) => {
                                const progress = ((entriesProcessed + (current / total)) / entries.length) * 100;
                                progressBar.style.width = `${progress}%`;
                            }
                        });
                        extractedFiles.push({ name: entry.filename, blob });
                    } catch (e) {
                        if (e.message === zip.ERR_ENCRYPTED || e.message === zip.ERR_INVALID_PASSWORD) {
                            await zipReader.close();
                            const newPassword = await promptForPassword(!!zipPassword);
                            if (newPassword === null) throw new Error('Extraction cancelled.');
                            return extractZip(file, newPassword);
                        }
                        throw e;
                    }
                }
                entriesProcessed++;
            }

            await zipReader.close();
            displayExtractedFiles(extractedFiles);

        } catch (e) {
            if (zipReader) await zipReader.close();
            throw e;
        }
    };

    const extractWithLibArchive = async (file, archivePassword) => {
        statusText.textContent = 'Loading extraction library...';
        const LibArchive = await loadLibArchive();

        let archive;
        try {
            statusText.textContent = `Opening ${file.name}...`;
            archive = await LibArchive.open(file);

            if (archivePassword) {
                await archive.usePassword(archivePassword);
            }

            // 1. Try to read archive metadata.
            // This is the most reliable way to check if headers are accessible.
            let filesArray = [];
            try {
                filesArray = await archive.getFilesArray();
            } catch (e) {
                console.warn("Could not read archive metadata, likely needs a password:", e);
                await archive.close();
                const newPassword = await promptForPassword(!!archivePassword);
                if (newPassword === null) throw new Error('Extraction cancelled.');
                return extractWithLibArchive(file, newPassword);
            }

            // 2. Check for encryption status of the entries.
            const hasEncrypted = await archive.hasEncryptedData();

            // If we don't have a password yet and the archive reports it's encrypted (or we can't tell), prompt for one.
            if (!archivePassword && hasEncrypted !== false) {
                await archive.close();
                const newPassword = await promptForPassword(false);
                if (newPassword === null) throw new Error('Extraction cancelled.');
                return extractWithLibArchive(file, newPassword);
            }

            // 3. Perform the actual extraction.
            statusText.textContent = `Extracting files from ${file.name}...`;
            let entries;
            try {
                entries = await archive.extractFiles();
            } catch (e) {
                console.error("libarchivejs error during extraction:", e);
                await archive.close();
                const newPassword = await promptForPassword(true);
                if (newPassword === null) throw new Error('Extraction cancelled.');
                return extractWithLibArchive(file, newPassword);
            }

            const extractedFiles = [];
            const flattenEntries = (obj, path = '') => {
                for (const [name, value] of Object.entries(obj)) {
                    const currentPath = path ? `${path}/${name}` : name;
                    if (value instanceof File) {
                        extractedFiles.push({ name: currentPath, blob: value });
                    } else if (typeof value === 'object' && value !== null) {
                        flattenEntries(value, currentPath);
                    }
                }
            };

            flattenEntries(entries);
            await archive.close();

            // 4. Fallback for successful but empty extraction of encrypted archives.
            // Some archives might not throw but return nothing if the password is wrong.
            if (extractedFiles.length === 0 && archivePassword && (hasEncrypted !== false || filesArray.length > 0)) {
                const newPassword = await promptForPassword(true);
                if (newPassword === null) throw new Error('Extraction cancelled.');
                return extractWithLibArchive(file, newPassword);
            }

            displayExtractedFiles(extractedFiles);

        } catch (e) {
            if (archive) {
                try { await archive.close(); } catch (err) {}
            }
            throw e;
        }
    };

    const displayExtractedFiles = (extractedFiles) => {
        currentlyExtractedFiles = extractedFiles;
        processingView.classList.add('hidden');
        successView.classList.remove('hidden');
        successHeader.textContent = 'Extraction complete!';
        downloadLink.classList.add('hidden');
        extractedFilesContainer.classList.remove('hidden');
        extractedFileList.innerHTML = '';

        if (extractedFiles.length === 0) {
            extractedFileList.innerHTML = '<p class="text-gray-400 text-sm italic">No files found in the archive.</p>';
            return;
        }

        extractedFiles.forEach(file => {
            const url = URL.createObjectURL(file.blob);
            const fileEl = document.createElement('div');
            fileEl.className = 'flex items-center justify-between bg-gray-700/50 p-3 rounded-lg animate-fade-in';

            const leftSection = document.createElement('div');
            leftSection.className = 'flex items-center gap-3 overflow-hidden';
            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-container w-5 h-5 text-gray-400 flex-shrink-0';
            iconContainer.appendChild(iconFile.cloneNode(true));
            const fileNameSpan = document.createElement('span');
            fileNameSpan.className = 'truncate text-sm';
            fileNameSpan.textContent = file.name;
            fileNameSpan.title = file.name;
            leftSection.appendChild(iconContainer);
            leftSection.appendChild(fileNameSpan);

            const downloadLinkEl = document.createElement('a');
            downloadLinkEl.href = url;
            downloadLinkEl.download = file.name.split('/').pop();
            downloadLinkEl.className = 'p-2 text-blue-400 hover:text-blue-300 transition-colors';
            const downloadIconContainer = document.createElement('div');
            downloadIconContainer.className = 'download-icon-container w-5 h-5';
            downloadIconContainer.appendChild(iconDownload.cloneNode(true));
            downloadLinkEl.appendChild(downloadIconContainer);

            fileEl.appendChild(leftSection);
            fileEl.appendChild(downloadLinkEl);
            extractedFileList.appendChild(fileEl);
        });
    };

    const resetApp = () => {
        files = [];
        totalSize = 0;
        password = '';
        passwordInput.value = '';
        compressionLevel = 5;
        compressionSlider.value = '5';
        compressionLevelValue.textContent = '5';
        passwordValidation = { minLength: false, hasNumber: false, hasSpecialChar: false, hasUpperCase: false };
        if (downloadLink.href.startsWith('blob:')) {
            URL.revokeObjectURL(downloadLink.href);
        }

        // Clean up object URLs from extracted files
        extractedFileList.querySelectorAll('a').forEach(a => {
            if (a.href.startsWith('blob:')) {
                URL.revokeObjectURL(a.href);
            }
        });
        currentlyExtractedFiles = [];

        renderFileList();
        updatePasswordValidationUI();
        updateCreateButtonState();
        
        errorMessageEl.textContent = '';
        progressBar.style.width = '0%';
        statusText.textContent = '';

        setupView.classList.remove('hidden');
        processingView.classList.add('hidden');
        successView.classList.add('hidden');
        extractedFilesContainer.classList.add('hidden');
    };

    resetBtn.addEventListener('click', resetApp);
    
    // Initial UI state
    updatePasswordValidationUI();
});
