class Touchy {
    constructor(className, clickCallback, dragCallback) {
        this.gridClick = false;
        this.gridDrag = false;

        jQuery(className).mousedown(function() {
            this.gridClick = true;
            this.gridDrag = false;
        })

        jQuery(className).mousemove(function() {
            if (this.gridClick) {
                this.gridDrag = true;
            }
        })

        jQuery(className).mouseup(function(event) {
            if (this.gridDrag) {
                dragCallback();
            } else {
                let id = event.target.getAttribute('gallery-id');
                clickCallback(id);
            }
        
            this.gridClick = false;
            this.gridDrag = false;
        })
    }
}