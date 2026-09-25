import { blockManager } from "./blockManager.js";
import { canvasManager } from "./canvasManager.js";

const overlay = document.getElementById('cropOverlay');
const BAR_COLOR = '#FFEA00';
const SHADE_COLOR = 'rgba(80, 80, 80, 0.55)';
const BAR_THICKNESS = 6;   // in screen pixels
const GRAB_DISTANCE = 14;  // how close (screen pixels) the pointer must be to grab a bar

export const cropManager = {
    overlay: overlay,
    ctx: overlay.getContext('2d'),
    // Kept region in image pixels. Snapped to the block grid when used,
    // so it survives block size changes.
    rect: null,
    dragging: null, // 'left' | 'right' | 'top' | 'bottom' | null

    reset() {
        const canvas = canvasManager.canvas;
        this.rect = { x0: 0, y0: 0, x1: canvas.width, y1: canvas.height };
    },

    // Kept region in blocks: cols [col0, col1) and rows [row0, row1)
    getBlockRect() {
        const canvas = canvasManager.canvas;
        const blockSize = blockManager.blockSize;
        const cols = Math.ceil(canvas.width / blockSize);
        const rows = Math.ceil(canvas.height / blockSize);
        if (!this.rect) this.reset();

        const col0 = clamp(Math.round(this.rect.x0 / blockSize), 0, cols - 1);
        const row0 = clamp(Math.round(this.rect.y0 / blockSize), 0, rows - 1);
        const col1 = clamp(this.rect.x1 >= canvas.width ? cols : Math.round(this.rect.x1 / blockSize), col0 + 1, cols);
        const row1 = clamp(this.rect.y1 >= canvas.height ? rows : Math.round(this.rect.y1 / blockSize), row0 + 1, rows);
        return { col0, row0, col1, row1 };
    },

    // Kept region in image pixels, snapped to the block grid
    getPixelRect() {
        const canvas = canvasManager.canvas;
        const blockSize = blockManager.blockSize;
        const { col0, row0, col1, row1 } = this.getBlockRect();
        return {
            x0: col0 * blockSize,
            y0: row0 * blockSize,
            x1: Math.min(canvas.width, col1 * blockSize),
            y1: Math.min(canvas.height, row1 * blockSize),
        };
    },

    draw() {
        const canvas = canvasManager.canvas;
        this.syncOverlayPosition();

        const ctx = this.ctx;
        const w = canvas.width;
        const h = canvas.height;
        const { x0, y0, x1, y1 } = this.getPixelRect();
        const t = BAR_THICKNESS * this.screenToImageScale();

        ctx.clearRect(0, 0, w, h);

        // Grey over the blocks that will be removed (corners overlap, that's fine for now)
        ctx.fillStyle = SHADE_COLOR;
        ctx.fillRect(0, 0, x0, h);
        ctx.fillRect(x1, 0, w - x1, h);
        ctx.fillRect(0, 0, w, y0);
        ctx.fillRect(0, y1, w, h - y1);

        // Yellow bars on the inside edge of the kept region
        ctx.fillStyle = BAR_COLOR;
        ctx.fillRect(x0, y0, t, y1 - y0);
        ctx.fillRect(x1 - t, y0, t, y1 - y0);
        ctx.fillRect(x0, y0, x1 - x0, t);
        ctx.fillRect(x0, y1 - t, x1 - x0, t);

        this.updateExportDimensions();
    },

    updateExportDimensions() {
        const { col0, row0, col1, row1 } = this.getBlockRect();
        document.getElementById('exportDimensions').textContent = `${col1 - col0} x ${row1 - row0} px`;
    },

    // Line the overlay up exactly with the inside of the main canvas's border
    syncOverlayPosition() {
        const canvas = canvasManager.canvas;
        if (overlay.width !== canvas.width) overlay.width = canvas.width;
        if (overlay.height !== canvas.height) overlay.height = canvas.height;

        const canvasRect = canvas.getBoundingClientRect();
        const parentRect = overlay.offsetParent.getBoundingClientRect();
        overlay.style.left = `${canvasRect.left - parentRect.left + canvas.clientLeft}px`;
        overlay.style.top = `${canvasRect.top - parentRect.top + canvas.clientTop}px`;
        overlay.style.width = `${canvas.clientWidth}px`;
        overlay.style.height = `${canvas.clientHeight}px`;
    },

    screenToImageScale() {
        return overlay.clientWidth ? overlay.width / overlay.clientWidth : 1;
    },

    pointerToImage(event) {
        const bounds = overlay.getBoundingClientRect();
        const scale = this.screenToImageScale();
        return {
            x: (event.clientX - bounds.left) * scale,
            y: (event.clientY - bounds.top) * scale,
        };
    },

    // Which bar (if any) is under the pointer
    edgeAt(point) {
        const { x0, y0, x1, y1 } = this.getPixelRect();
        const grab = GRAB_DISTANCE * this.screenToImageScale();
        const withinX = point.x >= x0 - grab && point.x <= x1 + grab;
        const withinY = point.y >= y0 - grab && point.y <= y1 + grab;

        const candidates = [
            { edge: 'left', distance: Math.abs(point.x - x0), valid: withinY },
            { edge: 'right', distance: Math.abs(point.x - x1), valid: withinY },
            { edge: 'top', distance: Math.abs(point.y - y0), valid: withinX },
            { edge: 'bottom', distance: Math.abs(point.y - y1), valid: withinX },
        ].filter(c => c.valid && c.distance <= grab);

        if (candidates.length === 0) return null;
        return candidates.reduce((a, b) => (b.distance < a.distance ? b : a)).edge;
    },

    dragTo(point) {
        const canvas = canvasManager.canvas;
        const blockSize = blockManager.blockSize;
        const cols = Math.ceil(canvas.width / blockSize);
        const rows = Math.ceil(canvas.height / blockSize);
        const current = this.getBlockRect();

        // Past the far edge means "keep the last (possibly partial) block"
        const col = point.x >= canvas.width ? cols : Math.round(point.x / blockSize);
        const row = point.y >= canvas.height ? rows : Math.round(point.y / blockSize);

        switch (this.dragging) {
            case 'left':
                this.rect.x0 = clamp(col, 0, current.col1 - 1) * blockSize;
                break;
            case 'right':
                this.rect.x1 = Math.min(canvas.width, clamp(col, current.col0 + 1, cols) * blockSize);
                break;
            case 'top':
                this.rect.y0 = clamp(row, 0, current.row1 - 1) * blockSize;
                break;
            case 'bottom':
                this.rect.y1 = Math.min(canvas.height, clamp(row, current.row0 + 1, rows) * blockSize);
                break;
        }
        this.draw();
    },
};

const CURSORS = { left: 'ew-resize', right: 'ew-resize', top: 'ns-resize', bottom: 'ns-resize' };

overlay.addEventListener('pointerdown', (event) => {
    const edge = cropManager.edgeAt(cropManager.pointerToImage(event));
    if (!edge) return;
    cropManager.dragging = edge;
    overlay.setPointerCapture(event.pointerId);
    event.preventDefault();
});

overlay.addEventListener('pointermove', (event) => {
    const point = cropManager.pointerToImage(event);
    if (cropManager.dragging) {
        cropManager.dragTo(point);
        return;
    }
    overlay.style.cursor = CURSORS[cropManager.edgeAt(point)] || 'default';
});

function stopDragging(event) {
    if (!cropManager.dragging) return;
    cropManager.dragging = null;
    overlay.releasePointerCapture(event.pointerId);
}
overlay.addEventListener('pointerup', stopDragging);
overlay.addEventListener('pointercancel', stopDragging);

// Keep the overlay lined up when the canvas changes size on screen
new ResizeObserver(() => cropManager.draw()).observe(document.getElementById('canvas'));
window.addEventListener('resize', () => cropManager.draw());

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
