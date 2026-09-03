import React from "react";
import "./RegistrationForm.css";
function RegistrationForm() {


    return (
        <div className="registration-container">
            <h1>Diagno Care</h1>
            <h2>Patient Registration Form:</h2>

            <div className="registration-form">

                <div className="form-row">
                    <label htmlFor="txtID">Patient ID:</label>
                    <input id="txtID" type="text" />
                </div>

                <div className="form-row">
                    <label htmlFor="txtName">Full Name:</label>
                    <input id="txtName" type="text" />
                </div>

                <div className="form-row">
                    <label htmlFor="txtAge">Age:</label>
                    <input id="txtAge" type="number" />
                </div>

                <div className="form-row">
                    <label htmlFor="txtMobile">Mobile Number:</label>
                    <input id="txtMobile" type="text" />
                </div>

                <div className="form-row">
                    <label htmlFor="ddlGender">Gender:</label>
                    <select id="ddlGender">
                        <option>-Select Gender-</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                <button type="submit">Submit</button>

            </div>
        </div>
    );
}

export default RegistrationForm;
