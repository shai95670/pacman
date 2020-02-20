export default class Loader {
    constructor(){
        this.images = {};
        this.loaded = false;
    }
    loadImage(key, src) {
        let img = new Image();
        this.images[key] = img;
        img.src = src;
        img.onload = function () {
            this.loaded = true;
            console.log('image loaded, image,'  + src);
        }
        img.onerror = function () {
            console.log('Could not load image: ' + src);
        };
        if (this.loaded) {
            this.images[key] = img;
            img.src = src;  
        }
    };
    getImage(key) {
        return (key in this.images) ? this.images[key] : null;
    };
}