import React, { useState, useEffect, useRef } from "react";
import { X, Link, Youtube, Upload, FileText, Plus, Users, ChevronDown, Info, HelpCircle, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ClassroomEditAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    instruction: "",
    dueDate: "",
    marks: "100",
  });

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [activeModal, setActiveModal] = useState(null); 
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/assignment/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      setFormData({
        title: data.title || "",
        instruction: data.instruction || "",
        dueDate: data.dueDate?.split("T")[0] || "",
        marks: data.marks || "100",
      });
      setResources(data.resources || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddResource = (type) => {
    if (!inputValue && type !== 'upload') return;
    const newResource = { type, value: type === 'upload' ? selectedFile.name : inputValue };
    setResources([...resources, newResource]);
    closeModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setFileError("File is too large. Maximum size is 5MB.");
        setSelectedFile(null);
      } else {
        setFileError("");
        setSelectedFile(file);
      }
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setInputValue("");
    setSelectedFile(null);
    setFileError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("LmsToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}api/assignment/${assignmentId}`,
        { ...formData, resources },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(-1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-800 relative">
      
      {/* --- MODAL OVERLAY --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-[22px] font-medium text-gray-900">
                {activeModal === 'upload' ? 'Upload file' : `Add ${activeModal === 'link' ? 'link' : activeModal}`}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={28} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-8">
              {activeModal === 'upload' ? (
                <div className="space-y-4">
                  {/* Dashed Border Container matched to Image 2 */}
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-[1.5px] border-dashed border-gray-400 rounded-md py-14 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <Upload size={32} className="text-[#5f6368]" />
                    <span className="text-[17px] text-[#3c4043] font-normal">
                      {selectedFile ? selectedFile.name : "Upload files here"}
                    </span>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[#70757a] text-[13px] justify-center">
                    <AlertCircle size={15} />
                    <span>Maximum file size: 5MB</span>
                  </div>
                  {fileError && <p className="text-red-600 text-[13px] text-center">{fileError}</p>}
                </div>
              ) : (
                <div className="mt-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Enter the link"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3.5 text-base outline-none focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] transition-all placeholder:text-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer matched to Image 1 button placement */}
            <div className="flex justify-end gap-3 px-6 py-4 mb-2">
              <button onClick={closeModal} className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => handleAddResource(activeModal)}
                disabled={activeModal === 'upload' ? !selectedFile : !inputValue}
                className="px-6 py-2.5 bg-[#0a414e] text-white font-medium rounded-md hover:bg-[#083540] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {activeModal === 'upload' ? 'Upload' : `Add ${activeModal === 'link' ? 'Link' : activeModal}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP NAV BAR --- */}
      <div className="h-16  flex items-center justify-between px-4 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#e6f4ea] rounded-full flex items-center justify-center">
               <FileText size={20} className="text-[#137333]" />
            </div>
            <h1 className="text-xl font-normal text-gray-700">Assignment</h1>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !formData.title}
          className={`px-8 py-2 rounded font-medium text-sm transition-all shadow-sm ${
            !formData.title ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#1a73e8] text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-6 lg:p-10 flex flex-col items-center">
          <div className="w-full max-w-[850px] space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-8 group">
                <div className="bg-[#f1f3f4] rounded-t p-3 border-b border-gray-400 group-focus-within:border-blue-600 transition-colors">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase">Title*</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-transparent text-base outline-none pt-1"
                    placeholder="e.g. Weekly Quiz 1"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">*Required</p>
              </div>

              <div className="bg-[#f8f9fa] rounded p-4 border-b border-gray-300 focus-within:border-blue-600 focus-within:bg-white transition-all">
                <textarea
                  name="instruction"
                  value={formData.instruction}
                  onChange={handleChange}
                  placeholder="Instructions (optional)"
                  className="w-full min-h-[200px] bg-transparent outline-none resize-none text-[15px]"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-[15px] font-normal text-gray-700 mb-8">Attach</h3>
              <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
                {[
                  { id: 'drive', label: 'Drive', icon: <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6" alt="Drive" /> },
                  { id: 'youtube', label: 'YouTube', icon: <Youtube size={22} className="text-red-600" /> },
                  { id: 'create', label: 'Create', icon: <Plus size={28} className="text-blue-600" /> },
                  { id: 'upload', label: 'Upload', icon: <Upload size={22} className="text-gray-600" /> },
                  { id: 'link', label: 'Link', icon: <Link size={22} className="text-gray-600" /> }
                ].map((item) => (
                  <div key={item.id} onClick={() => setActiveModal(item.id)} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 shadow-sm transition-all group-active:scale-95">
                      {item.icon}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {resources.length > 0 && (
                <div className="mt-8 border-t pt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Attached Resources</p>
                  {resources.map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm group">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-gray-400" />
                        <span className="truncate max-w-[400px]">{res.value}</span>
                        <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded uppercase font-bold text-gray-500">{res.type}</span>
                      </div>
                      <button onClick={() => setResources(resources.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- SETTINGS SIDEBAR --- */}
        <div className="w-[320px] border-l border-gray-300 bg-white overflow-y-auto p-6 space-y-8 flex flex-col">
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Assign to</label>
            <button className="w-full flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50">
              <div className="flex items-center gap-2 text-[#1a73e8] text-sm font-medium">
                <Users size={18} />
                <span>All students</span>
              </div>
              <ChevronDown size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Points</label>
            <div className="relative">
              <select name="marks" value={formData.marks} onChange={handleChange} className="w-full appearance-none bg-[#f1f3f4] border-b border-gray-500 rounded-t px-4 py-3 text-sm outline-none focus:border-blue-600">
                <option value="100">100</option>
                <option value="50">50</option>
                <option value="Unmarked">Unmarked</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Due</label>
            <div className="relative">
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full appearance-none bg-[#f1f3f4] border-b border-gray-500 rounded-t px-4 py-3 text-sm outline-none focus:border-blue-600" />
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Topic</label>
            <div className="relative">
              <select className="w-full appearance-none bg-[#f1f3f4] border-b border-gray-500 rounded-t px-4 py-3 text-sm outline-none focus:border-blue-600">
                <option>No topic</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="pt-4 border-t">
            <label className="text-[13px] font-medium text-gray-700 block mb-4">Rubric</label>
            <button className="flex items-center gap-2 text-[#1a73e8] border border-gray-300 rounded-full px-5 py-2 text-sm font-medium hover:bg-blue-50">
              <Plus size={18} />
              Rubric
            </button>
          </div>

          <div className="mt-auto pt-6 flex justify-end gap-2 text-gray-400">
            <Info size={20} className="cursor-pointer hover:text-gray-600" />
            <HelpCircle size={20} className="cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomEditAssignment;