document.getElementById('compressionRatio').addEventListener('input', function() {
    document.getElementById('compressionValue').textContent = this.value;
});

document.getElementById('compressButton').addEventListener('click', function() {
    const input = document.getElementById('imageInput');
    const files = Array.from(input.files);
    if (files.length === 0) {
        alert('Please select images to compress.');
        return;
    }

    if (files.length > 10) {
        alert('You can only upload up to 10 images at a time.');
        return;
    }

    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = '';

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const imagePairWrapper = document.createElement('div');
                imagePairWrapper.style.display = 'flex';
                imagePairWrapper.style.flexDirection = 'row';

                const originalImageWrapper = document.createElement('div');
                originalImageWrapper.classList.add('image-wrapper');
                const originalImage = document.createElement('img');
                originalImage.src = img.src;
                const originalSize = document.createElement('span');
                originalSize.classList.add('image-size');
                originalSize.textContent = 'Size: ' + formatBytes(file.size);
                originalImageWrapper.appendChild(originalImage);
                originalImageWrapper.appendChild(originalSize);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 800;
                const maxHeight = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(function(blob) {
                    const compressedImageWrapper = document.createElement('div');
                    compressedImageWrapper.classList.add('image-wrapper');
                    const compressedImage = document.createElement('img');
                    compressedImage.src = URL.createObjectURL(blob);
                    const compressedSize = document.createElement('span');
                    compressedSize.classList.add('image-size');
                    compressedSize.textContent = 'Size: ' + formatBytes(blob.size);
                    compressedImageWrapper.appendChild(compressedImage);
                    compressedImageWrapper.appendChild(compressedSize);

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.classList.add('checkbox');
                    compressedImageWrapper.appendChild(checkbox);

                    imagePairWrapper.appendChild(originalImageWrapper);
                    imagePairWrapper.appendChild(compressedImageWrapper);
                    imageContainer.appendChild(imagePairWrapper);
                }, 'image/webp', parseFloat(document.getElementById('compressionRatio').value));
            };
        };
        reader.readAsDataURL(file);
    });
});

// Download selected images
document.getElementById('downloadSelectedButton').addEventListener('click', function() {
    const imageContainer = document.querySelector('.image-container');
    const checkboxes = imageContainer.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
        const img = checkbox.parentElement.querySelector('img');
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'compressed-image.webp';
        link.click();
    });
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
} 