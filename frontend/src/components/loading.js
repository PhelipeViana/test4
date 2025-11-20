import React from "react";

export default function Loading({ message = "Loading...", color = "primary" }) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-5 vh-30">

            <div
                className={`spinner-border text-${color} mb-0`}
                role="status"
                style={{ width: "3rem", height: "3rem" }}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fs-5">{message}</p>
        </div>
    );
}
