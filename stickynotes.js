const notesContainer = document.getElementById("notes");
const newNoteBtn = document.getElementById("newNote");
const noteColor = document.getElementById("noteColor");

let savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");

function showNotes() {
    notesContainer.innerHTML = "";
    savedNotes.forEach((n, i) => createNote(n.text, n.x, n.y, n.color, i));
}

function createNote(text, x, y, color, index) {
    const div = document.createElement("div");
    div.className = "note";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.background = color;

    div.innerHTML = `
        <span class="closeBtn">×</span>
        <textarea>${text}</textarea>
    `;

    let textarea = div.querySelector("textarea");

    // Stop dragging when typing
    textarea.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });

    // Save typing
    textarea.oninput = (e) => {
        savedNotes[index].text = e.target.value;
        localStorage.setItem("notes", JSON.stringify(savedNotes));
    };

    // Delete note
    div.querySelector(".closeBtn").onclick = () => {
        savedNotes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(savedNotes));
        showNotes();
    };

    // Dragging
    div.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "TEXTAREA") return;

        div.style.cursor = "grabbing";

        let shiftX = e.clientX - div.offsetLeft;
        let shiftY = e.clientY - div.offsetTop;

        function move(e) {
            div.style.left = e.clientX - shiftX + "px";
            div.style.top = e.clientY - shiftY + "px";
        }

        document.addEventListener("mousemove", move);

        document.addEventListener("mouseup", () => {
            div.style.cursor = "grab";

            savedNotes[index].x = div.offsetLeft;
            savedNotes[index].y = div.offsetTop;
            localStorage.setItem("notes", JSON.stringify(savedNotes));

            document.removeEventListener("mousemove", move);
        }, { once: true });
    });

    notesContainer.appendChild(div);
}

newNoteBtn.onclick = () => {
    savedNotes.push({
        text: "",
        x: 60,
        y: 60,
        color: noteColor.value
    });

    localStorage.setItem("notes", JSON.stringify(savedNotes));
    showNotes();
};

showNotes();


