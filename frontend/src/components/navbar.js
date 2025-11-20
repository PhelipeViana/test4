import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light cursor-pointer mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Items</Link>

            </div>
        </nav>
    );
}