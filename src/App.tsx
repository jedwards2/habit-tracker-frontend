import React from 'react';
import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import taskService from './services/task'
import './App.css';
import uniqid from "uniqid";
function App() {
  let [tasksArray, setTasksArray] = useState<Task[]>([])
  let [tasksFormOpen, setTasksFormOpen] = useState(false);

  type Task ={
    streak_start: Date,
    content: string,
    updated_last: Date,
    id: any,
  }

  useEffect(() => {
    taskService.getAll().then(tasks => {
      let final = tasks.map((task: any) => {
        let newTask = {
          streak_start: new Date(task.streak_start),
          content: task.content,
          updated_last: new Date(task.updated_last),
          id: task.id,
        }

        if (checkLastUpdated(newTask)){
          newTask.streak_start = new Date();
          taskService.update(newTask.id, newTask);
        }

        return newTask;
      })

      setTasksArray(final)

    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteTask = (id: String) => {
    taskService.deleteObj(id).then((task) => {
      setTasksArray(tasksArray.filter(n => n.id !== id))
    })
  }

  function checkTask(id: string){
    const task: any = tasksArray.find(task => task.id === id);
    let newTask = {
      streak_start: task.streak_start,
      updated_last: new Date(),
      content: task.content,
      id: id,
    }

    taskService.update(id, newTask).then(task => {
      setTasksArray(tasksArray.map(n => n.id !== id ? n : {
          streak_start: new Date(task.streak_start),
          content: task.content,
          updated_last: new Date(task.updated_last),
          id: task.id,
        }))
    })
  }

  function addTask(e: React.FormEvent, content: string) {
    e.preventDefault()
    let newTask: Task = {
      streak_start: new Date(),
      updated_last: new Date("1970"),
      content: content,
      id: uniqid(),
    }

    taskService.create(newTask).then(task => {
      setTasksArray(tasksArray.concat({
          streak_start: new Date(task.streak_start),
          content: task.content,
          updated_last: new Date(task.updated_last),
          id: task.id,
        }))
      setTasksFormOpen(false);
    })
  }

  function checkDayAndYear(date1:Date, date2: Date){
    return (date1.getDay() === date2.getDay() && date1.getFullYear() === date2.getFullYear())
  }

  function checkLastUpdated(task: Task){
     //if last updated is two days ago, set streak start to now
    let updated_difference = datediff(task.updated_last, (new Date())) - 1;
    return (updated_difference > 2);
  }

   function datediff(first: any, second: any) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  function calculateStreak(task: Task){
    let difference = datediff(task.streak_start, (new Date())) - 1;
    //if the streak start and today are the same, and the last time updated is today, return 1
    if (checkDayAndYear(task.streak_start, new Date()) && (checkDayAndYear(task.updated_last, new Date()))){
      return 1;
      //if the last time updated is today return difference + 1
    } else if (checkDayAndYear(task.updated_last, new Date())){
      return difference + 1;
      //if the streak start is today, return 0
    } else if (checkDayAndYear(task.streak_start, new Date())){
      return 0;
    }else {
      //return difference
      return difference;
    }
  }

  let all_tasks = tasksArray.map((task) => {
    return (
    <div key={task.id} className={`task-row`}>
      <div className="left-div">
        {checkDayAndYear(task.updated_last, new Date()) ? <div className={`checkbox checked`}></div> : <div className={`checkbox unchecked`} onClick={() => checkTask(task.id)}></div>}
        <p>{String(calculateStreak(task))} Day Streak</p>
        <p>{task.content}</p>
      </div>
      <div className="button-div">
        <button className="taskform-button" type="button" onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>)
  });

  return (
    <div className="App">
      <div className="header">
        <h1 id="header-title">Habit Tracker</h1>
        <button type="button" className="taskform-button" onClick={() => setTasksFormOpen(!tasksFormOpen)}>Add Task</button>
      </div>
      {tasksFormOpen && <TaskForm setTasksFormOpen={setTasksFormOpen} addTask={addTask} />}
      <div id="tasks-div">
        {all_tasks}
      </div>
    </div>
  );
}

export default App;
