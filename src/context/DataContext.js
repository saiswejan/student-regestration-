
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const DataContext = createContext();
const STORAGE_KEY = "srs_full_v1";

const initialData = {
  courseTypes: [
    { id: "ct-ind", name: "Individual" },
    { id: "ct-grp", name: "Group" },
    { id: "ct-spc", name: "Special" }
  ],
  courses: [
    { id: "c-hin", name: "Hindi" },
    { id: "c-eng", name: "English" },
    { id: "c-urd", name: "Urdu" }
  ],
  offerings: [],
  students: []
};

function uid(prefix){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
}

export function DataProvider({ children }){
  const [data, setData] = useState(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : initialData;
    }catch{
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ---- Course Types CRUD ----
  const createCourseType = (name) => {
    const trimmed = (name||"").trim();
    if(!trimmed) throw new Error("Course Type name is required.");
    if(data.courseTypes.some(ct => ct.name.toLowerCase() === trimmed.toLowerCase())){
      throw new Error("Course Type with the same name already exists.");
    }
    const newCT = { id: uid("ct"), name: trimmed };
    setData(prev => ({...prev, courseTypes: [...prev.courseTypes, newCT]}));
  };

  const updateCourseType = (id, name) => {
    const trimmed = (name||"").trim();
    if(!trimmed) throw new Error("Course Type name is required.");
    if(data.courseTypes.some(ct => ct.name.toLowerCase() === trimmed.toLowerCase() && ct.id !== id)){
      throw new Error("Another Course Type already uses this name.");
    }
    setData(prev => ({
      ...prev,
      courseTypes: prev.courseTypes.map(ct => ct.id === id ? {...ct, name: trimmed} : ct)
    }));
  };

  const deleteCourseType = (id) => {
    setData(prev => {
      const offerings = prev.offerings.filter(o => o.courseTypeId !== id);
      const offeringIds = new Set(offerings.map(o => o.id));
      const students = prev.students.filter(s => offeringIds.has(s.offeringId));
      return {
        ...prev,
        courseTypes: prev.courseTypes.filter(ct => ct.id !== id),
        offerings, students
      };
    });
  };

  // ---- Courses CRUD ----
  const createCourse = (name) => {
    const trimmed = (name||"").trim();
    if(!trimmed) throw new Error("Course name is required.");
    if(data.courses.some(c => c.name.toLowerCase() === trimmed.toLowerCase())){
      throw new Error("Course with the same name already exists.");
    }
    const newC = { id: uid("c"), name: trimmed };
    setData(prev => ({...prev, courses: [...prev.courses, newC]}));
  };

  const updateCourse = (id, name) => {
    const trimmed = (name||"").trim();
    if(!trimmed) throw new Error("Course name is required.");
    if(data.courses.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== id)){
      throw new Error("Another Course already uses this name.");
    }
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? {...c, name: trimmed} : c)
    }));
  };

  const deleteCourse = (id) => {
    setData(prev => {
      const offerings = prev.offerings.filter(o => o.courseId !== id);
      const offeringIds = new Set(offerings.map(o => o.id));
      const students = prev.students.filter(s => offeringIds.has(s.offeringId));
      return {
        ...prev,
        courses: prev.courses.filter(c => c.id !== id),
        offerings, students
      };
    });
  };

  // ---- Offerings CRUD ----
  const createOffering = (courseTypeId, courseId) => {
    if(!courseTypeId || !courseId) throw new Error("Select both Course Type and Course.");
    if(data.offerings.some(o => o.courseTypeId === courseTypeId && o.courseId === courseId)){
      throw new Error("This course offering already exists.");
    }
    const newO = { id: uid("o"), courseTypeId, courseId };
    setData(prev => ({...prev, offerings: [...prev.offerings, newO]}));
  };

  const updateOffering = (id, courseTypeId, courseId) => {
    if(!courseTypeId || !courseId) throw new Error("Select both Course Type and Course.");
    if(data.offerings.some(o => o.courseTypeId === courseTypeId && o.courseId === courseId && o.id !== id)){
      throw new Error("Another offering with the same association already exists.");
    }
    setData(prev => ({
      ...prev,
      offerings: prev.offerings.map(o => o.id === id ? {...o, courseTypeId, courseId} : o)
    }));
  };

  const deleteOffering = (id) => {
    setData(prev => ({
      ...prev,
      offerings: prev.offerings.filter(o => o.id !== id),
      students: prev.students.filter(s => s.offeringId !== id)
    }));
  };

  // ---- Student Registrations ----
  const registerStudent = ({ name, email, phone, offeringId }) => {
    const n = (name||"").trim();
    const e = (email||"").trim();
    const p = (phone||"").trim();
    if(!n || !e || !p || !offeringId) throw new Error("All fields are required.");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if(!emailOk) throw new Error("Please enter a valid email.");
    const st = { id: uid("s"), name:n, email:e, phone:p, offeringId };
    setData(prev => ({...prev, students: [...prev.students, st]}));
  };

  const studentsForOffering = (offeringId) => data.students.filter(s => s.offeringId === offeringId);

  const value = useMemo(() => ({
    data,
    createCourseType, updateCourseType, deleteCourseType,
    createCourse, updateCourse, deleteCourse,
    createOffering, updateOffering, deleteOffering,
    registerStudent, studentsForOffering
  }), [data]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(){
  const ctx = useContext(DataContext);
  if(!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
