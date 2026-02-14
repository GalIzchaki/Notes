async function loadNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();

  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach((n, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${n.text}</b><br>
      <small>${n.time}</small><br>
    `;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteNote(i);

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => editNote(i, n.text);

    li.appendChild(edit);
    li.appendChild(del);
    list.appendChild(li);
  });
}

async function addNote() {
  const input = document.getElementById("noteInput");

  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });

  input.value = "";
  loadNotes();
}

async function deleteNote(i) {
  await fetch("/api/notes/" + i, { method: "DELETE" });
  loadNotes();
}

async function editNote(i, oldText) {
  const newText = prompt("Edit note:", oldText);

  if (!newText) return;

  await fetch("/api/notes/" + i, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  });

  loadNotes();
}

loadNotes();