import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import "./ScanPage.css";

function ScanPage() {
    const [scanResult, setScanResult] = useState<string | null>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Camera scanning logic using ZXing
    useEffect(() => {
        if (!scanning) return;

        const codeReader = new BrowserMultiFormatReader();
        const videoElement = document.getElementById("videoElement") as HTMLVideoElement;

        codeReader
            .decodeFromVideoDevice(null, videoElement, (result, decodeError) => {
                if (result) {
                    setScanResult(result.getText());
                    setError(null);
                }
                if (decodeError) {
                    console.error(decodeError);
                }
            });

        return () => {
            codeReader.reset();
        };
    }, [scanning]);

    // Handle file upload and scan QR code
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);

            const codeReader = new BrowserMultiFormatReader();
            try {
                const fileReader = new FileReader();
                fileReader.onload = async () => {
                    const imageElement = document.createElement("img");
                    imageElement.src = fileReader.result as string;

                    imageElement.onload = async () => {
                        const result = await codeReader.decodeFromImage(imageElement);
                        setScanResult(result.getText());
                        setError(null);
                    };
                };
                fileReader.readAsDataURL(file);
            } catch (err) {
                console.error("Error decoding file", err);
                setError("Failed to decode the uploaded image.");
            }
        }
    };

    // Handle API call after QR code is scanned
    const handleScan = async () => {
        if (scanResult) {
            try {
                const response = await fetch("http://localhost:3000/api/scan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: scanResult }),
                });

                const result = await response.json();

                if (response.ok) {
                    setSuccessMessage(result.message);
                    setError(null);
                } else {
                    setError(result.message);
                    setSuccessMessage(null);
                }
            } catch (err) {
                setError("Server error. Please try again.");
                setSuccessMessage(null);
            }
        }
    };

    return (
        <div className="container">
            <h1>Scan QR Code</h1>

            {successMessage && <div className="alert">{successMessage}</div>}
            {error && <div className="alert error">{error}</div>}

            {/* Camera scan section */}
            {!imageFile && (
                <div>
                    <video id="videoElement" width="100%" height="auto"></video>
                    <button onClick={() => setScanning(!scanning)}>
                        {scanning ? "Stop Scanning" : "Start Camera Scanning"}
                    </button>
                </div>
            )}

            {/* File upload section */}
            <div>
                <label htmlFor="fileInput">Or Upload QR Code Image</label>
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            </div>

            {/* Validate token */}
            <button onClick={handleScan} disabled={!scanResult}>
                Validate QR Code
            </button>

            {scanResult && <p>Scanned Result: {scanResult}</p>}
        </div>
    );
}

export default ScanPage;
