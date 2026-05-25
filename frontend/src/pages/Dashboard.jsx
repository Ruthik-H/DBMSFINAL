function Dashboard() {

  const students = [
    { id: 1, name: "Ruthik" },
    { id: 2, name: "Rahul" },
    { id: 3, name: "Ananya" }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <h2>Students List</h2>

      {students.map((student) => (
        <div key={student.id}>
          {student.name}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;