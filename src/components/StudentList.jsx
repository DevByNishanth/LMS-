// StudentList.jsx
const StudentList = ({ students, selectedStudents, setSelectedStudents }) => {
    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter((s) => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    return (
        <div className="p-4 space-y-3">
            {students.map((stu) => (
                <div
                    key={stu.id}
                    className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleStudent(stu.id)}   // <<== entire box clickable
                >
                    <input
                        type="checkbox"
                        checked={selectedStudents.includes(stu.id)}
                        onChange={() => toggleStudent(stu.id)}  // <<== checkbox also toggles
                        onClick={(e) => e.stopPropagation()}    // IMPORTANT: prevent double toggle
                    />

                    <p className="font-medium">{stu.name}</p>
                </div>
            ))}
        </div>
    );
};

export default StudentList;
