import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center p-4">

            <h1 className="display-1 fw-bold text-danger mb-3">404</h1>

            <h2 className="mb-3">Page not found</h2>

            <p className="lead text-muted mb-4">
                The page you are trying to access does not exist or has been moved.
            </p>

            <Link to="/" className="btn btn-primary btn-lg">
                Back to Home
            </Link>
        </div>
    );
}
