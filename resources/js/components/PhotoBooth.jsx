import React, { useRef, useState, useEffect } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Download, Loader2, Upload, X, Camera, RotateCcw, Image } from "lucide-react";

export default function UmrahPhotoBooth() {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [finalPhotoUrl, setFinalPhotoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [mode, setMode] = useState('upload'); // 'upload' atau 'camera'
  const [imageDataURL, setImageDataURL] = useState(null);
  const [cameraNumber, setCameraNumber] = useState(0);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [templateOpacity, setTemplateOpacity] = useState(0.6);
  
  const inputRef = useRef(null);
  const playerRef = useRef(null);
  const canvasRef = useRef(null);

  // Template frame path - sesuaikan dengan path template.jpg Anda
  const templateFramePath = '/img/template.jpg';

  // Initialize camera
  const initializeMedia = async () => {
    setImageDataURL(null);
    
    if (!("mediaDevices" in navigator)) {
      navigator.mediaDevices = {};
    }

    if (!("getUserMedia" in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
        if (!getUserMedia) {
          return Promise.reject(new Error("getUserMedia Not Implemented"));
        }
        
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    try {
      const videoInputs = await getListOfVideoInputs();
      
      if (videoInputs.length) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: {
              exact: videoInputs[cameraNumber].deviceId,
            },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        });
        
        if (playerRef.current) {
          playerRef.current.srcObject = stream;
        }
      } else {
        setError("Perangkat tidak memiliki kamera");
      }
    } catch (error) {
      console.error(error);
      setError("Gagal mengakses kamera");
    }
  };

  // Capture picture from camera
  const capturePicture = () => {
    if (!playerRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = playerRef.current.videoWidth;
    canvas.height = playerRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(playerRef.current, 0, 0, canvas.width, canvas.height);
    
    // Stop camera stream
    if (playerRef.current.srcObject) {
      playerRef.current.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
    
    const dataURL = canvas.toDataURL('image/jpeg', 0.9);
    setImageDataURL(dataURL);
    
    // Convert dataURL to file for background removal
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      setFile(file);
      setPreview(dataURL);
    }, 'image/jpeg', 0.9);
  };

  // Switch camera
  const switchCamera = async () => {
    const listOfVideoInputs = await getListOfVideoInputs();
    
    if (listOfVideoInputs.length > 1) {
      if (playerRef.current && playerRef.current.srcObject) {
        playerRef.current.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
      
      setCameraNumber(prevNumber => prevNumber === 0 ? 1 : 0);
    } else if (listOfVideoInputs.length === 1) {
      setError("Perangkat hanya memiliki satu kamera");
    } else {
      setError("Perangkat tidak memiliki kamera");
    }
  };

  // Get video inputs
  const getListOfVideoInputs = async () => {
    const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
    return enumerateDevices.filter((device) => device.kind === "videoinput");
  };

  // Initialize camera when camera number changes
  useEffect(() => {
    if (mode === 'camera') {
      initializeMedia();
    }
  }, [cameraNumber, mode]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current && playerRef.current.srcObject) {
        playerRef.current.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // Handle file upload
  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Silakan upload file gambar (JPG, PNG)");
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Gambar terlalu besar. Maksimal 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResultUrl(null);
    setFinalPhotoUrl(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.onerror = () => {
      setError("Gagal membaca file gambar");
      setPreview(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Remove background
  const handleRemoveBackground = async () => {
    if (!file) {
      setError("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    setError(null);
    setIsProcessingBg(true);

    try {
      const resultBlob = await removeBackground(file);
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
    } catch (error) {
      console.error("Error:", error);
      setError("Gagal menghapus background");
    } finally {
      setIsProcessingBg(false);
    }
  };

  // Load image helper function
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Combine with template
  const combineWithTemplate = async () => {
    if (!resultUrl) {
      setError("Silakan hapus background terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Load template image
      const templateImg = await loadImage(templateFramePath);

      // Load processed image (no background)
      const processedImg = await loadImage(resultUrl);

      // Set canvas size to template size
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;

      // Draw template frame first (as background)
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      // Area foto user berdasarkan template Umrah yang diberikan
      // Area kosong berada di bagian bawah template (di bawah Kabah)
      const photoAreaStartY = canvas.height * 0.36; // Mulai dari 65% tinggi template
      const photoAreaHeight = canvas.height * 0.50; // Tinggi area foto 25% dari template
      const photoAreaWidth = canvas.width * 0.60; // Lebar area foto 80% dari template

      // Calculate scaling untuk fit di area yang tersedia dengan prioritas tinggi foto
      const scaleWidth = photoAreaWidth / processedImg.width;
      const scaleHeight = photoAreaHeight / processedImg.height;
      
      // Gunakan scale yang lebih besar untuk foto yang lebih besar (crop jika perlu)
      const scale = Math.max(scaleWidth, scaleHeight);
      
      const scaledWidth = processedImg.width * scale;
      const scaledHeight = processedImg.height * scale;
      
      // Posisikan foto di tengah area yang tersedia (bagian bawah template)
      const x = (canvas.width - scaledWidth) / 2; // Tengah horizontal
      const y = photoAreaStartY + (photoAreaHeight - scaledHeight) / 2; // Tengah di area foto

      // Draw processed image on top of template
      ctx.drawImage(processedImg, x, y, scaledWidth, scaledHeight);

      // Create final result URL
      const finalUrl = canvas.toDataURL('image/jpeg', 0.9);
      setFinalPhotoUrl(finalUrl);
      
    } catch (error) {
      console.error("Error combining images:", error);
      setError("Gagal menggabungkan dengan template. Pastikan file template.jpg tersedia di folder public/");
    } finally {
      setLoading(false);
    }
  };

  // Clear/Reset
  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setFinalPhotoUrl(null);
    setImageDataURL(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (playerRef.current && playerRef.current.srcObject) {
      playerRef.current.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🕌 Umrah PhotoBooth 📸
        </h1>
        
        {/* Mode Selection */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setMode('upload')}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'upload' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Foto
            </button>
            <button
              onClick={() => setMode('camera')}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'camera' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              Ambil Foto
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {mode === 'camera' && !imageDataURL && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5" />
                <strong>Tips Pengambilan Foto:</strong>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Frame template akan muncul sebagai panduan</li>
                <li>• Posisikan wajah Anda di area yang ditandai</li>
                <li>• Atur transparansi frame jika perlu</li>
                <li>• Pastikan pencahayaan cukup terang</li>
              </ul>
            </div>
          )}
          
          {mode === 'upload' ? (
            // Upload Mode
            <div>
              {!file ? (
                <div
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                    dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-xl font-medium">
                    Seret dan lepas gambar di sini
                  </h3>
                  <p className="mb-4 text-gray-500">
                    Mendukung: JPG, PNG, JPEG (Maks 5MB)
                  </p>
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="py-3 px-6 font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Pilih File
                  </button>
                  <input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain bg-gray-100"
                    />
                    <button
                      onClick={resetAll}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{file.name}</span>
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Camera Mode
            <div className="space-y-4">
              {!imageDataURL ? (
                <div className="relative">
                  <div className="relative max-w-md mx-auto">
                    <video
                      ref={playerRef}
                      autoPlay
                      playsInline
                      className="w-full h-96 object-cover bg-gray-100 rounded-lg"
                    />
                    {/* Template Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <img
                        src={templateFramePath}
                        alt="Template Frame"
                        className="w-full h-full object-cover rounded-lg"
                        style={{ 
                          mixBlendMode: 'multiply',
                          opacity: templateOpacity
                        }}
                      />
                    </div>
                    {/* Guide untuk posisi foto */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                        className="absolute border-2 border-dashed border-yellow-400 bg-yellow-200 bg-opacity-20"
                        style={{
                          top: '36%',
                          left: '20%',
                          width: '60%',
                          height: '50%',
                          borderRadius: '8px'
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-600 text-xs font-bold bg-white bg-opacity-80 px-2 py-1 rounded">
                          Posisikan wajah di sini
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Template Opacity Control */}
                  <div className="flex justify-center items-center gap-3 mt-2 mb-4">
                    <span className="text-sm text-gray-600">Transparansi Frame:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={templateOpacity}
                      onChange={(e) => setTemplateOpacity(parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">{Math.round(templateOpacity * 100)}%</span>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={capturePicture}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Ambil Foto
                    </button>
                    <button
                      onClick={switchCamera}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Ganti Kamera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imageDataURL}
                    alt="Captured"
                    className="w-full max-h-96 object-contain bg-gray-100 rounded-lg"
                  />
                  <button
                    onClick={resetAll}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Remove Background Button */}
          {(file || imageDataURL) && (
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessingBg}
              className={`w-full mt-6 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                isProcessingBg
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              {isProcessingBg && <Loader2 className="w-5 h-5 animate-spin" />}
              {isProcessingBg ? "Menghapus Background..." : "Hapus Background"}
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Background Removed Result */}
        {resultUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Background Dihapus</h2>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <img
                src={resultUrl}
                alt="No Background"
                className="w-full max-h-96 object-contain mx-auto"
              />
            </div>
            <button
              onClick={combineWithTemplate}
              disabled={loading}
              className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Menggabungkan dengan Frame..." : "Gabungkan dengan Frame"}
            </button>
          </div>
        )}

        {/* Final Result */}
        {finalPhotoUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Hasil Final 🎉</h2>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <img
                src={finalPhotoUrl}
                alt="Final Result"
                className="w-full max-h-96 object-contain mx-auto"
              />
            </div>
            <div className="flex gap-4">
              <a
                href={finalPhotoUrl}
                download="umrah-photo.jpg"
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Foto
              </a>
              <button
                onClick={resetAll}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Foto Baru
              </button>
            </div>
          </div>
        )}

        {/* Hidden Canvas for Image Processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}