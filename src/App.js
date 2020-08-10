import React from "react";
import Navigation from "./components/Navigation";
import CreateNote from "./components/CreateNote";
import NoteList from "./components/NoteList";
import CreateUser from "./components/CreateUser";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <div className="bg-gray-200">
      <Router>
        <Navigation />
        <div className="container p-4 mx-auto">
          <Route path="/" exact component={NoteList} />
          <Route path="/edit/:id" component={CreateNote} />
          <Route path="/create" component={CreateNote} />
          <Route path="/user" component={CreateUser} />
        </div>
      </Router>
    </div>
  );
}

export default App;
