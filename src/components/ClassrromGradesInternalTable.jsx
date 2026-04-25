import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ROW_HEIGHT = 60;
const totalMark = 100;

const ClassroomGradesInternalTable = ({ students, setStudents, internals }) => {
  const tableBodyRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [editing, setEditing] = useState({ row: null, col: null });
  const [emptyRows, setEmptyRows] = useState(0);

  const [menuCol, setMenuCol] = useState(null);
  const [cellMenu, setCellMenu] = useState(null);

  const [gradeAllCol, setGradeAllCol] = useState(null);
  const [gradeValue, setGradeValue] = useState(""); 

  const [overrideGrades, setOverrideGrades] = useState(false);
  const [autoReturn, setAutoReturn] = useState(false);

const generatePDF = (colIndex) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const internalName = internals[colIndex]; 
  const courseShortName = "OOAD"; 
  
  const dateNow = new Date().toLocaleDateString('en-GB');
  const timeNow = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  });

  // 1. Institution Header
  doc.setFontSize(16).setFont(undefined, 'bold');
  doc.text("Sri Eshwar College of Engineering", 105, 12, { align: "center" });
  doc.setFontSize(9).setFont(undefined, 'normal');
  doc.text("Kondampatti Po, Vadasithur(via), Coimbatore-641202", 105, 17, { align: "center" });
  doc.setFontSize(8).text(`${dateNow}`, 180, 8).text(`${timeNow}`, 180, 12);

  // --- MULTICOLOR TEXT ---
  doc.setFontSize(10).setFont(undefined, 'bold');
  const txt1 = "Scorings in Test: ";
  const txt2 = `SEM 6 :: ${internalName} `;
  const txt3 = "by ";
  const txt4 = "III B.E. COMPUTER SCIENCE AND ENGINEERING - A";

  const w1 = doc.getTextWidth(txt1);
  const w2 = doc.getTextWidth(txt2);
  const w3 = doc.getTextWidth(txt3);
  const w4 = doc.getTextWidth(txt4);
  const totalW = w1 + w2 + w3 + w4;
  
  let startX = (210 - totalW) / 2;
  const headerY = 23; 

  doc.setTextColor(0, 0, 0).text(txt1, startX, headerY);
  doc.setTextColor(255, 0, 0).text(txt2, startX + w1, headerY);
  doc.setTextColor(0, 0, 0).text(txt3, startX + w1 + w2, headerY);
  doc.setTextColor(255, 0, 0).text(txt4, startX + w1 + w2 + w3, headerY);
  doc.setTextColor(0, 0, 0);

  doc.setLineWidth(0.5).line(14, 25, 196, 25); 

  // 2. MAIN MARKS TABLE
  const tableData = students.map((s, index) => {
    const mark = parseFloat(s.marks[colIndex]);
    const sortedMarks = [...students].map(st => parseFloat(st.marks[colIndex]) || 0).sort((a, b) => b - a);
    const rank = !isNaN(mark) ? sortedMarks.indexOf(mark) + 1 : "";
    return [index + 1, s.rollNo || "", s.firstName+" "+s.lastName, !isNaN(mark) ? mark : "AB", !isNaN(mark) ? mark : "", rank];
  });

  autoTable(doc, {
    startY: 32,
    margin: { left: 14 },
    tableWidth: 130, 
    head: [["S.No", "Roll No", "Student Name", internalName, "Total", "Rank"]],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 10 }, 
      1: { cellWidth: 25 }, 
      2: { cellWidth: 45 }, 
      3: { cellWidth: 20 }, 
      4: { cellWidth: 15 }, 
      5: { cellWidth: 15 }, 
    }
  });

  // 3. Statistics Table
  const marks = students.map(s => parseFloat(s.marks[colIndex]) || 0);
  const attended = students.length;
  const passed = marks.filter(m => m >= 50).length;
  const failed = attended - passed;
  const passPercent = attended > 0 ? ((passed / attended) * 100).toFixed(2) : "0.00";
  const avgMark = attended > 0 ? (marks.reduce((a, b) => a + b, 0) / attended).toFixed(2) : "0.00";

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [
      [
        { content: 'S.No', rowSpan: 2 }, 
        { content: 'Subject Short Name', rowSpan: 2 }, 
        { content: `No of Students: ${attended}`, colSpan: 4 }, // Gray
        { content: 'Subject', colSpan: 3 },                  // Gray
        { content: 'No of Students Scored', colSpan: 6 },     // Gray
        { content: 'Remarks', rowSpan: 2 }
      ],
      ["Attended", "Passed", "Failed", "Pass %", "Maximum", "Minimum", "Average", "90 & Above", "80 & Above", "70 & Above", "60 & Above", "50 & Above", "Below 50"]
    ],
    body: [[
      "1", courseShortName, attended, passed, failed, passPercent, 
      Math.max(...marks, 0), Math.min(...marks, 0), avgMark,
      marks.filter(m => m >= 90).length,
      marks.filter(m => m >= 80 && m < 90).length,
      marks.filter(m => m >= 70 && m < 80).length,
      marks.filter(m => m >= 60 && m < 70).length,
      marks.filter(m => m >= 50 && m < 60).length,
      marks.filter(m => m < 50).length, ""
    ]],
    theme: 'grid',
    styles: { fontSize: 7, textColor: [0, 0, 0], halign: 'center', valign: 'middle', lineColor: [0, 0, 0], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 1: { cellWidth: 14 }, 15: { cellWidth: 14 } },
    
    didParseCell: (data) => {
      if (data.section === 'head') {
        // ONLY Row 0 gets the Gray text for the specific columns
        if (data.row.index === 0 && [2, 6, 9].includes(data.column.index)) {
          data.cell.styles.textColor = [128, 128, 128]; 
        }

        // Setup for vertical text
        const isSubjectName = (data.row.index === 0 && data.column.index === 1);
        const isRemarks = (data.row.index === 0 && data.column.index === 15);
        const isScoreRange = (data.row.index === 1 && data.column.index >= 2 && data.column.index <= 14);

        if (isSubjectName || isRemarks || isScoreRange) {
          data.cell.styles.minCellHeight = 35;
          data.cell.rawText = data.cell.text[0]; 
          data.cell.text = [""]; 
        }
      }
    },
    
    didDrawCell: (data) => {
      if (data.section === 'head') {
        const isSubjectName = (data.row.index === 0 && data.column.index === 1);
        const isRemarks = (data.row.index === 0 && data.column.index === 15);
        const isScoreRange = (data.row.index === 1 && data.column.index >= 2 && data.column.index <= 14);

        if (isSubjectName || isRemarks || isScoreRange) {
          const text = data.cell.rawText;
          if (!text) return;

          doc.saveGraphicsState();
          const x = data.cell.x + (data.cell.width / 2) + 1.5;
          const y = data.cell.y + data.cell.height - 3;
          
          doc.setFontSize(7).setFont(undefined, 'bold');
          
          // Row 1 subheaders (like "90+", "Failed") remain Black or Red
          if (["Failed","60 & Above" , "50 & Above" ,"Below 50"].includes(text)) {
            doc.setTextColor(220, 0, 0); // Red
          } else {
            doc.setTextColor(0, 0, 0); // Black for all other subheaders
          }

          doc.text(text, x, y, { angle: 90 });
          doc.restoreGraphicsState();
        }
      }
    }
  });

  // 4. Failed Summary Box
  const summaryY = doc.lastAutoTable.finalY + 5;
  doc.setDrawColor(0).setLineWidth(0.3).rect(14, summaryY, 85, 8); 
  doc.setFont(undefined, 'bold').setFontSize(9).setTextColor(0,0,0);
  doc.text("No of Students failed in ", 18, summaryY + 5.5);
  doc.setTextColor(255, 0, 0).text("1", 54, summaryY + 5.5);
  doc.setTextColor(0, 0, 0).text(` Subject(s)   -   `, 58, summaryY + 5.5);
  doc.setTextColor(255, 0, 0).text(`${failed}`, 82, summaryY + 5.5);
  doc.setTextColor(0, 0, 0);

  // 5. Subject Info Table
  autoTable(doc, {
    startY: summaryY + 12,
    head: [["S.No", "Sub Code", "Short Name", "Subject Full Name", "Name of the faculty", "Subject Type"]],
    body: [["1", "R19CS303", courseShortName, "Object Oriented Analysis and Design", "SECETCS063 Dr. H.ANANDAKUMAR", "Theory"]],
    theme: 'grid',
    styles: { fontSize: 8, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
  });

  // 6. Date of Exam
  const examDateY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9).setFont(undefined, 'bold').text("Date of the Exam", 14, examDateY);
  doc.setFont(undefined, 'normal').text("25/02/2025", 50, examDateY);

  // 7. Toppers Table
  const toppers = [...students]
    .filter(s => !isNaN(parseFloat(s.marks[colIndex])))
    .sort((a, b) => parseFloat(b.marks[colIndex]) - parseFloat(a.marks[colIndex]))
    .slice(0, 3);
  
  doc.setFont(undefined, 'bold').text("Subject Top 3 Toppers", 14, examDateY + 8);
  autoTable(doc, {
    startY: examDateY + 10,
    head: [["#", "Roll No.", "Register No.", "Student Name", "Rank", "Mark"]],
    body: toppers.map((t, i) => [i + 1, t.rollNo || "", t.registerNo || "", t.firstName+t.lastName, i + 1, t.marks[colIndex]]),
    theme: 'grid',
    styles: { fontSize: 8, textColor: [0, 0, 0], halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], fontStyle: 'bold' },
  });

  // 8. Signatures
  const sigY = doc.lastAutoTable.finalY + 25;
  doc.setFontSize(8).setFont(undefined, 'bold');
  doc.text("Staff Signature", 14, sigY);
  doc.text("Signature of the HoD", 55, sigY);
  doc.text("Signature of the HoD\n(if other department)", 95, sigY);
  doc.text("Dean", 150, sigY);
  doc.text("Principal", 185, sigY);

  const totalPages = doc.internal.getNumberOfPages();
  doc.setPage(totalPages);
  doc.setFont(undefined, 'normal');
  doc.text(`Page ${totalPages} of ${totalPages}`, 196, 287, { align: "right" });

  doc.save(`${internalName}_Report.pdf`);
};

  /* close menus on outside click */
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuCol(null);
      setCellMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleChange = (value, row, col) => {
    const updated = [...students];
    updated[row].marks[col] = value;
    setStudents(updated);
  };

  /* Grade All Logic */
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

  /* column totals */
  const totals = internals.map((_, colIndex) =>
    students.reduce((sum, student) => {
      const value = parseFloat(student.marks[colIndex]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0)
  );

  /* dynamic empty rows */
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
      <div className="border rounded-lg overflow-auto max-h-[calc(100vh-290px)] flex flex-col">

        <div ref={tableBodyRef} className="overflow-auto flex-1">
          <table className="w-full text-sm border-separate border-spacing-0">

            {/* HEADER */}
            <thead className="sticky top-0 z-30">
              <tr className="bg-[#0E3E52] text-white">

                <th className="px-4 py-4 text-left min-w-[160px] sticky left-0 bg-[#0E3E52] z-40 border-b border-r border-gray-300">
                  Student Name
                </th>

                {internals.map((a, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-4 py-4 text-center min-w-[180px] border-b border-r border-gray-300 relative"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {a}
                    </div>

                    {/* Header Menu */}
                    {menuCol === colIndex && (
                      <div
                        ref={menuRef}
                        className="absolute right-3 top-12 bg-white text-gray-700 shadow-xl rounded-md w-44 z-50 border"
                      >
                        <div
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              const assignmentId = colIndex;

                              navigate(
                                `/dashboard/classroom/edit-assignment/${assignmentId}`
                              );

                              setMenuCol(null);
                            }}
                          >
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
                    {student.firstName}{" "}{student.lastName}
                  </td>

                  {student.marks.map((mark, colIndex) => (
                    <td
                      key={colIndex}
                      className="border-b border-r border-gray-300 py-4 text-center relative group"
                    >

                      <div
                        onClick={() =>
                          setEditing({ row: rowIndex, col: colIndex })
                        }
                        className="cursor-pointer"
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

                      </div>

                      {/* Hover dots */}
                      <MoreVertical
                        size={16}
                        className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCellMenu({ row: rowIndex, col: colIndex });
                        }}
                      />

                      {/* Cell popup */}
                      {cellMenu &&
                        cellMenu.row === rowIndex &&
                        cellMenu.col === colIndex && (

                          <div className="absolute right-2 top-8 bg-white shadow-lg border rounded w-52 z-50">

                            <div
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                              onClick={() => {

                                const courseId = "848202935062";
                                const assignmentId = colIndex;
                                const userId = rowIndex;

                                navigate(
                                  `/dashboard/classroom/submission/${courseId}/${assignmentId}/${userId}`
                                );

                                setCellMenu(null);
                              }}
                            >
                              View submission
                              <span className="text-gray-400 text-sm">
                                Ctrl+Alt+V
                              </span>
                            </div>

                          </div>
                      )}

                    </td>
                  ))}

                </tr>
              ))}

              {/* Empty rows */}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={i}>
                  <td className="border-r border-gray-300 sticky left-0 bg-[#F7F7F7]" />
                  {internals.map((_, j) => (
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
                <td key={i} className="border-t border-r border-gray-300 text-center py-4">
                    <div className="flex justify-center gap-2 items-center">
                    {(value / (students.length || 1)).toFixed(2)}
                    <button 
                        onClick={() => generatePDF(i)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        title="Download PDF for this column"
                    >
                        <Download size={16} className="text-blue-700" />
                    </button>
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

            <div className="space-y-4 mb-8">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideGrades}
                  onChange={() => setOverrideGrades(!overrideGrades)}
                />
                <span>Override existing grades</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoReturn}
                  onChange={() => setAutoReturn(!autoReturn)}
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

export default ClassroomGradesInternalTable;