class Touchy {
    constructor(className, clickCallback, dragCallback) {
        this.mouseClick = false;
        this.isDragging = false;

        jQuery(className)
            .mousedown(function() {
                this.mouseClick = true;
                this.isDragging = false;
            })
            .mousemove(function() {
                if (this.mouseClick) {
                    this.isDragging = true;
                }
            })
            .mouseup(function(event) {
                if (this.isDragging) {
                    dragCallback();
                } else {
                    let id = event.target.getAttribute('gallery-id');
                    clickCallback(id);
                }
            
                this.mouseClick = false;
            });
    }
}