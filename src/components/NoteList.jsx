import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

const NoteList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const loadData = async () => {
      try {
        await axios
          .get("https://noteapp-back.herokuapp.com/api/notes", { cancelToken: source.token })
          .then((res) => {
            setNotes(res.data);
          });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("cancelled");
        } else {
          throw error;
        }
      }
    };
    loadData();
    return () => {
      source.cancel();
    };
  }, [notes]);

  const deleteNote = async (id) => {
    await axios.delete("https://noteapp-back.herokuapp.com/api/notes" + id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div className="bg-white shadow rounded-lg" key={note._id}>
          <div className="bg-green-500 flex flex-row content-center justify-between px-3 rounded-t-lg">
            <h1 className="self-center text-base sm:text-lg font-bold text-white">
              {note.title}
            </h1>
            <Link
              className="bg-white text-green-500 font-bold py-2 px-4 rounded my-3"
              to={"/edit/" + note._id}
            >
              Edit
            </Link>
          </div>

          <div>
            <p className="p-3">{note.content}</p>
          </div>

          <div className="p-3">
            <p className="text-xs">{note.author}</p>
            <span className="text-xs">{format(note.date)}</span>
          </div>

          <div className="border px-3 py-1 rounded-b-lg">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-3"
              onClick={() => deleteNote(note._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
