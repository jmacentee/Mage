// Finds the index of the .player-row element under the given client Y coordinate.
// Returns -1 if no row is under that Y.
function getPlayerRowIndexAtY(y) {
    const rows = document.querySelectorAll('.player-row');
    for (let i = 0; i < rows.length; i++) {
        const rect = rows[i].getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) return i;
    }
    return -1;
}

// Starts a drag gesture on a player row. Follows the pointer (mouse or touch),
// highlights the row the pointer is over, and when the pointer is released calls
// the Blazor method onDropMethod (on dotNetHelper) with the target row index
// (-1 if the drag ended over no row or over the original row).
// Highlighting is done in JS to avoid Blazor re-renders while the drag is in
// progress (which would recreate the drag handle under the pointer).
function startPlayerRowDrag(draggedIndex, dotNetHelper, onDropMethod) {
    let target = -1;

    const highlight = (index) => {
        const rows = document.querySelectorAll('.player-row');
        rows.forEach(r => r.classList.remove('drag-target'));
        if (index >= 0 && index !== draggedIndex) rows[index].classList.add('drag-target');
    };

    const onMove = (e) => {
        const idx = getPlayerRowIndexAtY(e.clientY);
        if (idx !== target) {
            target = idx;
            highlight(idx);
        }
    };

    const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        highlight(-1);
        dotNetHelper.invokeMethodAsync(onDropMethod, target);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp, { once: true });
    document.addEventListener('pointercancel', onUp, { once: true });
}