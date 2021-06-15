import React from 'react';

function homeButton() {
    sessionStorage.clear()
    window.location.reload()
}
function aboutButton() {
    sessionStorage.setItem('About', 'active')
    window.location.reload()
}

const Nav = () => (
    <nav>
        <div className="navbar">
            <div className="nav-title-container" onClick={homeButton}>
                <a className="nav-title">KinoGO</a>
                <a className="nav-title-small">movie library</a>
            </div>
            <div className="nav-list">
                <a className="nav-link" onClick={aboutButton}>About</a>
            </div>
        </div>
    </nav>
);

export default Nav;