class ImageGridCutter {
    constructor() {
        this.currentImage = null;
        this.gridPieces = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const imageInput = document.getElementById('imageInput');
        const cutButton = document.getElementById('cutButton');
        const rowsInput = document.getElementById('rows');
        const colsInput = document.getElementById('cols');
        const downloadAllButton = document.getElementById('downloadAllButton');

        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        cutButton.addEventListener('click', () => this.cutImage());
        downloadAllButton.addEventListener('click', () => this.downloadAllPieces());
        
        // Update grid overlay when rows/cols change
        rowsInput.addEventListener('input', () => this.updateGridOverlay());
        colsInput.addEventListener('input', () => this.updateGridOverlay());
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
}

// Initialize the application
const imageCutter = new ImageGridCutter();

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
