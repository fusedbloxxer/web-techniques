// Import dependencies
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// CONSTANTS
const MONTHS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
]

const MAX_IMGS_GALLERY = 12;

// Path to the json containing info about the gallery
const root = path.resolve(__dirname, '../..');
const localJsonPath = '/static/resources/json/gallery.json'
const absJsonPath = path.join(root, localJsonPath)

// Read images from storage and generate sizes
function createImages() {
    const buffer = fs.readFileSync(absJsonPath).toString("utf-8");
    const gallery = JSON.parse(buffer);

    // Make each image to have small, medium and large sizes
    for (const img of gallery.images) {
        img.sizes = {}
        const [name, extension] = img.filename.split('.');
        const basePath = `${gallery.path}{:SIZE_PATH}/{:PRE}-${name}{:FORMAT}`;

        // Add generate multiple sizes to each image in the gallery
        for (const [size, props] of Object.entries(gallery.sizes)) {
            // Create location for the new sized image
            img.sizes[size] = basePath
                .replace('{:SIZE_PATH}', props.path)
                .replace('{:FORMAT}', props.ext)
                .replace('{:PRE}', size);

            // Specify the location of the raw image
            const rawImgPath = path.join(root, gallery.path, img.filename);
            const newImgPath = path.join(root, img.sizes[size]);

            // Create the parent folder if it does not exist
            fs.mkdir(path.dirname(newImgPath), {recursive: true}, (err) => {
                if (err) {
                    return
                }
            });

            // Generate new image if it does not exist already
            if (!fs.existsSync(newImgPath)) {
                const newSize = props.height === "auto"
                    ? [parseInt(props.width)]
                    : [parseInt(props.width), parseInt(props.height)];
                sharp(rawImgPath)
                    .resize(...newSize)
                    .toFile(newImgPath);
            }
        }
    }

    // Return the array of images
    return gallery.images;
}

function loadImages({
    filterByMonth = false,
    takeWithinLimit = false,
    filterByAvailability = false
}= {}) {
    let images = createImages();

    if (filterByMonth) {
        const currentMonth = new Date().getMonth();
        images = images.filter(image => {
            return image.months.includes(MONTHS[currentMonth])
        });
    }

    if (takeWithinLimit) {
        images = images.slice(0, MAX_IMGS_GALLERY);
    }

    if (filterByAvailability) {
        images = images.filter(image => image.available);
    }

    return images;
}

module.exports = {
    createImages,
    loadImages,
}