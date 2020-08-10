import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState("");

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const loadData = async () => {
      try {
        await axios
          .get("http://localhost:4000/api/users", { cancelToken: source.token })
          .then((res) => {
            setUsers(res.data);
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
  }, [users]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (_, e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/users", {
      username: userName,
    });
    e.target.reset();
  };

  const deleteUser = async (id) => {
    await axios.delete("http://localhost:4000/api/users/" + id);
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-6 ">
      <div className="">
        <div className="border-2 border-gray-400 p-3 shadow rounded bg-white">
          <h3 className="font-bold text-gray-600">Create New User</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1">
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3 w-full sm:w-1/2"
                type="text"
                onChange={onChangeUsername}
                ref={register({ required: true })}
                name="name"
              />
              {errors.name && (
                <span className="text-red-400">This field is required</span>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded my-3"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <ul className="divide-y divide-gray-400 bg-white border-2 border-gray-400">
        {users.map((user) => (
          <li
            className="px-4 py-2 text-gray-800 cursor-pointer"
            key={user._id}
            onDoubleClick={() => deleteUser(user._id)}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateUser;
