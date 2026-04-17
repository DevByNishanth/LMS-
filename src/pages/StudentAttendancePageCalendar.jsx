import Sidebar from "../components/Sidebar"



const StudentAttendancePageCalendar = () => {
    return (
        <>
            <section className='flex'>
                <div className='w-[20%]'>
                    <Sidebar />
                </div>
                <div className='w-[80%]'>
                    <h1>Student attencance chart</h1>
                </div>
            </section>
        </>
    )
}

export default StudentAttendancePageCalendar