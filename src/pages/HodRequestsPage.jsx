import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

const cardDat = [
    {
        id: 1,
        facultyName: "Nishanth A",
        subjectName: "Python",
        year: "1st year",
        sectionName: "A",
        hour: "1st hour",

    },
    {
        id: 2,
        facultyName: "Nishanth A",
        subjectName: "Python",
        year: "2nd year",
        sectionName: "B",
        hour: "2nd hour",

    },
    {
        id: 3,
        facultyName: "Rajesh",
        subjectName: "Java",
        year: "3rd year",
        sectionName: "C",
        hour: "3rd hour",

    }
]

const HodRequestsPage = () => {
  
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%] px-4 py-4 ">
                    <div className="card-container grid grid-cols-2 md:grid-cols-3 gap-2">
                        {cardDat.map((card) => (
                            <Link to={`/dashboard/hodRequests/requests/${card.id}`}>
                                <div key={card.id} className="card border border-[#D9D9D9] w-full p-4 rounded-lg shadow-lg">
                                    <div className="card-header">
                                        <h2>{card.facultyName}</h2>
                                        <p>{card.subjectName}</p>
                                    </div>
                                    <div className="card-body">
                                        <p>{card.year}</p>
                                        <p>Section : {card.sectionName}</p>
                                        <p>{card.hour}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}

export default HodRequestsPage