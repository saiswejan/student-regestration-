
import React, { useState } from "react";
import { CourseTypeManager } from "./components/CourseTypeManager";
import { CourseManager } from "./components/CourseManager";
import { OfferingManager } from "./components/OfferingManager";
import { RegistrationManager } from "./components/RegistrationManager";

export default function App(){
  const [tab, setTab] = useState("courseTypes");

  return (
    <div className="container">
      <header>
        <div className="brand">
          <span className="dot"></span>
          <div>
            Student Registration System
            <div className="muted" style={{fontSize:12}}>React Only • LocalStorage</div>
          </div>
        </div>
        <nav>
          <button className={"tab " + (tab==="courseTypes"?"active":"")} onClick={()=>setTab("courseTypes")}>Course Types</button>
          <button className={"tab " + (tab==="courses"?"active":"")} onClick={()=>setTab("courses")}>Courses</button>
          <button className={"tab " + (tab==="offerings"?"active":"")} onClick={()=>setTab("offerings")}>Course Offerings</button>
          <button className={"tab " + (tab==="registrations"?"active":"")} onClick={()=>setTab("registrations")}>Student Registrations</button>
        </nav>
      </header>

      {tab === "courseTypes" && <CourseTypeManager />}
      {tab === "courses" && <CourseManager />}
      {tab === "offerings" && <OfferingManager />}
      {tab === "registrations" && <RegistrationManager />}

      <div className="footer-note">Your data is saved in your browser (localStorage).</div>
    </div>
  );
}
