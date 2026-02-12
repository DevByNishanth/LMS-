import DepartmentTabComponent from "../components/DepartmentTabComponent";
import HeaderComponent from "../components/HeaderComponent";
import Sidebar from "../components/Sidebar";

function AdminSemesterRegistrationOverviewPage() {
    return (
        <>
            <section className="w-[100%] h-[100vh] flex">
                <div className="container-1 w-[20%] h-[100%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%]">
                    <HeaderComponent title={"Admin Semester Registration"} />
                    <DepartmentTabComponent basePath="/dashboard/adminSemReg/view" />
                </div>
            </section>
        </>
    );
}

export default AdminSemesterRegistrationOverviewPage;
