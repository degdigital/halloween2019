import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ expiration = 0, onComplete = null }) => {

    const timeRemaining = Math.ceil((expiration - Date.now()) / 1000);
    const [seconds, setSeconds] = useState(timeRemaining > 0 ? timeRemaining : 0);
    const [isActive, setIsActive] = useState(true);

    function reset() {
        setSeconds(0);
        setIsActive(false);
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            const now = Date.now();
            if (now >= expiration) {
                onComplete();
            } else {
                interval = setInterval(() => {
                    const now = Date.now();
                    if (now >= expiration) {
                        reset();
                        clearInterval(interval);
                        onComplete();
                    } else {
                        setSeconds(seconds => seconds - 1);
                    }
                }, 1000);
            }
        } else if (!isActive && seconds <= 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    return (
        <span>
            {seconds}
        </span>
    );
    
};

export default CountdownTimer;