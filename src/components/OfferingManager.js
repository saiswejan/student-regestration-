
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";

export function OfferingManager(){
  const { data, createOffering, updateOffering, deleteOffering } = useData();
  const [courseTypeId, setCourseTypeId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCourseTypeId, setEditCourseTypeId] = useState("");
  const [editCourseId, setEditCourseId] = useState("");
  const [msg, setMsg] = useState(null);

  const ctById = useMemo(()=>Object.fromEntries(data.courseTypes.map(ct=>[ct.id, ct.name])),[data.courseTypes]);
  const cById = useMemo(()=>Object.fromEntries(data.courses.map(c=>[c.id, c.name])),[data.courses]);

  const handleCreate = () => {
    try{
      createOffering(courseTypeId, courseId);
      setMsg({type:"success", text:"Offering created."});
      setCourseTypeId("");
      setCourseId("");
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const handleUpdate = (id) => {
    try{
      updateOffering(id, editCourseTypeId, editCourseId);
      setMsg({type:"success", text:"Offering updated."});
      setEditId(null); setEditCourseId(""); setEditCourseTypeId("");
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const handleDelete = (id) => {
    if(!window.confirm("Delete this offering? Related registrations will be removed.")) return;
    deleteOffering(id);
    setMsg({type:"success", text:"Offering deleted."});
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Create Course Offering</h2>
        {msg && <div className={msg.type === "error" ? "error":"success"}>{msg.text}</div>}
        <div className="row">
          <select value={courseTypeId} onChange={e=>setCourseTypeId(e.target.value)}>
            <option value="">Select Course Type</option>
            {data.courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
          </select>
          <select value={courseId} onChange={e=>setCourseId(e.target.value)}>
            <option value="">Select Course</option>
            {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn-primary" onClick={handleCreate}>Add</button>
        </div>
      </div>

      <div className="card">
        <h2>Existing Offerings</h2>
        <div className="list">
          {data.offerings.map(o => (
            <div className="item" key={o.id}>
              {editId === o.id ? (
                <>
                  <select value={editCourseTypeId} onChange={e=>setEditCourseTypeId(e.target.value)}>
                    <option value="">Select Course Type</option>
                    {data.courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                  </select>
                  <select value={editCourseId} onChange={e=>setEditCourseId(e.target.value)}>
                    <option value="">Select Course</option>
                    {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="row" style={{justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={()=>{setEditId(null); setEditCourseId(""); setEditCourseTypeId("");}}>Cancel</button>
                    <button className="btn-primary" onClick={()=>handleUpdate(o.id)}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div>{ctById[o.courseTypeId]} <span className="muted">—</span> {cById[o.courseId]}</div>
                    <div className="muted">{o.id}</div>
                  </div>
                  <div className="row" style={{justifyContent:"flex-end"}}>
                    <button className="btn-ghost" onClick={()=>{setEditId(o.id); setEditCourseTypeId(o.courseTypeId); setEditCourseId(o.courseId);}}>Edit</button>
                    <button className="btn-danger" onClick={()=>handleDelete(o.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {data.offerings.length === 0 && <div className="muted">No offerings yet.</div>}
        </div>
      </div>
    </div>
  );
}
