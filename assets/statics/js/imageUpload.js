/**
 * Image Upload Drag & Drop Component
 * Handles file selection, drag-and-drop, preview, and upload using Tailwind utility classes
 */

class ImageUploader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`ImageUploader: Container #${containerId} not found`);
      return;
    }

    this.dropzone = this.container.querySelector('.dropzone');
    this.fileInput = this.container.querySelector('input[type="file"]');
    this.preview = this.container.querySelector('.preview-container');
    this.previewImage = this.container.querySelector('.preview-image');
    this.hiddenInput = this.container.querySelector('input[name="imageDir"]');
    this.removeBtn = this.container.querySelector('.remove-image-btn');
    this.uploadStatus = this.container.querySelector('.upload-status');
    this.errorMsg = this.container.querySelector('.error-message');
    this.uploadPrompt = this.container.querySelector('.upload-prompt');

    this.init();
  }

  init() {
    if (!this.dropzone || !this.fileInput) return;

    // Click to browse
    this.dropzone.addEventListener('click', (e) => {
      if (e.target !== this.removeBtn && !this.removeBtn?.contains(e.target)) {
        this.fileInput.click();
      }
    });

    // File input change
    this.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.handleFile(file);
    });

    // Drag events
    this.dropzone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
    this.dropzone.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.dropzone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    this.dropzone.addEventListener('drop', (e) => this.handleDrop(e));

    // Remove button
    if (this.removeBtn) {
      this.removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeImage();
      });
    }
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    // Use Tailwind classes for the drag-over state
    this.dropzone.classList.add('border-blue-500', 'bg-blue-50', 'scale-[1.01]');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropzone.classList.add('border-blue-500', 'bg-blue-50', 'scale-[1.01]');
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    // Only remove class if actually leaving the dropzone
    if (!this.dropzone.contains(e.relatedTarget)) {
      this.dropzone.classList.remove('border-blue-500', 'bg-blue-50', 'scale-[1.01]');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropzone.classList.remove('border-blue-500', 'bg-blue-50', 'scale-[1.01]');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file) {
    this.hideError();

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.showError('Invalid file type. Please use PNG, JPG, WebP, or GIF.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showError('File too large. Maximum size is 5MB.');
      return;
    }

    this.showPreview(file);
    this.uploadFile(file);
  }

  showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.previewImage) {
        this.previewImage.src = e.target.result;
        this.previewImage.classList.remove('hidden');
      }
      if (this.preview) {
        this.preview.classList.remove('hidden');
      }
      if (this.uploadPrompt) {
        // Hide the prompt text using Tailwind class
        this.uploadPrompt.classList.add('hidden');
      }
    };
    reader.readAsDataURL(file);
  }

  async uploadFile(file) {
    this.showStatus('Uploading...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (this.hiddenInput) {
          this.hiddenInput.value = result.filename;
        }
        
        if (result.manualUpload) {
          this.showStatus('Preview ready. Save to confirm.');
        } else {
          this.showStatus('Upload complete!');
        }
        
        setTimeout(() => this.hideStatus(), 2000);
      } else {
        this.showError(result.error || 'Upload failed');
        this.removeImage();
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.showError('Network error. Please try again.');
      this.removeImage();
    }
  }

  removeImage() {
    if (this.previewImage) {
      this.previewImage.src = '';
      this.previewImage.classList.add('hidden');
    }
    if (this.preview) {
      this.preview.classList.add('hidden');
    }
    if (this.uploadPrompt) {
      // Show the prompt text again using Tailwind class
      this.uploadPrompt.classList.remove('hidden');
    }
    if (this.hiddenInput) {
      this.hiddenInput.value = '';
    }
    if (this.fileInput) {
      this.fileInput.value = '';
    }
    this.hideError();
    this.hideStatus();
  }

  showError(message) {
    if (this.errorMsg) {
      this.errorMsg.textContent = message;
      this.errorMsg.classList.remove('hidden');
    }
  }

  hideError() {
    if (this.errorMsg) {
      this.errorMsg.textContent = '';
      this.errorMsg.classList.add('hidden');
    }
  }

  showStatus(message) {
    if (this.uploadStatus) {
      this.uploadStatus.textContent = message;
      this.uploadStatus.classList.remove('hidden');
    }
  }

  hideStatus() {
    if (this.uploadStatus) {
      this.uploadStatus.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const uploaders = document.querySelectorAll('.image-uploader-container');
  uploaders.forEach((container) => {
    new ImageUploader(container.id);
  });
});

window.ImageUploader = ImageUploader;