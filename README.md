# Secure Zip File Creator

This is a simple, client-side web application for creating password-protected zip files. It allows you to select or drag-and-drop multiple files, set a strong password, and choose a compression level before generating a secure zip archive directly in your browser.

## Features

-   **File Selection:** Drag and drop files or use the file input to select them.
-   **Password Protection:** Encrypt your zip files with a strong password.
-   **Password Strength Indicator:** Real-time feedback on password strength.
-   **Compression Level:** Adjust the compression level to balance file size and speed.
-   **Client-Side Processing:** All processing is done in the browser, ensuring your files are not uploaded to a server.
-   **Modern UI:** A clean and responsive user interface built with Tailwind CSS.

## Getting Started

### Prerequisites

To run this project, you only need a modern web browser. There are no other dependencies to install.

### Running the application

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3.  Open the `index.html` file in your web browser.

Alternatively, you can use a simple HTTP server to serve the files. If you have Python installed, you can run:

```bash
python -m http.server
```

Then, open your browser and navigate to `http://localhost:8000`.

## Usage

1.  **Select Files:** Drag and drop your files onto the designated drop zone, or click the "Browse" button to select files from your computer.
2.  **Set Password (Optional):** If you want to encrypt your zip file, enter a password in the password field. The password strength indicator will help you create a strong password.
3.  **Choose Compression Level:** Use the slider to select a compression level. A higher level means a smaller file size but may take longer to process.
4.  **Create Zip:** Click the "Create Zip" button to start the compression and encryption process.
5.  **Download:** Once the process is complete, a download link will appear. Click it to save your secure zip file.
6.  **Reset:** To start over, click the "Reset" button.
