import { useState } from 'react';
import './App.css';

function TaskForm({addTask}: any) {
  let [value, setValue] = useState("");

  return (
    <div className="form-div">
      <form onSubmit={(e) => {
        setValue("")
        addTask(e, value)}}
      >
        <div className="input-div">
          <label htmlFor="Content">Task: </label>
          <input id="Content" value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}


export default TaskForm;
