import React, { useState, useCallback } from 'react';
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi';
import { uploadImage, uploadMultipleImages, getOptimizedImageUrl } from '../../../services/cloudinary/upload';
import { toast } from 'react-toastify';
import './ProductImageUpload.css';

const ProductImageUpload = ({ 
  onImagesUpload, 
  initialImages = [],
  maxImages = 5,
  title = "Product Images"
}) => {
  const [images, setImages] = useState(
    initialImages.map((url, idx) => ({
      id: idx,
      url,
      uploading: false,
      isInitial: true
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      // Add placeholder for each file
      const placeholders = fileArray.map((file, idx) => ({
        id: Date.now() + idx,
        url: URL.createObjectURL(file),
        uploading: true,
        isInitial: false,
        file
      }));

      setImages(prev => [...prev, ...placeholders]);

      // Upload files
      const results = await uploadMultipleImages(fileArray);

      if (results.success) {
        setImages(prev => {
          const updated = [...prev];
          let resultIndex = 0;
          
          // Replace uploading placeholders with actual URLs
          for (let i = 0; i < updated.length; i++) {
            if (updated[i].uploading && resultIndex < results.data.length) {
              updated[i] = {
                ...updated[i],
                url: results.data[resultIndex].url,
                publicId: results.data[resultIndex].publicId,
                uploading: false
              };
              resultIndex++;
            }
          }
          
          return updated;
        });

        toast.success(`${results.data.length} image(s) uploaded successfully`);
        
        // Callback with uploaded URLs
        const uploadedUrls = results.data.map(img => img.url);
        onImagesUpload(uploadedUrls);
      } else {
        toast.error(`Failed to upload ${results.failed} image(s)`);
      }
    } catch (error) {
      toast.error('Error uploading images: ' + error.message);
      setImages(prev => prev.filter(img => !img.uploading));
    } finally {
      setUploading(false);
    }
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    const remainingUrls = images
      .filter(img => img.id !== id)
      .map(img => img.url);
    onImagesUpload(remainingUrls);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
    
    const reorderedUrls = newImages.map(img => img.url);
    onImagesUpload(reorderedUrls);
  };

  return (
    <div className="product-image-upload">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-input"
        />
        
        <label htmlFor="image-input" className="upload-label">
          {uploading ? (
            <>
              <FiLoader size={32} className="animate-spin" />
              <p>Uploading images...</p>
            </>
          ) : (
            <>
              <FiUpload size={32} />
              <p>Drag and drop or click to upload</p>
              <span className="text-sm text-gray-500">
                {images.length}/{maxImages} images
              </span>
            </>
          )}
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="images-grid mt-6">
          <h4 className="font-semibold mb-3">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="image-card">
                <div className="image-container">
                  <img
                    src={img.url}
                    alt={`Product ${idx + 1}`}
                    className="image"
                  />
                  {img.uploading && (
                    <div className="uploading-overlay">
                      <FiLoader className="animate-spin" size={24} />
                    </div>
                  )}
                </div>

                <div className="image-actions">
                  {idx === 0 && (
                    <span className="badge badge-primary">Primary</span>
                  )}
                  
                  <button
                    onClick={() => removeImage(img.id)}
                    className="btn-remove"
                    title="Remove image"
                    disabled={img.uploading}
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Move Buttons */}
                {images.length > 1 && (
                  <div className="move-buttons">
                    {idx > 0 && (
                      <button
                        onClick={() => moveImage(idx, 'up')}
                        className="move-btn"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        onClick={() => moveImage(idx, 'down')}
                        className="move-btn"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      {images.length === 0 && (
        <div className="help-text mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
          <FiImage className="inline mr-2" size={16} />
          Upload high-quality product images (JPG, PNG). The first image will be the primary image.
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
