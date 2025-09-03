# Image Grid Cutter & Stitcher

A comprehensive web application that allows you to:
1. **Cut images into grids**: Upload an image and slice it into customizable grid pieces
2. **Stitch images together**: Drag and drop multiple images onto a grid to combine them into one image

Perfect for creating image puzzles, social media content, photo collages, or breaking down/combining images for various creative projects.

## 🌟 Features

### Image Cutter
- **Easy Upload**: Drag and drop or click to upload images
- **Customizable Grid**: Set rows and columns (1-20 each)
- **Live Preview**: See grid overlay on your original image
- **Individual Downloads**: Download each piece separately
- **Bulk Download**: Download all pieces as a ZIP file

### Image Stitcher
- **Drag & Drop Grid**: Create custom grids (1-10 rows/columns)
- **Multiple Image Upload**: Add images by clicking or dragging to grid slots
- **Flexible Positioning**: Place images in any grid position
- **Aspect Ratio Options**: Maintain original ratios or stretch to fit
- **One-Click Stitching**: Combine all images into a single downloadable image

### General Features
- **Responsive Design**: Works on desktop and mobile devices
- **GitHub Pages Ready**: Deploy instantly to GitHub Pages
- **No Server Required**: All processing happens in your browser

## 🚀 Live Demo

Visit the live demo at: `https://fredeerock.github.io/imageCutter/`

## 🛠️ Usage

### Image Cutter
1. **Upload an Image**: Click "Choose Image" or drag and drop an image file
2. **Set Grid Size**: Adjust the number of rows and columns (1-20 each)
3. **Preview**: See the grid overlay on your image
4. **Cut Image**: Click "Cut Image" to process
5. **Download**: Download individual pieces or all as a ZIP

### Image Stitcher
1. **Create Grid**: Set grid dimensions (1-10 rows/columns) and click "Create Grid"
2. **Add Images**: Drag and drop images onto grid slots or click slots to browse files
3. **Arrange**: Remove or replace images as needed
4. **Configure**: Choose whether to maintain aspect ratios
5. **Stitch**: Click "Stitch Images Together" to combine them
6. **Download**: Save the final stitched image

## 📱 Supported Features

- **File Types**: JPG, PNG, GIF, WebP, and other common image formats
- **Cutter Grid Sizes**: 1×1 up to 20×20 (400 pieces maximum)
- **Stitcher Grid Sizes**: 1×1 up to 10×10 (100 images maximum)
- **Download Formats**: PNG format for all output images
- **Aspect Ratio Control**: Choose to maintain or stretch images when stitching
- **Keyboard Shortcuts**: Ctrl/Cmd + Enter to cut image

## 🏗️ Setup for GitHub Pages

1. **Fork or Clone** this repository
2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save
3. **Access Your Site**: Visit `https://yourusername.github.io/imageCutter/`

## 🔧 Local Development

To run locally:

```bash
# Clone the repository
git clone https://github.com/fredeerock/imageCutter.git

# Navigate to the directory
cd imageCutter

# Serve with any local server (example with Python)
python -m http.server 8000

# Or use Node.js
npx serve .

# Open http://localhost:8000 in your browser
```

## 📁 Project Structure

```
imageCutter/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

## 🎨 Technology Stack

- **HTML5**: Structure and Canvas API for image processing
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: Core functionality without frameworks
- **JSZip**: For creating downloadable ZIP files
- **GitHub Pages**: Static site hosting

## 🤝 Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Very large images may take some time to process
- Browser memory limitations apply for extremely large grids
- Mobile devices may have reduced performance with large images

## 🔮 Future Enhancements

- [ ] Custom output formats (JPG, WebP)
- [ ] Image filters and effects before cutting/stitching
- [ ] Custom piece shapes for cutting
- [ ] Batch processing multiple images
- [ ] Advanced stitching options (borders, spacing)
- [ ] Template grids for common layouts
- [ ] Cloud storage integration

---

Built with ❤️ for the GitHub community
