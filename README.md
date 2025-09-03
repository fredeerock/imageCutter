# Image Grid Cutter

A web application that allows you to upload an image and cut it into a customizable grid. Perfect for creating image puzzles, social media content, or breaking down large images into smaller pieces.

## 🌟 Features

- **Easy Upload**: Drag and drop or click to upload images
- **Customizable Grid**: Set rows and columns (1-20 each)
- **Live Preview**: See grid overlay on your original image
- **Individual Downloads**: Download each piece separately
- **Bulk Download**: Download all pieces as a ZIP file
- **Responsive Design**: Works on desktop and mobile devices
- **GitHub Pages Ready**: Deploy instantly to GitHub Pages

## 🚀 Live Demo

Visit the live demo at: `https://yourusername.github.io/imageCutter/`

## 🛠️ Usage

1. **Upload an Image**: Click "Choose Image" or drag and drop an image file
2. **Set Grid Size**: Adjust the number of rows and columns (1-20 each)
3. **Preview**: See the grid overlay on your image
4. **Cut Image**: Click "Cut Image" to process
5. **Download**: Download individual pieces or all as a ZIP

## 📱 Supported Features

- **File Types**: JPG, PNG, GIF, WebP, and other common image formats
- **Grid Sizes**: 1×1 up to 20×20 (400 pieces maximum)
- **Download Formats**: PNG format for all pieces
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
git clone https://github.com/yourusername/imageCutter.git

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
- [ ] Image filters and effects
- [ ] Custom piece shapes
- [ ] Batch processing multiple images
- [ ] Cloud storage integration

---

Built with ❤️ for the GitHub community
