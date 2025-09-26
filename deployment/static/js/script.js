const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const browseBtn = document.getElementById('browseBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const uploadedImage = document.getElementById('uploadedImage');
const mainPrediction = document.getElementById('mainPrediction');
const confidenceBadge = document.getElementById('confidenceBadge');
const predictedClass = document.getElementById('predictedClass');
const classDescription = document.getElementById('classDescription');
const predictionsList = document.getElementById('predictionsList');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const loadingStatus = document.getElementById('loadingStatus');
const confidenceBar = document.getElementById('confidenceBar');
const imageSize = document.getElementById('imageSize');
const processingTime = document.getElementById('processingTime');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const togglePredictions = document.getElementById('togglePredictions');
const notificationContainer = document.getElementById('notificationContainer');

const loadingSteps = {
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    step4: document.getElementById('step4')
};

let selectedFile = null;
let isProcessing = false;
let processingStartTime = null;
let currentResults = null;
let predictionsVisible = false;

const LAND_TYPE_COLORS = {
    'Annual Crop': '#10b981',
    'Forest': '#059669',
    'Herbaceous Vegetation': '#84cc16',
    'Highway': '#6b7280',
    'Industrial': '#f59e0b',
    'Pasture': '#22c55e',
    'Permanent Crop': '#16a34a',
    'Residential': '#3b82f6',
    'River': '#06b6d4',
    'Sea Lake': '#0891b2'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkServerHealth();
    initializeAnimations();
});

function initializeEventListeners() {
    uploadArea.addEventListener('click', handleUploadAreaClick);
    fileInput.addEventListener('change', handleFileSelect);
    browseBtn.addEventListener('click', handleBrowseClick);

    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);

    uploadBtn.addEventListener('click', processImage);
    resetBtn.addEventListener('click', resetApplication);
    downloadBtn?.addEventListener('click', downloadResults);
    shareBtn?.addEventListener('click', shareResults);
    togglePredictions?.addEventListener('click', togglePredictionsList);

    document.addEventListener('keydown', handleKeyboardShortcuts);

    initializeLandTypeCards();

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    window.addEventListener('resize', debounce(handleWindowResize, 250));
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleUploadAreaClick() {
    if (!isProcessing) {
        fileInput.click();
    }
}

function handleBrowseClick() {
    if (!isProcessing) {
        fileInput.click();
    }
}

function handleDragOver(e) {
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    uploadArea.classList.remove('dragover');
}

function handleFileDrop(e) {
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFileSelection(file);
    }
}

function handleFileSelection(file) {
    if (!isImageFile(file)) {
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        return;
    }

    selectedFile = file;
    displayImagePreview(file);
    updateUploadUI();
}

function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = createImagePreview(e.target.result, file);
        uploadArea.innerHTML = imagePreview;
        
        setTimeout(() => {
            const previewElement = uploadArea.querySelector('.uploaded-preview');
            if (previewElement) {
                previewElement.style.opacity = '1';
                previewElement.style.transform = 'scale(1)';
            }
        }, 100);
    };
    reader.readAsDataURL(file);
}

function createImagePreview(imageSrc, file) {
    return `
        <div class="uploaded-preview" style="opacity: 0; transform: scale(0.95); transition: all 0.4s ease;">
            <img src="${imageSrc}" alt="Preview" style="border-radius: 15px;">
            <div class="preview-overlay">
                <div class="preview-info">
                    <div class="file-info">
                        <i class="fas fa-image"></i>
                        <span>${file.name}</span>
                    </div>
                    <div class="file-size">
                        <i class="fas fa-hdd"></i>
                        <span>${formatFileSize(file.size)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateUploadUI() {
    uploadBtn.disabled = false;
    resetBtn.style.display = 'inline-flex';
    uploadBtn.innerHTML = '<i class="fas fa-magic"></i> Analyze Image';
}

async function processImage() {
    if (!selectedFile || isProcessing) return;

    isProcessing = true;
    processingStartTime = performance.now();
    uploadBtn.disabled = true;
    
    showLoading(true);
    updateLoadingProgress(0);

    try {
        updateLoadingStep(1, 'Uploading image...');
        await sleep(500);
        updateLoadingProgress(25);

        const formData = new FormData();
        formData.append('file', selectedFile);

        updateLoadingStep(2, 'Processing image data...');
        await sleep(300);
        updateLoadingProgress(50);

        updateLoadingStep(3, 'AI is analyzing the satellite image...');
        
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        updateLoadingProgress(75);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Prediction failed');
        }

        const result = await response.json();
        
        updateLoadingStep(4, 'Analysis complete!');
        updateLoadingProgress(100);
        
        await sleep(500);
        
        currentResults = result;
        displayResults(result);
        
    } catch (error) {
        console.error('Error processing image:', error);
    } finally {
        isProcessing = false;
        uploadBtn.disabled = false;
        showLoading(false);
        resetLoadingSteps();
    }
}

function displayResults(result) {
    const processingTimeMs = performance.now() - processingStartTime;
    
    uploadedImage.src = `data:image/png;base64,${result.image}`;
    
    mainPrediction.textContent = result.predicted_class;
    confidenceBadge.textContent = `${(result.confidence * 100).toFixed(1)}%`;
    predictedClass.textContent = result.predicted_class;
    classDescription.textContent = result.description;
    
    if (imageSize) {
        const img = new Image();
        img.onload = function() {
            imageSize.textContent = `Size: ${this.naturalWidth}×${this.naturalHeight}`;
        };
        img.src = `data:image/png;base64,${result.image}`;
    }
    
    if (processingTime) {
        processingTime.textContent = `Time: ${(processingTimeMs / 1000).toFixed(1)}s`;
    }
    
    updateConfidenceVisualization(result.confidence);
    displayAllPredictions(result.all_predictions);
    showResults();
}

function updateConfidenceVisualization(confidence) {
    const percentage = (confidence * 100).toFixed(1);
    
    const badge = confidenceBadge;
    if (confidence >= 0.8) {
        badge.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    } else if (confidence >= 0.6) {
        badge.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)';
    } else {
        badge.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
    }
    
    if (confidenceBar) {
        setTimeout(() => {
            confidenceBar.style.width = `${percentage}%`;
        }, 500);
    }
}

function displayAllPredictions(predictions) {
    if (!predictionsList) return;
    
    predictionsList.innerHTML = '';
    
    predictions.forEach((pred, index) => {
        const percentage = (pred.probability * 100).toFixed(1);
        const predictionItem = createPredictionItem(pred, percentage, index);
        predictionsList.appendChild(predictionItem);
    });
    
    setTimeout(() => {
        const items = predictionsList.querySelectorAll('.prediction-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                
                const fill = item.querySelector('.prediction-fill');
                if (fill) {
                    const percentage = parseFloat(item.dataset.percentage);
                    setTimeout(() => {
                        fill.style.width = `${percentage}%`;
                    }, 200);
                }
            }, index * 150);
        });
    }, 300);
}

function createPredictionItem(pred, percentage, index) {
    const item = document.createElement('div');
    item.className = 'prediction-item';
    item.dataset.percentage = percentage;
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.4s ease';
    
    const color = LAND_TYPE_COLORS[pred.class] || '#6b7280';
    const isTopPrediction = index === 0;
    
    item.innerHTML = `
        <div class="prediction-info">
            <h6 style="color: ${isTopPrediction ? '#f093fb' : '#ffffff'};">
                ${pred.class}
                ${isTopPrediction ? '<i class="fas fa-crown" style="color: #fbbf24; margin-left: 8px;"></i>' : ''}
            </h6>
            <p>${pred.description}</p>
        </div>
        <div class="prediction-bar">
            <div class="prediction-fill" style="width: 0%; background: ${color}; transition: width 1s ease ${index * 0.1}s;"></div>
        </div>
        <span class="prediction-percentage" style="color: ${color};">${percentage}%</span>
    `;
    
    return item;
}

function showResults() {
    resultsSection.style.display = 'block';
    setTimeout(() => {
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    }, 600);
}

function resetApplication() {
    if (currentResults) {
        if (!confirm('Are you sure you want to reset? This will clear all current results.')) {
            return;
        }
    }
    
    selectedFile = null;
    isProcessing = false;
    processingStartTime = null;
    currentResults = null;
    
    uploadArea.innerHTML = `
        <div class="upload-placeholder">
            <i class="fas fa-image"></i>
            <p>Choose a satellite image to analyze</p>
            <span class="file-types">Supported: JPG, PNG, JPEG (Max: 10MB)</span>
        </div>
    `;
    
    fileInput.value = '';
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-magic"></i> Analyze Image';
    resetBtn.style.display = 'none';
    
    resultsSection.style.display = 'none';
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(30px)';
    
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    if (predictionsList) {
        predictionsList.innerHTML = '';
    }
    
    predictionsVisible = false;
    if (togglePredictions) {
        togglePredictions.innerHTML = '<i class="fas fa-eye"></i> Show All';
    }
}

function showLoading(show) {
    if (show) {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            loadingOverlay.style.opacity = '1';
        }, 10);
        
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
    } else {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 400);
        
        setTimeout(() => {
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
        }, 500);
    }
}

function updateLoadingProgress(percentage) {
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}

function updateLoadingStep(stepNumber, message) {
    Object.values(loadingSteps).forEach(step => {
        if (step) step.classList.remove('active');
    });
    
    const currentStep = loadingSteps[`step${stepNumber}`];
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    if (loadingStatus) {
        loadingStatus.textContent = message;
    }
}

function resetLoadingSteps() {
    Object.values(loadingSteps).forEach(step => {
        if (step) step.classList.remove('active');
    });
    
    if (loadingSteps.step1) {
        loadingSteps.step1.classList.add('active');
    }
    
    if (loadingStatus) {
        loadingStatus.textContent = 'AI is processing your image for land classification';
    }
    
    updateLoadingProgress(0);
}

function togglePredictionsList() {
    if (!predictionsList) return;
    
    predictionsVisible = !predictionsVisible;
    
    if (predictionsVisible) {
        predictionsList.style.maxHeight = predictionsList.scrollHeight + 'px';
        togglePredictions.innerHTML = '<i class="fas fa-eye-slash"></i> Hide All';
    } else {
        predictionsList.style.maxHeight = '200px';
        togglePredictions.innerHTML = '<i class="fas fa-eye"></i> Show All';
    }
}

function downloadResults() {
    if (!currentResults) {
        return;
    }
    
    try {
        const reportData = generateReport(currentResults);
        const blob = new Blob([reportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `land_classification_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
    }
}

function shareResults() {
    if (!currentResults) {
        return;
    }
    
    const shareText = `Land Classification Results:\n\n` +
                     `Primary Classification: ${currentResults.predicted_class}\n` +
                     `Confidence: ${(currentResults.confidence * 100).toFixed(1)}%\n` +
                     `Description: ${currentResults.description}\n\n` +
                     `Analyzed with Satellite Land Classification AI`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Land Classification Results',
            text: shareText
        }).catch((error) => {
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
    }
}

function generateReport(results) {
    const date = new Date().toLocaleString();
    const processingTimeMs = performance.now() - processingStartTime;
    
    let report = `SATELLITE LAND CLASSIFICATION REPORT\n`;
    report += `Generated: ${date}\n`;
    report += `Processing Time: ${(processingTimeMs / 1000).toFixed(2)} seconds\n\n`;
    
    report += `PRIMARY CLASSIFICATION\n`;
    report += `Class: ${results.predicted_class}\n`;
    report += `Confidence: ${(results.confidence * 100).toFixed(2)}%\n`;
    report += `Description: ${results.description}\n\n`;
    
    report += `ALL CLASSIFICATIONS\n`;
    results.all_predictions.forEach((pred, index) => {
        const percentage = (pred.probability * 100).toFixed(2);
        report += `${index + 1}. ${pred.class}: ${percentage}%\n`;
    });
    
    report += `\n---\nGenerated by Satellite Land Classification System\nPowered by VGG16 Neural Network`;
    
    return report;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    if (notificationContainer) {
        notificationContainer.appendChild(notification);
    } else {
        document.body.appendChild(notification);
    }
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

async function checkServerHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        
        if (data.status === 'healthy' && data.model_loaded) {
            showNotification('AI Model loaded successfully! Ready for satellite image analysis.', 'success');
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        if (!isProcessing && !uploadBtn.disabled) {
            fileInput.click();
        }
    }
    
    if (e.key === 'Escape') {
        if (!isProcessing) {
            resetApplication();
        }
    }
    
    if (e.key === 'Enter' && selectedFile && !isProcessing) {
        processImage();
    }
    
    if (e.key === ' ' && e.target === togglePredictions) {
        e.preventDefault();
        togglePredictionsList();
    }
}

function initializeLandTypeCards() {
    const landTypeCards = document.querySelectorAll('.land-type-card');
    
    landTypeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.info-card, .land-type-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

function handleWindowResize() {
    if (predictionsVisible && predictionsList) {
        predictionsList.style.maxHeight = predictionsList.scrollHeight + 'px';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isImageFile(file) {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    return imageTypes.includes(file.type.toLowerCase());
}

document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

uploadArea.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

if ('ontouchstart' in window) {
    uploadArea.addEventListener('touchstart', () => {
        uploadArea.style.transform = 'scale(0.98)';
    });
    
    uploadArea.addEventListener('touchend', () => {
        uploadArea.style.transform = 'scale(1)';
    });
}