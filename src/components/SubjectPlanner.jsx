import React, { useState, useEffect } from "react";
import { X, Edit2, Check, AlertTriangle, Save, Plus, Calendar } from "lucide-react";

export default function SubjectPlanner({
  data,
  onNext,
  onPrev,
}) {

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  console.log(loading);
  
  // Assessments with support for multiple dates - removed default values
  const [assessments, setAssessments] = useState([
    { 
      id: 1, 
      name: "CIA I", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 2, 
      name: "CIA II", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 3, 
      name: "CIA III", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 4, 
      name: "Project Review – 1", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 5, 
      name: "Project Review - 2", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
  ]);

  const [activities, setActivities] = useState([
    { 
      id: 1, 
      name: "Seminar", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 2, 
      name: "Guest Lecture", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 3, 
      name: "Workshop", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
    { 
      id: 4, 
      name: "Industrial Visit", 
      proposedDates: [], 
      actualDates: [], 
      reasons: [] 
    },
  ]);

  const [facultySignature, setFacultySignature] = useState({
    name: "",
    signatureWithDate: "",
  });

  const [reviewer, setReviewer] = useState({
    signature: "",
    date: "",
  });

  const [approver, setApprover] = useState({
    signature: "",
    date: "",
  });

  const [academics, setAcademics] = useState({
    dean: "",
    date: "",
  });

  // Load existing data if available
  useEffect(() => {
    if (data) {
      if (data.assessments) setAssessments(data.assessments);
      if (data.activities) setActivities(data.activities);
      if (data.facultySignature) setFacultySignature(data.facultySignature);
      if (data.reviewer) setReviewer(data.reviewer);
      if (data.approver) setApprover(data.approver);
      if (data.academics) setAcademics(data.academics);
    }
  }, [data]);

  // Add new date row for assessment
  const addAssessmentDateRow = (assessmentId) => {
    setAssessments(prev =>
      prev.map(item => {
        if (item.id === assessmentId) {
          return {
            ...item,
            proposedDates: [...item.proposedDates, ""],
            actualDates: [...item.actualDates, ""],
            reasons: [...item.reasons, ""]
          };
        }
        return item;
      })
    );
  };

  // Remove date row from assessment
  const removeAssessmentDateRow = (assessmentId, rowIndex) => {
    setAssessments(prev =>
      prev.map(item => {
        if (item.id === assessmentId && item.proposedDates.length > 0) {
          return {
            ...item,
            proposedDates: item.proposedDates.filter((_, idx) => idx !== rowIndex),
            actualDates: item.actualDates.filter((_, idx) => idx !== rowIndex),
            reasons: item.reasons.filter((_, idx) => idx !== rowIndex)
          };
        }
        return item;
      })
    );
  };

  // Add new date row for activity
  const addActivityDateRow = (activityId) => {
    setActivities(prev =>
      prev.map(item => {
        if (item.id === activityId) {
          return {
            ...item,
            proposedDates: [...item.proposedDates, ""],
            actualDates: [...item.actualDates, ""],
            reasons: [...item.reasons, ""]
          };
        }
        return item;
      })
    );
  };

  // Remove date row from activity
  const removeActivityDateRow = (activityId, rowIndex) => {
    setActivities(prev =>
      prev.map(item => {
        if (item.id === activityId && item.proposedDates.length > 0) {
          return {
            ...item,
            proposedDates: item.proposedDates.filter((_, idx) => idx !== rowIndex),
            actualDates: item.actualDates.filter((_, idx) => idx !== rowIndex),
            reasons: item.reasons.filter((_, idx) => idx !== rowIndex)
          };
        }
        return item;
      })
    );
  };

  const handleAssessmentChange = (id, rowIndex, field, value) => {
    setAssessments(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (field === 'actualDate') {
            const newActualDates = [...item.actualDates];
            newActualDates[rowIndex] = value;
            return { ...item, actualDates: newActualDates };
          } else if (field === 'reason') {
            const newReasons = [...item.reasons];
            newReasons[rowIndex] = value;
            return { ...item, reasons: newReasons };
          } else if (field === 'proposedDate') {
            const newProposedDates = [...item.proposedDates];
            newProposedDates[rowIndex] = value;
            return { ...item, proposedDates: newProposedDates };
          }
        }
        return item;
      })
    );
  };

  const handleActivityChange = (id, rowIndex, field, value) => {
    setActivities(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (field === 'actualDate') {
            const newActualDates = [...item.actualDates];
            newActualDates[rowIndex] = value;
            return { ...item, actualDates: newActualDates };
          } else if (field === 'reason') {
            const newReasons = [...item.reasons];
            newReasons[rowIndex] = value;
            return { ...item, reasons: newReasons };
          } else if (field === 'proposedDate') {
            const newProposedDates = [...item.proposedDates];
            newProposedDates[rowIndex] = value;
            return { ...item, proposedDates: newProposedDates };
          }
        }
        return item;
      })
    );
  };

  const saveData = () => {
    setIsSaving(true);
    const payload = {
      assessments,
      activities,
      facultySignature,
      reviewer,
      approver,
      academics,
    };
    console.log(payload);
    // Just update the live planning data
    // updateLivePlanningData("subjectPlanner", payload);
  };

  const handleNext = () => {
    setLoading(true);
    saveData();
    onNext();
    setLoading(false);
  };

  const handlePrev = () => {
    setLoading(true);
    saveData();
    setLoading(false);
    onPrev();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <h2 className="font-medium text-lg mb-4 text-[#08384F]">
        Subject Planner
      </h2>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        {/* First Table - Assessments */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"> 
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S. No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name of the Assessment*
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposed Date(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Date(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason for change, if any
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {item.proposedDates.length === 0 ? (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 align-top">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => {
                              if (item.proposedDates.length === 0) {
                                addAssessmentDateRow(item.id);
                                setTimeout(() => {
                                  handleAssessmentChange(item.id, 0, "proposedDate", e.target.value);
                                }, 0);
                              }
                            }}
                            placeholder="Enter proposed date"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => {
                              if (item.proposedDates.length === 0) {
                                addAssessmentDateRow(item.id);
                                setTimeout(() => {
                                  handleAssessmentChange(item.id, 0, "actualDate", e.target.value);
                                }, 0);
                              }
                            }}
                            placeholder="Enter actual date"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => {
                              if (item.proposedDates.length === 0) {
                                addAssessmentDateRow(item.id);
                                setTimeout(() => {
                                  handleAssessmentChange(item.id, 0, "reason", e.target.value);
                                }, 0);
                              }
                            }}
                            placeholder="Enter reason"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-top">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => addAssessmentDateRow(item.id)}
                              className="p-1 text-[#08384f]"
                              title="Add another date"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      item.proposedDates.map((proposedDate, rowIndex) => (
                        <tr key={`${item.id}-${rowIndex}`} className="hover:bg-gray-50">
                          {rowIndex === 0 && (
                            <td 
                              rowSpan={item.proposedDates.length} 
                              className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top"
                            >
                              {index + 1}
                            </td>
                          )}
                          {rowIndex === 0 && (
                            <td 
                              rowSpan={item.proposedDates.length} 
                              className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 align-top"
                            >
                              {item.name}
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              value={proposedDate}
                              onChange={(e) =>
                                handleAssessmentChange(item.id, rowIndex, "proposedDate", e.target.value)
                              }
                              placeholder="Enter proposed date"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              value={item.actualDates[rowIndex] || ""}
                              onChange={(e) =>
                                handleAssessmentChange(item.id, rowIndex, "actualDate", e.target.value)
                              }
                              placeholder="Enter actual date"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              value={item.reasons[rowIndex] || ""}
                              onChange={(e) =>
                                handleAssessmentChange(item.id, rowIndex, "reason", e.target.value)
                              }
                              placeholder="Enter reason"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center align-top">
                            <div className="flex gap-2 justify-center">
                              {rowIndex === 0 && (
                                <button
                                  onClick={() => addAssessmentDateRow(item.id)}
                                  className="p-1 text-[#08384f]"
                                  title="Add another date"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                              {item.proposedDates.length > 1 && (
                                <button
                                  onClick={() => removeAssessmentDateRow(item.id, rowIndex)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove this date"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Second Table - Activities */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S. No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name of the Activity*
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposed Date(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Date(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason for change, if any
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {item.proposedDates.length === 0 ? (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 align-top">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => {
                              if (item.proposedDates.length === 0) {
                                addActivityDateRow(item.id);
                                setTimeout(() => {
                                  handleActivityChange(item.id, 0, "proposedDate", e.target.value);
                                }, 0);
                              }
                            }}
                            placeholder="Enter proposed date"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => {
                              if (item.proposedDates.length === 0) {
                                addActivityDateRow(item.id);
                                setTimeout(() => {
                                  handleActivityChange(item.id, 0, "actualDate", e.target.value);
                                }, 0);
                              }
                            }}
                            placeholder="Enter actual date"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value=""
                            onChange={(e) => {
                              if (item.proposedDates.length === 0) {
                                addActivityDateRow(item.id);
                                setTimeout(() => {
                                  handleActivityChange(item.id, 0, "reason", e.target.value);
                                }, 0);
                              }
                            }}
                            placeholder="Enter reason"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-top">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => addActivityDateRow(item.id)}
                              className="p-1 text-[#08384f]"
                              title="Add another date"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      item.proposedDates.map((proposedDate, rowIndex) => (
                        <tr key={`${item.id}-${rowIndex}`} className="hover:bg-gray-50">
                          {rowIndex === 0 && (
                            <td 
                              rowSpan={item.proposedDates.length} 
                              className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top"
                            >
                              {index + 1}
                            </td>
                          )}
                          {rowIndex === 0 && (
                            <td 
                              rowSpan={item.proposedDates.length} 
                              className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 align-top"
                            >
                              {item.name}
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              value={proposedDate}
                              onChange={(e) =>
                                handleActivityChange(item.id, rowIndex, "proposedDate", e.target.value)
                              }
                              placeholder="Enter proposed date"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              value={item.actualDates[rowIndex] || ""}
                              onChange={(e) =>
                                handleActivityChange(item.id, rowIndex, "actualDate", e.target.value)
                              }
                              placeholder="Enter actual date"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              value={item.reasons[rowIndex] || ""}
                              onChange={(e) =>
                                handleActivityChange(item.id, rowIndex, "reason", e.target.value)
                              }
                              placeholder="Enter reason"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center align-top">
                            <div className="flex gap-2 justify-center">
                              {rowIndex === 0 && (
                                <button
                                  onClick={() => addActivityDateRow(item.id)}
                                  className="p-1 text-[#08384f]"
                                  title="Add another date"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                              {item.proposedDates.length > 1 && (
                                <button
                                  onClick={() => removeActivityDateRow(item.id, rowIndex)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove this date"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={handlePrev}
          disabled={isSaving}
          className="bg-gray-100 text-gray-700 font-medium px-6 py-2 rounded-md hover:bg-gray-200 border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Previous"}
        </button>
        <button
          onClick={handleNext}
          disabled={isSaving}
          className="bg-[#08384F] text-white font-medium px-8 py-2 rounded-md shadow-md hover:bg-[#062c3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}