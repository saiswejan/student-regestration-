
import React, { useState } from "react";
import { useData } from "../context/DataContext";

export function CourseTypeManager(){
  const { data, createCourseType, updateCourseType, deleteCourseType } = useData();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [msg, setMsg] = useState(null);

  const handleCreate = () => {
    try{
      createCourseType(name);
      setMsg({type:"success", text:"Course Type created."});
      setName("");
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const handleUpdate = (id) => {
    try{
      updateCourseType(id, editName);
      setMsg({type:"success", text:"Course Type updated."});
      setEditId(null);
      setEditName("");
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const handleDelete = (id) => {
    if(!window.confirm("Delete this course type? Related offerings and registrations will be removed.")) return;
    deleteCourseType(id);
    setMsg({type:"success", text:"Course Type deleted."});
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Create Course Type</h2>
        {msg && <div className={msg.type === "error" ? "error":"success"}>{msg.text}</div>}
        <div className="row">
          <input placeholder="e.g., Individual" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn-primary" onClick={handleCreate}>Add</button>
        </div>
      </div>

      <div className="card">
        <h2>Existing Course Types</h2>
        <div className="list">
          {data.courseTypes.map(ct => (
            <div className="item" key={ct.id}>
              {editId === ct.id ? (
                <>
                  <input value={editName} onChange={e=>setEditName(e.target.value)} />
                  <div className="row" style={{justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={()=>{setEditId(null); setEditName("");}}>Cancel</button>
                    <button className="btn-primary" onClick={()=>handleUpdate(ct.id)}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div>{ct.name}</div>
                    <div className="muted">{ct.id}</div>
                  </div>
                  <div className="row" style={{justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={()=>{setEditId(ct.id); setEditName(ct.name);}}>Edit</button>
                    <button className="btn-danger" onClick={()=>handleDelete(ct.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {data.courseTypes.length === 0 && <div className="muted">No course types yet.</div>}
        </div>
      </div>
    </div>
  );
}
