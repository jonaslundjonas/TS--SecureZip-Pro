# SecureZip Pro

This is a comprehensive, client-side web application for creating and extracting password-protected archives. It allows you to compress files into secure Zip archives or extract files from Zip, 7z, and WinRAR (RAR) formats directly in your browser.

## Features

-   **Compression & Extraction:** Supports both creating Zip archives and extracting Zip, 7z, and RAR files.
-   **Password Support:**
    -   Encrypt your Zip files with a strong password.
    -   Extract password-protected Zip, 7z, and RAR archives.
-   **Password Strength Indicator:** Real-time feedback on password strength when creating archives.
-   **Compression Level:** Adjust the compression level for Zip creation to balance file size and speed.
-   **Client-Side Processing:** All processing is done in the browser using Web Workers, ensuring your files never leave your machine.
-   **Modern UI:** A clean, responsive, and dark-themed user interface built with Tailwind CSS.

## Getting Started

### Prerequisites

To run this project, you only need a modern web browser.

### Running the application

Because the application uses ES modules, dynamic imports, and Web Workers, it **must** be served via an HTTP server (to avoid CORS and origin issues with the `file://` protocol).

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3.  Serve the directory using a simple HTTP server:
    -   Using Python: `python -m http.server`
    -   Using Node.js: `npx http-server .`
4.  Open your browser and navigate to the address provided (usually `http://localhost:8000` or `http://localhost:8080`).

## Usage

### To Compress Files:
1.  Ensure you are on the **Compress** tab.
2.  **Select Files:** Drag and drop your files onto the drop zone, or click "browse".
3.  **Set Password (Optional):** Enter a password to encrypt your Zip file. Follow the strength requirements for a secure archive.
4.  **Choose Compression Level:** Use the slider to select a compression level.
5.  **Create Zip:** Click "Create Secure Zip".
6.  **Download:** Once ready, click "Download Secure Zip".

### To Extract Archives:
1.  Switch to the **Extract** tab.
2.  **Select Archive:** Select a `.zip`, `.7z`, or `.rar` file.
3.  **Extract:** Click "Extract Archive".
4.  **Password:** If the archive is protected, a modal will appear. Enter the password and click "Unlock".
5.  **Download Files:** Once extraction is complete, you can download each extracted file individually.
