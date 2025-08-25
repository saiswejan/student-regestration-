
import React, { useState } from "react";
import { useData } from "../context/DataContext";

export function CourseManager(){
  const { data, createCourse, updateCourse, deleteCourse } = useData();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [msg, setMsg] = useState(null);

  const handleCreate = () => {
    try{
      createCourse(name);
      setMsg({type:"success", text:"Course created."});
      setName("");
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const handleUpdate = (id) => {
    try{
      updateCourse(id, editName);
      setMsg({type:"success", text:"Course updated."});
      setEditId(null);
      setEditName("");
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const handleDelete = (id) => {
    if(!window.confirm("Delete this course? Related offerings and registrations will be removed.")) return;
    deleteCourse(id);
    setMsg({type:"success", text:"Course deleted."});
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Create Course</h2>
        {msg && <div className={msg.type === "error" ? "error":"success"}>{msg.text}</div>}
        <div className="row">
          <input placeholder="e.g., English" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn-primary" onClick={handleCreate}>Add</button>
        </div>
      </div>

      <div className="card">
        <h2>Existing Courses</h2>
        <div className="list">
          {data.courses.map(c => (
            <div className="item" key={c.id}>
              {editId === c.id ? (
                <>
                  <input value={editName} onChange={e=>setEditName(e.target.value)} />
                  <div className="row" style={{justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={()=>{setEditId(null); setEditName("");}}>Cancel</button>
                    <button className="btn-primary" onClick={()=>handleUpdate(c.id)}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div>{c.name}</div>
                    <div className="muted">{c.id}</div>
                  </div>
                  <div className="row" style={{justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={()=>{setEditId(c.id); setEditName(c.name);}}>Edit</button>
                    <button className="btn-danger" onClick={()=>handleDelete(c.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {data.courses.length === 0 && <div className="muted">No courses yet.</div>}
        </div>
      </div>
    </div>
  );
}
