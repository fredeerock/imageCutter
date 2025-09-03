class ImageGridCutter {
    constructor() {
        this.currentImage = null;
        this.gridPieces = [];
        this.stitcherGrid = [];
        this.stitcherImages = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const imageInput = document.getElementById('imageInput');
        const cutButton = document.getElementById('cutButton');
        const rowsInput = document.getElementById('rows');
        const colsInput = document.getElementById('cols');
        const downloadAllButton = document.getElementById('downloadAllButton');

        // Image cutter events
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        cutButton.addEventListener('click', () => this.cutImage());
        downloadAllButton.addEventListener('click', () => this.downloadAllPieces());
        
        // Update grid overlay when rows/cols change
        rowsInput.addEventListener('input', () => this.updateGridOverlay());
        colsInput.addEventListener('input', () => this.updateGridOverlay());

        // Image stitcher events
        const createGridButton = document.getElementById('createGridButton');
        const clearGridButton = document.getElementById('clearGridButton');
        const stitchImagesButton = document.getElementById('stitchImagesButton');
        const downloadStitchedButton = document.getElementById('downloadStitchedButton');
        const stitcherRowsInput = document.getElementById('stitcherRows');
        const stitcherColsInput = document.getElementById('stitcherCols');

        createGridButton.addEventListener('click', () => this.createStitcherGrid());
        clearGridButton.addEventListener('click', () => this.clearStitcherGrid());
        stitchImagesButton.addEventListener('click', () => this.stitchImages());
        downloadStitchedButton.addEventListener('click', () => this.downloadStitchedImage());
        
        // Update create button when grid size changes
        stitcherRowsInput.addEventListener('input', () => this.updateCreateButton());
        stitcherColsInput.addEventListener('input', () => this.updateCreateButton());
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    loadImage(imageSrc) {
        const img = new Image();
        img.onload = () => {
            this.currentImage = img;
            this.displayOriginalImage(imageSrc);
            this.showControls();
            this.updateGridOverlay();
        };
        img.src = imageSrc;
    }

    displayOriginalImage(imageSrc) {
        const originalImage = document.getElementById('originalImage');
        originalImage.src = imageSrc;
        
        const previewSection = document.getElementById('previewSection');
        previewSection.style.display = 'block';
    }

    showControls() {
        const controlsSection = document.getElementById('controlsSection');
        controlsSection.style.display = 'block';
    }

    updateGridOverlay() {
        if (!this.currentImage) return;

        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);
        const gridOverlay = document.getElementById('gridOverlay');
        
        // Clear existing grid lines
        gridOverlay.innerHTML = '';

        // Get the displayed image dimensions
        const originalImage = document.getElementById('originalImage');
        const rect = originalImage.getBoundingClientRect();
        const imgDisplayWidth = originalImage.offsetWidth;
        const imgDisplayHeight = originalImage.offsetHeight;

        // Create horizontal lines
        for (let i = 1; i < rows; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line horizontal';
            line.style.top = `${(i / rows) * 100}%`;
            gridOverlay.appendChild(line);
        }

        // Create vertical lines
        for (let i = 1; i < cols; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line vertical';
            line.style.left = `${(i / cols) * 100}%`;
            gridOverlay.appendChild(line);
        }
    }

    cutImage() {
        if (!this.currentImage) {
            alert('Please upload an image first.');
            return;
        }

        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);

        if (rows < 1 || cols < 1 || rows > 20 || cols > 20) {
            alert('Please enter valid grid dimensions (1-20 for both rows and columns).');
            return;
        }

        this.gridPieces = [];
        const canvas = document.getElementById('hiddenCanvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to original image size
        canvas.width = this.currentImage.naturalWidth;
        canvas.height = this.currentImage.naturalHeight;

        // Calculate piece dimensions
        const pieceWidth = Math.floor(canvas.width / cols);
        const pieceHeight = Math.floor(canvas.height / rows);

        // Create pieces
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const startX = col * pieceWidth;
                const startY = row * pieceHeight;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw the full image
                ctx.drawImage(this.currentImage, 0, 0);
                
                // Extract the piece
                const imageData = ctx.getImageData(startX, startY, pieceWidth, pieceHeight);
                
                // Create a new canvas for this piece
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                const pieceCtx = pieceCanvas.getContext('2d');
                pieceCtx.putImageData(imageData, 0, 0);
                
                // Convert to blob
                pieceCanvas.toBlob((blob) => {
                    const piece = {
                        blob: blob,
                        row: row + 1,
                        col: col + 1,
                        dataUrl: pieceCanvas.toDataURL('image/png'),
                        filename: `piece_${row + 1}_${col + 1}.png`
                    };
                    this.gridPieces.push(piece);
                    
                    // Check if all pieces are ready
                    if (this.gridPieces.length === rows * cols) {
                        this.displayResults();
                    }
                });
            }
        }
    }

    displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultGrid = document.getElementById('resultGrid');
        
        // Clear previous results
        resultGrid.innerHTML = '';
        
        // Sort pieces by row and column
        this.gridPieces.sort((a, b) => {
            if (a.row !== b.row) return a.row - b.row;
            return a.col - b.col;
        });

        // Create grid pieces display
        this.gridPieces.forEach(piece => {
            const gridPieceDiv = document.createElement('div');
            gridPieceDiv.className = 'grid-piece';
            
            gridPieceDiv.innerHTML = `
                <img src="${piece.dataUrl}" alt="Grid piece ${piece.row}-${piece.col}">
                <div class="piece-info">
                    <div class="piece-label">Row ${piece.row}, Col ${piece.col}</div>
                    <button class="download-button" onclick="imageCutter.downloadPiece(${this.gridPieces.indexOf(piece)})">
                        Download
                    </button>
                </div>
            `;
            
            resultGrid.appendChild(gridPieceDiv);
        });

        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    downloadPiece(index) {
        const piece = this.gridPieces[index];
        if (!piece) return;

        const link = document.createElement('a');
        link.href = piece.dataUrl;
        link.download = piece.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async downloadAllPieces() {
        if (this.gridPieces.length === 0) {
            alert('No pieces to download. Please cut an image first.');
            return;
        }

        const zip = new JSZip();
        
        // Add each piece to the zip
        for (const piece of this.gridPieces) {
            zip.file(piece.filename, piece.blob);
        }

        try {
            // Generate the zip file
            const content = await zip.generateAsync({type: 'blob'});
            
            // Create download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'image_grid_pieces.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the object URL
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error creating zip file:', error);
            alert('Error creating zip file. Please try downloading pieces individually.');
        }
    }

    // Image Stitcher Methods
    updateCreateButton() {
        const rows = parseInt(document.getElementById('stitcherRows').value);
        const cols = parseInt(document.getElementById('stitcherCols').value);
        const createButton = document.getElementById('createGridButton');
        
        if (rows >= 1 && cols >= 1 && rows <= 10 && cols <= 10) {
            createButton.textContent = `Create ${rows}×${cols} Grid`;
            createButton.disabled = false;
        } else {
            createButton.textContent = 'Invalid Grid Size';
            createButton.disabled = true;
        }
    }

    createStitcherGrid() {
        const rows = parseInt(document.getElementById('stitcherRows').value);
        const cols = parseInt(document.getElementById('stitcherCols').value);

        if (rows < 1 || cols < 1 || rows > 10 || cols > 10) {
            alert('Please enter valid grid dimensions (1-10 for both rows and columns).');
            return;
        }

        this.stitcherImages.clear();
        this.stitcherGrid = [];

        const dropGrid = document.getElementById('dropGrid');
        const dropGridContainer = document.getElementById('dropGridContainer');
        const clearGridButton = document.getElementById('clearGridButton');
        const stitchedResult = document.getElementById('stitchedResult');

        // Set up grid layout
        dropGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        dropGrid.innerHTML = '';

        // Create drop slots
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const slot = document.createElement('div');
                slot.className = 'drop-slot';
                slot.dataset.row = row;
                slot.dataset.col = col;
                slot.innerHTML = `
                    <div class="drop-slot-content">
                        <div>📷</div>
                        <div>Drop image here</div>
                        <div style="font-size: 0.8rem;">(${row + 1}, ${col + 1})</div>
                    </div>
                    <button class="remove-image" onclick="imageCutter.removeImageFromSlot(${row}, ${col})">×</button>
                    <input type="file" accept="image/*" style="display: none;" onchange="imageCutter.handleSlotFileInput(event, ${row}, ${col})">
                `;

                this.setupDropSlotEvents(slot, row, col);
                dropGrid.appendChild(slot);
            }
        }

        dropGridContainer.style.display = 'block';
        clearGridButton.style.display = 'inline-block';
        stitchedResult.style.display = 'none';
        this.updateStitchButton();
    }

    setupDropSlotEvents(slot, row, col) {
        // Click to select file
        slot.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-image')) return;
            const fileInput = slot.querySelector('input[type="file"]');
            fileInput.click();
        });

        // Drag and drop events
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.addImageToSlot(files[0], row, col);
            }
        });
    }

    handleSlotFileInput(event, row, col) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.addImageToSlot(file, row, col);
        }
    }

    addImageToSlot(file, row, col) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.stitcherImages.set(`${row}-${col}`, {
                    image: img,
                    file: file,
                    dataUrl: e.target.result
                });
                this.updateSlotDisplay(row, col, e.target.result);
                this.updateStitchButton();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updateSlotDisplay(row, col, imageSrc) {
        const slot = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        slot.classList.add('filled');
        slot.innerHTML = `
            <img src="${imageSrc}" class="drop-slot-image" alt="Slot ${row}-${col}">
            <button class="remove-image" onclick="imageCutter.removeImageFromSlot(${row}, ${col})">×</button>
            <input type="file" accept="image/*" style="display: none;" onchange="imageCutter.handleSlotFileInput(event, ${row}, ${col})">
        `;
    }

    removeImageFromSlot(row, col) {
        this.stitcherImages.delete(`${row}-${col}`);
        const slot = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        slot.classList.remove('filled');
        slot.innerHTML = `
            <div class="drop-slot-content">
                <div>📷</div>
                <div>Drop image here</div>
                <div style="font-size: 0.8rem;">(${row + 1}, ${col + 1})</div>
            </div>
            <button class="remove-image" onclick="imageCutter.removeImageFromSlot(${row}, ${col})">×</button>
            <input type="file" accept="image/*" style="display: none;" onchange="imageCutter.handleSlotFileInput(event, ${row}, ${col})">
        `;
        this.setupDropSlotEvents(slot, row, col);
        this.updateStitchButton();
    }

    updateStitchButton() {
        const stitchButton = document.getElementById('stitchImagesButton');
        const imageCount = this.stitcherImages.size;
        
        if (imageCount > 0) {
            stitchButton.disabled = false;
            stitchButton.textContent = `Stitch ${imageCount} Images Together`;
        } else {
            stitchButton.disabled = true;
            stitchButton.textContent = 'Stitch Images Together';
        }
    }

    clearStitcherGrid() {
        this.stitcherImages.clear();
        const dropGridContainer = document.getElementById('dropGridContainer');
        const clearGridButton = document.getElementById('clearGridButton');
        const stitchedResult = document.getElementById('stitchedResult');
        
        dropGridContainer.style.display = 'none';
        clearGridButton.style.display = 'none';
        stitchedResult.style.display = 'none';
    }

    async stitchImages() {
        if (this.stitcherImages.size === 0) {
            alert('Please add some images to the grid first.');
            return;
        }

        const rows = parseInt(document.getElementById('stitcherRows').value);
        const cols = parseInt(document.getElementById('stitcherCols').value);
        const maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;

        // Calculate canvas dimensions
        let maxCellWidth = 0;
        let maxCellHeight = 0;

        // Find the maximum dimensions needed
        for (const [key, data] of this.stitcherImages) {
            const { image } = data;
            if (maintainAspectRatio) {
                maxCellWidth = Math.max(maxCellWidth, image.naturalWidth);
                maxCellHeight = Math.max(maxCellHeight, image.naturalHeight);
            } else {
                maxCellWidth = Math.max(maxCellWidth, image.naturalWidth);
                maxCellHeight = Math.max(maxCellHeight, image.naturalHeight);
            }
        }

        // If not maintaining aspect ratio, use consistent cell size
        if (!maintainAspectRatio) {
            const avgWidth = Array.from(this.stitcherImages.values())
                .reduce((sum, data) => sum + data.image.naturalWidth, 0) / this.stitcherImages.size;
            const avgHeight = Array.from(this.stitcherImages.values())
                .reduce((sum, data) => sum + data.image.naturalHeight, 0) / this.stitcherImages.size;
            
            maxCellWidth = Math.round(avgWidth);
            maxCellHeight = Math.round(avgHeight);
        }

        const canvasWidth = maxCellWidth * cols;
        const canvasHeight = maxCellHeight * rows;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw images
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const key = `${row}-${col}`;
                const imageData = this.stitcherImages.get(key);
                
                if (imageData) {
                    const { image } = imageData;
                    const x = col * maxCellWidth;
                    const y = row * maxCellHeight;

                    if (maintainAspectRatio) {
                        // Calculate scaling to fit within cell while maintaining aspect ratio
                        const scaleX = maxCellWidth / image.naturalWidth;
                        const scaleY = maxCellHeight / image.naturalHeight;
                        const scale = Math.min(scaleX, scaleY);
                        
                        const scaledWidth = image.naturalWidth * scale;
                        const scaledHeight = image.naturalHeight * scale;
                        
                        // Center the image in the cell
                        const offsetX = (maxCellWidth - scaledWidth) / 2;
                        const offsetY = (maxCellHeight - scaledHeight) / 2;
                        
                        ctx.drawImage(image, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
                    } else {
                        // Stretch to fill entire cell
                        ctx.drawImage(image, x, y, maxCellWidth, maxCellHeight);
                    }
                }
            }
        }

        // Display result
        const stitchedImage = document.getElementById('stitchedImage');
        const stitchedResult = document.getElementById('stitchedResult');
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            stitchedImage.src = url;
            this.stitchedImageBlob = blob;
            stitchedResult.style.display = 'block';
            stitchedResult.scrollIntoView({ behavior: 'smooth' });
        });
    }

    downloadStitchedImage() {
        if (!this.stitchedImageBlob) {
            alert('No stitched image to download.');
            return;
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(this.stitchedImageBlob);
        link.download = 'stitched-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
}

// Initialize the application
const imageCutter = new ImageGridCutter();

// Initialize stitcher button text
imageCutter.updateCreateButton();

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add drag and drop functionality
    const uploadSection = document.querySelector('.upload-section');
    
    uploadSection.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadSection.style.backgroundColor = '#f0f8ff';
    });
    
    uploadSection.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadSection.style.backgroundColor = '';
    });
    
    uploadSection.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadSection.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const imageInput = document.getElementById('imageInput');
            imageInput.files = files;
            imageCutter.handleImageUpload({ target: { files: files } });
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to cut image
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (imageCutter.currentImage) {
            imageCutter.cutImage();
        }
    }
});
