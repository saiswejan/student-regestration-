
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";

export function RegistrationManager(){
  const { data, registerStudent, studentsForOffering } = useData();
  const [filterCourseTypeId, setFilterCourseTypeId] = useState("");
  const [offeringId, setOfferingId] = useState("");
  const [form, setForm] = useState({ name:"", email:"", phone:"" });
  const [msg, setMsg] = useState(null);

  const ctById = useMemo(()=>Object.fromEntries(data.courseTypes.map(ct=>[ct.id, ct.name])),[data.courseTypes]);
  const cById = useMemo(()=>Object.fromEntries(data.courses.map(c=>[c.id, c.name])),[data.courses]);

  const filteredOfferings = useMemo(() => {
    return data.offerings.filter(o => !filterCourseTypeId || o.courseTypeId === filterCourseTypeId);
  }, [data.offerings, filterCourseTypeId]);

  const handleRegister = () => {
    try{
      if(!offeringId) throw new Error("Select an offering.");
      registerStudent({ ...form, offeringId });
      setMsg({type:"success", text:"Student registered."});
      setForm({ name:"", email:"", phone:"" });
    }catch(e){
      setMsg({type:"error", text:e.message});
    }
  };

  const students = offeringId ? studentsForOffering(offeringId) : [];

  return (
    <div className="grid">
      <div className="card">
        <h2>Register Student</h2>
        {msg && <div className={msg.type === "error" ? "error":"success"}>{msg.text}</div>}
        <div className="row">
          <select value={filterCourseTypeId} onChange={e=>{setFilterCourseTypeId(e.target.value); setOfferingId("");}}>
            <option value="">Filter by Course Type</option>
            {data.courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
          </select>
          <select value={offeringId} onChange={e=>setOfferingId(e.target.value)}>
            <option value="">Select Offering</option>
            {filteredOfferings.map(o => (
              <option key={o.id} value={o.id}>
                {ctById[o.courseTypeId]} — {cById[o.courseId]}
              </option>
            ))}
          </select>
        </div>
        <div className="row" style={{marginTop:10}}>
          <input placeholder="Student Name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
          <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} />
          <button className="btn-primary" onClick={handleRegister}>Register</button>
        </div>
      </div>

      <div className="card">
        <h2>Registered Students {offeringId && (<span className="pill">{ctById[data.offerings.find(o=>o.id===offeringId)?.courseTypeId]} — {cById[data.offerings.find(o=>o.id===offeringId)?.courseId]}</span>)}</h2>
        {offeringId ? (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>ID</th></tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="4" className="muted">No students registered for this offering yet.</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td className="muted">{s.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="muted">Select an offering to see students.</div>
        )}
      </div>
    </div>
  );
}
