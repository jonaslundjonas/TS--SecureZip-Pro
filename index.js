document.addEventListener('DOMContentLoaded', () => {
    // The zip object is loaded from an external script and will be available on the window
    const zip = window.zip;

    // --- STATE ---
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
    
    // --- DOM ELEMENTS ---
    const setupView = document.getElementById('setup-view');
    const processingView = document.getElementById('processing-view');
    const downloadView = document.getElementById('download-view');

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileListContainer = document.getElementById('file-list-container');
    const fileListHeader = document.getElementById('file-list-header');
    const fileListEl = document.getElementById('file-list');
    
    const passwordInput = document.getElementById('password-input');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    const eyeOpenIcon = document.getElementById('eye-open-icon');
    const eyeClosedIcon = document.getElementById('eye-closed-icon');
    const passwordRequirementsEl = document.getElementById('password-requirements');
    
    const compressionSlider = document.getElementById('compression-slider');
    const compressionLevelValue = document.getElementById('compression-level-value');
    
    const createZipBtn = document.getElementById('create-zip-btn');
    const errorMessageEl = document.getElementById('error-message');
    
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');

    const downloadHeader = document.getElementById('download-header');
    const downloadLink = document.getElementById('download-link');
    const resetBtn = document.getElementById('reset-btn');

    // --- ICONS ---
    const iconCheck = document.getElementById('icon-check').cloneNode(true);
    const iconClose = document.getElementById('icon-close').cloneNode(true);
    const iconFile = document.getElementById('icon-file').cloneNode(true);
    const iconTrash = document.getElementById('icon-trash').cloneNode(true);

    // --- HELPERS ---
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // --- UI UPDATE FUNCTIONS ---
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
            fileElement.innerHTML = `
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="icon-container w-5 h-5 text-gray-400 flex-shrink-0"></div>
                    <span class="truncate text-sm" title="${file.name}">${file.name}</span>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                    <span class="text-xs text-gray-400">${formatBytes(file.size)}</span>
                    <button data-index="${index}" class="remove-file-btn p-1 text-gray-400 hover:text-red-400 transition-colors">
                        <div class="icon-container w-5 h-5"></div>
                    </button>
                </div>
            `;
            fileElement.querySelector('.icon-container').appendChild(iconFile.cloneNode(true));
            fileElement.querySelector('.remove-file-btn .icon-container').appendChild(iconTrash.cloneNode(true));
            fileListEl.appendChild(fileElement);
        });
    };

    const updatePasswordValidationUI = () => {
        if (password.length > 0) {
            passwordRequirementsEl.classList.remove('hidden');
            passwordRequirementsEl.classList.add('grid');
        } else {
            passwordRequirementsEl.classList.add('hidden');
            passwordRequirementsEl.classList.remove('grid');
        }

        for (const requirement in passwordValidation) {
            const li = passwordRequirementsEl.querySelector(`[data-req="${requirement}"]`);
            const met = passwordValidation[requirement];
            li.innerHTML = ''; // Clear previous icon
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
        const isPasswordSet = password.length > 0;
        const isPasswordValid = Object.values(passwordValidation).every(Boolean);
        createZipBtn.disabled = files.length === 0 || (isPasswordSet && !isPasswordValid);
    };

    // --- EVENT HANDLERS ---
    const handleFileSelection = (selectedFiles) => {
        if (!selectedFiles) return;
        files.push(...Array.from(selectedFiles));
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

    createZipBtn.addEventListener('click', async () => {
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
            downloadView.classList.remove('hidden');
            downloadHeader.textContent = 'Your secure zip is ready!';
            downloadLink.href = url;
            downloadLink.download = `secure-archive-${new Date().toISOString().slice(0,10)}.zip`;

        } catch (e) {
            resetApp();
            errorMessageEl.textContent = `An error occurred: ${e.message}`;
            console.error(e);
        }
    });

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

        renderFileList();
        updatePasswordValidationUI();
        updateCreateButtonState();
        
        errorMessageEl.textContent = '';
        progressBar.style.width = '0%';
        statusText.textContent = '';

        setupView.classList.remove('hidden');
        processingView.classList.add('hidden');
        downloadView.classList.add('hidden');
    };

    resetBtn.addEventListener('click', resetApp);
    
    // Initial UI state
    updatePasswordValidationUI();
});
