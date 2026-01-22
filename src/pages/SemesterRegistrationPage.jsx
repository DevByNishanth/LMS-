import DepartmentTabComponent from "../components/DepartmentTabComponent";
import HeaderComponent from "../components/HeaderComponent";
import SubjectTable from "../components/SemesterRegistrationTable";
import Sidebar from "../components/Sidebar";

function SemesterRegistrationPage() {
  return (
    <>
      <section className="w-[100%] h-[100vh] flex">
        <div className="container-1 w-[20%] h-[100%]">
          <Sidebar />
        </div>
        <div className="container-2 w-[80%] h-[100%]">
          <HeaderComponent title={"Subject Management"} />
          <DepartmentTabComponent />
        </div>
      </section>
    </>
  );
}
export default SemesterRegistrationPage;
