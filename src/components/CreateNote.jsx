import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { useForm } from "react-hook-form";

const CreateNote = (props) => {
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [input, setInput] = useState({
    userSelected: "",
    title: "",
    content: "",
    editing: false,
    _id: ""
  });

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const loadData = async () => {
      try {
        await axios
          .get("https://noteapp-back.herokuapp.com/api/users", { cancelToken: source.token })
          .then((res) => {
            if (res.data.length > 0) {
              setUsers(res.data.map((user) => user.username));
              setInput({ ...input, userSelected: res.data[0].username });
            } 
          });
        if (props.match.params.id) {
          const res = await axios.get(
            "https://noteapp-back.herokuapp.com/api/notes" + props.match.params.id,
            { cancelToken: source.token }
          );
          setInput({
            ...input,
            title: res.data.title,
            content: res.data.content,
            userSelected: res.data.author,
            editing: true,
            _id: res.data._id
          });
          setDate(new Date(res.data.date));
        }
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
  }, []);

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async () => {
    const newNote = {
      title: input.title,
      content: input.content,
      date: date,
      author: input.userSelected
    };

    if (input.editing) {
      await axios.put("https://noteapp-back.herokuapp.com/api/notes" + input._id, newNote);
    } else {
      await axios.post("https://noteapp-back.herokuapp.com/api/notes", newNote);
    }
    props.history.push("/");
  };

  // getting values from form
  const onInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onDayChange = (day) => {
    setDate(day);
  };

  return (
    <div className="grid grid-cols-1">
      <div className="bg-white mx-auto border-2 border-gray-400 shadow rounded w-full md:w-1/2 flex flex-col p-5">
        <h1 className="font-bold text-gray-600">
          {input.editing ? "Edit note" : "Create note"}
        </h1>
        <div className="mt-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="users"
          >
            Users
          </label>
          <select
            value={input.userSelected}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
            onChange={onInputChange}
            id="users"
            name="userSelected"
            ref={register({ required: true })}
          >
            {
              users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
              ))
            }
          </select>
          {errors.userSelected && (
            <span className="text-red-400 text-xs sm:text-sm">
              This field is required
            </span>
          )}
        </div>
        <div>
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold placeholder-gray-500"
            htmlFor="title"
          >
            title
          </label>
          <input
            className="shadow appearance-none border rounded py-3 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3 w-full mb-2"
            type="text"
            id="title"
            name="title"
            placeholder="Write a title"
            onChange={onInputChange}
            value={input.title}
            ref={register({ required: true })}
          />
          {errors.title && (
            <span className="text-red-400 text-xs sm:text-sm">
              This field is required
            </span>
          )}
        </div>
        <div>
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
            htmlFor="content"
          >
            content
          </label>
          <textarea
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3 w-full"
            name="content"
            id="content"
            onChange={onInputChange}
            value={input.content}
            placeholder="Description"
            ref={register({ required: true })}
          ></textarea>
          {errors.content && (
            <span className="text-red-400 text-xs mb-1">
              This field is required
            </span>
          )}
        </div>
        <div className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3 w-auto mb-2">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
            htmlFor="day"
          >
            Date
          </label>
          <DayPickerInput
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3 w-full mb-2"
            name="day"
            value={input.editing ? date : ""}
            onDayChange={onDayChange}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded my-3"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
