'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCamera, FiUpload, FiX, FiCheck, FiMaximize, FiMinimize, FiRotateCw } from 'react-icons/fi';

export default function BillScanner() {
  const [captureMode, setCaptureMode] = useState('none'); // 'none', 'camera', 'upload'
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Start camera when entering camera mode
  useEffect(() => {
    if (captureMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [captureMode]);
  
  const startCamera = async () => {
    try {
      setError('');
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile devices
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have granted camera permissions.');
      setCaptureMode('none');
    }
  };
  
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };
  
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    
    // Stop the camera after capturing
    stopCamera();
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    setCaptureMode('none');
    setError('');
    setSuccess('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const rotateImage = () => {
    if (!capturedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Create a temporary image
    const img = new Image();
    img.onload = () => {
      // Swap width and height for rotation
      canvas.width = img.height;
      canvas.height = img.width;
      
      // Rotate 90 degrees clockwise
      context.translate(canvas.width, 0);
      context.rotate(Math.PI / 2);
      context.drawImage(img, 0, 0);
      
      // Update the captured image
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    };
    img.src = capturedImage;
  };
  
  const saveBillImage = async () => {
    if (!capturedImage) return;
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      // For now, we'll simulate saving the image
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Bill image saved successfully!');
      
      // In a real app, we would:
      // 1. Upload the image to the server
      // 2. Process it with OCR if needed
      // 3. Associate it with a bill
      // 4. Redirect to bill details or create new bill form
    } catch (err) {
      setError('Failed to save bill image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Scan Bill
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Capture a photo of your bill or upload an image file.
          </p>
        </div>
        
        {isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiMinimize className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {captureMode === 'none' && !capturedImage && (
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCaptureMode('camera')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiCamera className="-ml-1 mr-2 h-5 w-5" />
                  Take Photo
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setCaptureMode('upload');
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                  Upload Image
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <p className="text-sm text-gray-500">
                Take a photo of your bill or upload an existing image from your device.
              </p>
            </div>
          )}
          
          {captureMode === 'camera' && !capturedImage && (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-2xl">
                <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setCaptureMode('none')}
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiCamera className="h-6 w-6" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FiMaximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                Position the bill within the frame and ensure it's well-lit and clearly visible.
              </p>
            </div>
          )}
          
          {capturedImage && (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-2xl">
                <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured bill"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={resetCapture}
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={rotateImage}
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FiRotateCw className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={saveBillImage}
                    disabled={isSaving}
                    className={`inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      isSaving ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiCheck className="h-6 w-6" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {isFullscreen ? <FiMinimize className="h-5 w-5" /> : <FiMaximize className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                {isSaving ? 'Saving bill image...' : 'Review the image and save it or take another photo.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
