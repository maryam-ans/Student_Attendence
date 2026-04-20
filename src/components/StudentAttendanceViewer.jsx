import { useEffect, useState } from "react";
import "./StudentAttendanceViewer.css";

export default function StudentAttendanceViewer() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showLowAttendance, setShowLowAttendance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        const updated = data.map((student) => ({
          ...student,
          attendance: Math.floor(Math.random() * 101),
        }));
        setStudents(updated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredStudents = students
    .filter((student) => {
      if (filter === "PRESENT") return student.attendance >= 75;
      if (filter === "ABSENT") return student.attendance < 75;
      return true;
    })
    .filter((student) => {
      if (showLowAttendance) return student.attendance < 75;
      return true;
    })
    .sort((a, b) => b.attendance - a.attendance);

  if (loading) return <p className="status">Loading...</p>;
  if (students.length === 0) return <p className="status">No students found</p>;

  return (
    <div className="container">
      <h2>Student Attendance Viewer 🎓</h2>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter("ALL")}>All</button>
        <button onClick={() => setFilter("PRESENT")}>Present</button>
        <button onClick={() => setFilter("ABSENT")}>Absent</button>
      </div>

      {/* Toggle */}
      <label className="toggle">
        <input
          type="checkbox"
          checked={showLowAttendance}
          onChange={() => setShowLowAttendance(!showLowAttendance)}
        />
        Show &lt;75% attendance
      </label>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance %</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => {
            const isLow = student.attendance < 75;

            return (
              <tr
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={
                  selectedStudent === student.id ? "selected" : ""
                }
              >
                <td>{student.name}</td>
                <td>{student.attendance}%</td>
                <td>
                  <span className={isLow ? "badge low" : "badge good"}>
                    {isLow ? "Low" : "Good"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}