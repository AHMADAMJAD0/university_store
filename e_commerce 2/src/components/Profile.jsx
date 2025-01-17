import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import OrderHistory from "./OrdersHistory";
import Navbar from "./Navbar";
import "../styles/profile.css";
import Footer from "./Footer";
import EditProfilePage from "../pages/EditProfilePage";
import AOS from "aos";
import "aos/dist/aos.css";

const Profile = ({ loggedInUser, setLoggedInUser }) => {
    const { email } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState(loggedInUser || {});
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setUpdatedUser(storedUser);
            setLoggedInUser(storedUser);
        }
    }, []);

    useEffect(() => {
        setUpdatedUser(loggedInUser);
    }, [loggedInUser]);

    // Initialize AOS
    // useEffect(() => {
    //     AOS.init({ duration: 1200, once: true });
    // }, []);
    useEffect(() => {
        AOS.init({
            duration: 1200, // Animation duration in milliseconds
            once: false,    // Ensures animations repeat on scrolling up and down
            mirror: true,   // Trigger animations on scrolling past elements (both up and down)
        });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [updatedUser]); // Trigger refresh whenever `updatedUser` changes

    const calculateProfileCompletion = () => {
        if (!updatedUser) return 0;

        const fieldsToCount = [
            "name",
            "email",
            "password",
            "address1",
            "city",
            "country",
            "phone",
            "zipCode",
            "billingName",
            "billingCardNumber",
            "billingExpiration",
            "billingCVC",
            "universityName",
            "billingAddress",
        ];

        const totalFields = fieldsToCount.length;
        let filledFields = 0;

        fieldsToCount.forEach((field) => {
            if (updatedUser[field]) filledFields++;
        });

        return (filledFields / totalFields) * 100;
    };

    const profileCompletion = calculateProfileCompletion();

    const handleUserUpdate = (newUserData) => {
        const updatedData = { ...newUserData, orders: updatedUser.orders || [] };
        setUpdatedUser(updatedData);
        setLoggedInUser(updatedData);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedData));
        setIsEditing(false);
    };

    return (
        <div className="bg-gradient-to-br from-gray-100 to-blue-50 relative">
            <Navbar loggedInUser={loggedInUser} />
            <div className="flex justify-center items-start p-6">
                <div className="flex w-full max-w-7xl p-6 gap-14">
                    <div
                        className="flex flex-col w-2/3 gap-9"
                        data-aos="fade-right"
                    >
                        <div className="shadow-xl rounded-lg bg-white p-6 transition-transform transform hover:scale-105">
                            <h2
                                className="text-2xl font-semibold text-center mb-4"style={{color:"rgb(146, 73, 146)"}}
                                data-aos="zoom-in"
                            >
                                <i className="fas fa-user-circle mr-2"></i>User
                                Profile
                            </h2>
                            <div className="space-y-4 text-gray-700 ml-24 text-center my-6 mt-10" data-aos="fade-up">
    <div className="user-ingo-div">
        <p className="user-info-p-tag">
            <i className="fas fa-user mr-2 "style={{color:"#313869"}}></i>
            Name: {updatedUser?.name || "N/A"}
        </p>
        <p className="user-info-p-tag">
            <i className="fas fa-envelope mr-2"style={{color:"#313869"}}></i>
            Email: {updatedUser?.email || "N/A"}
        </p>
    </div>
    <div className="user-ingo-div">
        <p className="user-info-p-tag">
            <i className="fas fa-phone-alt mr-2 "style={{color:"#313869"}}></i>
            Phone: {updatedUser?.phone || "N/A"}
        </p>
        <p className="user-info-p-tag">
            <i className="fas fa-map-marker-alt mr-2 "style={{color:"#313869"}}></i>
            Address: {updatedUser?.address1 || "N/A"}
        </p>
    </div>
    <div className="user-ingo-div">
        <p className="user-info-p-tag">
            <i className="fas fa-university mr-2 "style={{color:"#313869"}}></i>
            University: {updatedUser?.universityName || "N/A"}
        </p>
        <p className="user-info-p-tag">
            <i className="fas fa-globe mr-2 "style={{color:"#313869"}}></i>
            Country: {updatedUser?.country || "N/A"}
        </p>
    </div>
</div>

                        </div>

                        <div
                            className="shadow-xl rounded-lg bg-white p-6 transition-transform transform hover:scale-105"
                            data-aos="fade-left"
                        >
                            <h2 className="text-2xl font-semibold text-center mb-4"style={{color:"rgb(146, 73, 146)"}}>
                                <i className="fas fa-history mr-2"></i>Order
                                History
                            </h2>
                            <OrderHistory
                                orders={updatedUser?.orders || []}
                                user={updatedUser}
                            />
                        </div>
                    </div>

                    <div
                        className="profile_bar flex flex-col w-1/3 bg-white shadow-xl rounded-lg p-6"
                        data-aos="fade-up"
                    >
                        <div className="text-center">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/edit-profile/${updatedUser.email}`
                                    )
                                }
                                className="edit-btn mb-4 px-10 py-2  text-white rounded-lg  "
                                data-aos="flip-left"
                            >
                                <i className="fas fa-edit mr-2"></i>Edit Profile
                            </button>
                        </div>
                        <div
                            className="flex flex-col items-center mb-6"
                            data-aos="zoom-in"
                        >
                            <div className="relative">
                                <svg className="w-24 h-24">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        stroke="#e0e0e0"
                                        strokeWidth="10"
                                        fill="none"
                                    />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        stroke="#4CAF50"
                                        strokeWidth="10"
                                        fill="none"
                                        strokeDasharray={`${profileCompletion *
                                            2.83} ${282.6}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex justify-center items-center text-xl font-semibold">
                                    {Math.round(profileCompletion)}%
                                </div>
                            </div>
                            <p className=" mt-2 text-gray-600">
                                Profile Completion
                            </p>
                        </div>
                        <div className="text-center">
                            <Link to="/complete-profile">
                                <button
                                    className={`profile-button ${profileCompletion === 100 ? "disabled" : "active"} `}
                                    disabled={profileCompletion === 100}
                                    data-aos="fade-up"
                                >
                                    <i className="fas fa-tasks mr-2"></i>Complete
                                    Profile
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <EditProfilePage
                            user={updatedUser}
                            handleUserUpdate={handleUserUpdate}
                            setIsEditing={setIsEditing}
                        />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Profile;
