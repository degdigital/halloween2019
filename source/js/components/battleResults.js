import React, { useState } from 'react';
import useInterval from '../hooks/useInterval.js';
import { endBattleResults } from '../services';
import gameConfig from '../config/gameConfig.js';

const BattleResults = ({battle, player}) => {

    const remainingTime = gameConfig.battleResultsWaitTime - Math.ceil((Date.now() - battle.completionTime) / 1000);
    const [countdown, setCountdown] = useState(remainingTime);

    useInterval(() => {
        if (countdown > 0) {
            setCountdown(countdown - 1);
        } else {
            endBattleResults(battle.id);
        }
    }, 1000);

    const {
        winner
    } = battle;

    const getMessage = () => {
        if (winner === 'tie') {
            return `It's a tie!`;
        }
        if (winner === player.id) {
            return 'You won!';
        }
        return `You LOST!`;
    
    };    
    
    return (
        <div>
            <h1>Battle Results</h1>
            <p>{getMessage()}</p>
            <p>Back to the map in {countdown} seconds&hellip;</p>
        </div>
    );

};

export default BattleResults;