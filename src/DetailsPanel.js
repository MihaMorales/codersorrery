import React,{ useState } from 'react';
import './details-panel.css';

const DetailsPanel = ({ body, setSelectedBody }) => {
        // Declare state variable and update method
        const [isClosing, setIsClosing] = useState(false);

        // Method to handle close button click
        const handleCloseClick = () => {
            handleSetIsClosing(true);
            setTimeout(() => {
                closeDetailsPanel();
            }, 300);
        };
    
        // Method to update isClosing state
        const handleSetIsClosing = (value) => {
            setIsClosing(value);
        };
    
        // Method to close the details panel
        const closeDetailsPanel = () => {
            setSelectedBody(null);
        };
    

    if (!body) {
        return null; // No body selected, don't render anything
    }

    return (
        <div id="details-panel" className={isClosing ? 'closing' : ''}>
            {/* Close Button */}
            <div className="details-close" onClick={handleCloseClick}></div>

            {/* Title and Subtitle */}
            <h1>{body.name}</h1>
            <div className="category">{body.category || 'Planet'}</div>

            {/* Image */}
            <div className='image-container'>
            <img src={body.image} alt={`${body.name}`} style={{ width: '100%', marginTop: '1em' }} />
            </div>
            {/* Description */}
            <p className="description">
                {body.description || `Details about ${body.name} are currently unavailable.`}
            </p>

            {/* Highlighted Data */}
            <p className="infolike">Diameter</p>
            <div className="highlight">{body.diameter} km</div>
            

            {/* Quick Facts */}
            <div className="quickfacts">
                <div className="data">
                    <strong>Mass:</strong> {body.mass} x 10<sup>24</sup> kg
                </div>
                <div className="data">
                    <strong>Rotation Period:</strong> {body.rotationPeriod} hours
                </div>
                <div className="data">
                    <strong>Axial Tilt:</strong> {body.tilt} degrees
                </div>
                <div className="data">
                    <strong>Length of Year:</strong> {body.lengthOfYear ? `${body.lengthOfYear} ${body.dayyear}` : 'N/A'}
                </div>
            </div>

            {/* Read More Button */}
            <div className="button">Read More →</div>

            {/* Footer */}
            <div className="footer">
                Powered by Your Solar System Data
            </div>
        </div>
    );
};

export default DetailsPanel;
