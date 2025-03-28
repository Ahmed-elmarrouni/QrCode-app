import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [pitch, setPitch] = useState("Pitch 1");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1 Hour");
  const [qrData, setQrData] = useState("");
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = () => {
    if (!name || !date || !time) {
      alert("Please fill all fields!");
      return;
    }

    const bookingDetails = `Name: ${name}\nPitch: ${pitch}\nDate: ${date}\nTime: ${time}\nDuration: ${duration}`;
    setQrData(bookingDetails);
    setShowQR(true);
  };

  const downloadQRCodeAsPDF = () => {
    const doc = new jsPDF();

    // Generate the QR code canvas
    const canvas = document.getElementById("qrCodeCanvas") as HTMLCanvasElement;

    if (canvas) {
      const imgData = canvas.toDataURL("image/png");

      // QR code img to the PDF
      doc.addImage(imgData, "PNG", 60, 50, 80, 80);  
      doc.text("Booking QR Code Pls be there on the time ", 50, 145);

      // Save the PDF
      doc.save("qr-code-booking.pdf");
    }

    setShowQR(false);
  };

  return (
    <div className="container">
      <h1>Pitch Booking</h1>
      <div className="receipt">
        <label>Name:</label>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Pitch:</label>
        <select value={pitch} onChange={(e) => setPitch(e.target.value)}>
          <option>Pitch 1</option>
          <option>Pitch 2</option>
          <option>Pitch 3</option>
        </select>

        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Time:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <label>Duration:</label>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option>1 Hour</option>
          <option>2 Hours</option>
          <option>3 Hours</option>
        </select>

        <button onClick={generateQRCode}>Generate QR Code</button>
      </div>

      {showQR && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowQR(false)}>✖</button>
            <h2>Booking QR Code</h2>
            <div className="qr-container">
              <QRCodeCanvas id="qrCodeCanvas" value={qrData} size={200} />
            </div>
            <button onClick={downloadQRCodeAsPDF}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
