// Reorder helper for the .player-row list on the New Game screen.
// Works for both mouse and touch via Pointer Events (the handle has
// touch-action: none, so the browser will not hijack the gesture for scrolling).
//
// While a drag is in progress the held row is visually lifted ("dragging") and a
// gap indicator shows exactly where the held row will land when dropped. All of
// this feedback is done in plain JS (no Blazor re-render) so the drag handle is
// never recreated under the pointer mid-gesture. On release, the computed
// insertion index is passed to the Blazor onDropMethod to commit the reorder.

let dropGapEl = null;
let activeDrag = null;   // cleanup function for the currently in-flight drag

function ensureDropGap() {
    if (!dropGapEl) {
        dropGapEl = document.createElement('div');
        dropGapEl.className = 'drop-gap';
    }
    return dropGapEl;
}

function hideDropGap() {
    if (dropGapEl && dropGapEl.isConnected) dropGapEl.remove();
}

// Given a client Y coordinate, return the insertion index (0 .. rows.length) at
// which the held row should be placed. The upper half of a row means "insert
// before it", the lower half means "insert after it". A Y above the first row
// yields 0; below the last row yields rows.length.
function getInsertIndexAtY(y) {
    const rows = document.querySelectorAll('.player-row');
    for (let i = 0; i < rows.length; i++) {
        const rect = rows[i].getBoundingClientRect();
        if (y < rect.top) return i;                 // above this row -> insert before it
        if (y > rect.bottom) continue;              // below this row, check the next
        return y < (rect.top + rect.bottom) / 2 ? i : i + 1;
    }
    return rows.length;                              // below all rows
}

// Starts a drag gesture on the player row at draggedIndex. Follows the pointer,
// shows the gap indicator, and on release calls the Blazor method onDropMethod
// (on dotNetHelper) with the insertion index the held row should occupy.
function startPlayerRowDrag(draggedIndex, dotNetHelper, onDropMethod) {
    const draggedRow = document.querySelectorAll('.player-row')[draggedIndex];
    const gap = ensureDropGap();
    let insertIndex = draggedIndex;

    const showGap = (index) => {
        hideDropGap();
        const rows = document.querySelectorAll('.player-row');
        if (index >= rows.length) rows[rows.length - 1].after(gap);
        else rows[index].before(gap);
    };

    const onMove = (e) => {
        const idx = getInsertIndexAtY(e.clientY);
        if (idx !== insertIndex) {
            insertIndex = idx;
            showGap(idx);
        }
    };

    const cleanup = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onCancel);
        hideDropGap();
        if (draggedRow) draggedRow.classList.remove('dragging');
        if (activeDrag === cleanup) activeDrag = null;
    };

    const onUp = () => {
        cleanup();
        dotNetHelper.invokeMethodAsync(onDropMethod, insertIndex);
    };

    const onCancel = () => {
        cleanup();
    };

    // If a previous drag was abandoned without a pointerup/pointercancel,
    // cancel it so its listeners don't linger and fire on a later release.
    if (activeDrag) activeDrag();

    if (draggedRow) draggedRow.classList.add('dragging');
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp, { once: true });
    document.addEventListener('pointercancel', onCancel, { once: true });
    activeDrag = cleanup;
}