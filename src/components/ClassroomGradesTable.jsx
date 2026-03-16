import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Download } from "lucide-react";

const ROW_HEIGHT = 60;
const totalMark = 100;

const ClassroomGradesTable = ({ students, setStudents, assignments }) => {
  const tableBodyRef = useRef(null);
  const menuRef = useRef(null);

  const [editing, setEditing] = useState({ row: null, col: null });
  const [emptyRows, setEmptyRows] = useState(0);

  const [menuCol, setMenuCol] = useState(null);

  const [gradeAllCol, setGradeAllCol] = useState(null);
  const [gradeValue, setGradeValue] = useState("");

  const [overrideGrades, setOverrideGrades] = useState(false);
  const [autoReturn, setAutoReturn] = useState(false);

  /* Close menu on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuCol(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value, row, col) => {
    const updated = [...students];
    updated[row].marks[col] = value;
    setStudents(updated);
  };

  /* Grade all logic */
  const applyGradeAll = () => {
    const updated = students.map((student) => {
      const newMarks = [...student.marks];

      if (overrideGrades) {
        newMarks[gradeAllCol] = gradeValue;
      } else {
        if (!newMarks[gradeAllCol]) {
          newMarks[gradeAllCol] = gradeValue;
        }
      }

      return { ...student, marks: newMarks };
    });

    setStudents(updated);

    setGradeAllCol(null);
    setGradeValue("");
    setOverrideGrades(false);
    setAutoReturn(false);
  };

  /* Column totals */
  const totals = assignments.map((_, colIndex) =>
    students.reduce((sum, student) => {
      const value = parseFloat(student.marks[colIndex]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0)
  );

  /* Dynamic empty rows */
  useEffect(() => {
    const calculateRows = () => {
      if (!tableBodyRef.current) return;

      const bodyHeight = tableBodyRef.current.clientHeight;
      const rowsNeeded = Math.floor(bodyHeight / ROW_HEIGHT);
      const emptyNeeded = Math.max(rowsNeeded - students.length, 0);

      setEmptyRows(emptyNeeded);
    };

    calculateRows();
    window.addEventListener("resize", calculateRows);

    return () => window.removeEventListener("resize", calculateRows);
  }, [students]);

  return (
    <>
      <div className="border rounded-lg overflow-hidden h-[500px] flex flex-col">

        <div ref={tableBodyRef} className="overflow-auto flex-1">
          <table className="w-full text-sm border-separate border-spacing-0">

            {/* HEADER */}
            <thead className="sticky top-0 z-30">
              <tr className="bg-[#0E3E52] text-white">

                <th className="px-4 py-4 text-left min-w-[260px] sticky left-0 bg-[#0E3E52] z-40 border-b border-r border-gray-300">
                  Student Name
                </th>

                {assignments.map((a, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-4 py-4 text-center min-w-[180px] border-b border-r border-gray-300 relative"
                  >

                    <div className="flex items-center justify-center gap-2">

                      {a}

                      <MoreVertical
                        size={18}
                        className="cursor-pointer"
                        onClick={() =>
                          setMenuCol(menuCol === colIndex ? null : colIndex)
                        }
                      />

                    </div>

                    {/* Menu */}
                    {menuCol === colIndex && (
                      <div
                        ref={menuRef}
                        className="absolute right-3 top-12 bg-white text-gray-700 shadow-xl rounded-md w-44 z-50 border"
                      >

                        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                          Edit
                        </div>

                        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                          Delete
                        </div>

                        <div
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setGradeAllCol(colIndex);
                            setMenuCol(null);
                          }}
                        >
                          Grade all
                        </div>

                      </div>
                    )}

                  </th>
                ))}

              </tr>
            </thead>

            {/* BODY */}
            <tbody className="bg-[#F7F7F7]">

              {students.map((student, rowIndex) => (
                <tr key={rowIndex}>

                  <td className="px-4 py-4 flex items-center gap-3 sticky left-0 bg-[#F7F7F7] z-20 border-b border-r border-gray-300">
                    <img
                      src="https://i.pravatar.cc/40"
                      className="w-8 h-8 rounded-full"
                    />
                    {student.name}
                  </td>

                  {student.marks.map((mark, colIndex) => (
                    <td
                      key={colIndex}
                      className="border-b border-r border-gray-300 py-4 text-center cursor-pointer"
                      onClick={() =>
                        setEditing({ row: rowIndex, col: colIndex })
                      }
                    >

                      {editing.row === rowIndex &&
                      editing.col === colIndex ? (

                        <input
                          autoFocus
                          type="number"
                          max={totalMark}
                          value={mark}
                          onChange={(e) =>
                            handleChange(e.target.value, rowIndex, colIndex)
                          }
                          onBlur={() =>
                            setEditing({ row: null, col: null })
                          }
                          className="w-16 text-center outline-none border-b border-gray-400"
                        />

                      ) : mark ? (

                        <span className="text-blue-600">{mark}</span>

                      ) : (

                        <span className="text-gray-400 font-mono">___</span>

                      )}

                      <span className="ml-1 text-gray-600">
                        / {totalMark}
                      </span>

                    </td>
                  ))}

                </tr>
              ))}

              {/* Empty rows */}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={i}>
                  <td className="border-r border-gray-300 sticky left-0 bg-[#F7F7F7]" />
                  {assignments.map((_, j) => (
                    <td key={j} className="border-r border-gray-300 h-[60px]" />
                  ))}
                </tr>
              ))}

            </tbody>

            {/* FOOTER */}
            <tfoot className="sticky bottom-0 z-30">
              <tr className="bg-[#E3E7EF]">

                <td className="px-4 py-4 font-medium sticky left-0 bg-[#E3E7EF] z-40 border-t border-r border-gray-300">
                  Class Average
                </td>

                {totals.map((value, i) => (
                  <td
                    key={i}
                    className="border-t border-r border-gray-300 text-center py-4"
                  >
                    <div className="flex justify-center gap-2 ">
                      {value}
                      <Download size={16} />
                    </div>
                  </td>
                ))}

              </tr>
            </tfoot>

          </table>
        </div>
      </div>

      {/* Grade All Modal */}
      {gradeAllCol !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 w-[450px] shadow-xl">

            <h2 className="text-lg font-medium mb-6">
              Enter the same grade for all students
            </h2>

            <div className="mb-8">
              <input
                type="number"
                className="border-b outline-none w-40 text-lg"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
              />
              <span className="ml-2 text-gray-500">/100</span>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mb-8">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideGrades}
                  onChange={() => setOverrideGrades(!overrideGrades)}
                  className="w-4 h-4"
                />
                <span>Override existing grades</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoReturn}
                  onChange={() => setAutoReturn(!autoReturn)}
                  className="w-4 h-4"
                />
                <span>Automatically return after grading</span>
              </label>

            </div>

            <div className="flex justify-end gap-6">

              <button
                onClick={() => setGradeAllCol(null)}
                className="text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={applyGradeAll}
                className="text-blue-600 font-medium"
              >
                Enter grades
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default ClassroomGradesTable;