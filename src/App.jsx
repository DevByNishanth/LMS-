import React from "react";
import TitanicPie from "./components/TitanicPie";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import FacultyManagementPage from "./pages/FacultyManagementPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SemesterRegistrationPage from "./pages/SemesterRegistrationPage";
import AddSubjectPage from "./pages/AddSubjectPage";
import HodSubjectmanagementpage from "./pages/HodSubjectmanagementpage";
import ProtectedRoute from "./components/ProtectedRoute";
import TestingComponent from "./components/TestingComponent";
import StudentManagement from "./pages/StudentManagement";
import SectionManagementPage from "./pages/SectionManagementPage";
import SubjectPlanningPage from "./pages/SubjectPlanningPage";
import AddSubjectContentPage from "./pages/AddSubjectContentPage";
import ClassRoomPage from "./pages/ClassRoomPage";
import Classpage from "./pages/Classpage";
import StudentAttendancePage from "./pages/StudentAttendancePage";
import AttendanceTraqckingPage from "./pages/AttendanceTraqckingPage";
import AdminSemesterRegPage from "./pages/AdminSemesterRegPage";
import AdminSemesterRegistrationOverviewPage from "./pages/AdminSemesterRegistrationOverviewPage";
import TimeTableManagementPage from "./pages/TimeTableManagementPage";
import StudentLayout from "./components/Student_Layout";
import StudentDashboard from "./pages/StudentDashboard";
import StudentClassroomDetails from "./components/Student_ClassroomDetails";
import StudentClassroom from "./pages/Student_Classroom";
import DashboardStudentClassroom from "./pages/DashboardStudentClassroom";
import DashboardStudentClassroomDetails from "./pages/DashboardStudentClassroomDetails";
import InvitationPage from "./pages/InvitationPage";
import { ToastContainer } from "react-toastify";
import CalendarPage from "./pages/CalendarPage";
import HodRequestsPage from "./pages/HodRequestsPage";
import HodRequestsDetails from "./pages/HodRequestsDetails";
import HodRequestHistory from "./pages/HodRequestHistory";
import ClassroomSubmissionPage from "./components/ClassroomSubmissionPage";
import ClassroomEditAssignment from "./components/ClassroomEditAssignment";
import DashboardRoute from "./components/DashboardRoute";
import StudentAttendancePageCalendar from "./pages/StudentAttendancePageCalendar";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/facultyManagement"
          element={
            <ProtectedRoute>
              <FacultyManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/semesterRegistration"
          element={
            <ProtectedRoute>
              <SemesterRegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/semesterRegistration/addSubject"
          element={
            <ProtectedRoute>
              <AddSubjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hod_subjectmanagement"
          element={
            <ProtectedRoute>
              <HodSubjectmanagementpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/subjectManagement"
          element={
            <ProtectedRoute>
              <HodSubjectmanagementpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/studentManagement"
          element={
            <ProtectedRoute>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sectionManagement"
          element={
            <ProtectedRoute>
              <SectionManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/subjectPlanning"
          element={
            <ProtectedRoute>
              <SubjectPlanningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/subjectPlanning/:subjectCode"
          element={
            <ProtectedRoute>
              <AddSubjectContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sudentAttendance/:subjectCode"
          element={
            <ProtectedRoute>
              <AttendanceTraqckingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/sudentAttendance"
          element={
            <ProtectedRoute>
              <StudentAttendancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/adminSemReg"
          element={
            <ProtectedRoute>
              <AdminSemesterRegistrationOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/adminSemReg/view"
          element={
            <ProtectedRoute>
              <AdminSemesterRegPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/timetableManagement"
          element={
            <ProtectedRoute>
              <TimeTableManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/hodRequests"
          element={
            <ProtectedRoute>
              <HodRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hodRequests/requests/:id"
          element={
            <ProtectedRoute>
              <HodRequestsDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hodRequests/history"
          element={
            <ProtectedRoute>
              <HodRequestHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/calendar" element={<CalendarPage />} />
        <Route path="/dashboard/classroom" element={<ClassRoomPage />} />
        <Route
          path="/dashboard/StudentClassroom"
          element={
            <ProtectedRoute>
              <DashboardStudentClassroom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/StudentClassroom/class/:classId/:sectionId"
          element={
            <ProtectedRoute>
              <DashboardStudentClassroomDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/classroom/class/:classId/:sectionId"
          element={<Classpage />}
        />
        <Route
          path="/dashboard/classroom/submission/:courseId/:assignmentId/:userId"
          element={<ClassroomSubmissionPage />}
        />
        <Route
          path="/dashboard/classroom/edit-assignment/:assignmentId"
          element={<ClassroomEditAssignment />}
        />
        <Route path="/classroom/invite" element={<InvitationPage />} />

        <Route path="/invitation/verify" element={<InvitationPage />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />

          <Route path="classroom">
            <Route index element={<StudentClassroom />} />
            <Route path=":id" element={<StudentClassroomDetails />} />
          </Route>


        </Route>
        <Route path="/dashboard/studentAttendance" element={<StudentAttendancePageCalendar />} />
      </Routes>
    </>
  );
};

export default App;
