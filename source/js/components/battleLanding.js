import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useInterval from '../hooks/useInterval.js';
import Battle from './battle.js';
import BattleResults from './battleResults.js';
import { joinBattle, abortBattle, getOpponentObject } from '../services';

const BattleLanding = ({battle, players, player}) => {

    useEffect(() => {
        const join = async () => {
            await joinBattle(battle.id, player.id);
        };
        join();
    }, []);

    const expirationTime = battle && battle.battleWaitExpirationTime ? battle.battleWaitExpirationTime : 0;
    const remainingTime = Math.ceil((expirationTime - Date.now()) / 1000);
    const [countdown, setCountdown] = useState(remainingTime);

    useInterval(() => {
        if ((battle.initiator === player.id) && countdown > 0) {
            setCountdown(countdown - 1);
        } else {
            abortBattle({
                battleId: battle.id,
                initiatorId: battle.initiator,
                opponent
            })
        }
    }, 1000);

    if (!battle) {
        return <Redirect to={{
            pathname: '/'
        }} />
    }

    const opponent = getOpponentObject(battle, players, player.id);

    if (battle.winner) {
        return (
            <BattleResults battle={battle} player={player} />
        )
    }

    if (battle.joins && Object.keys(battle.joins).length === 2) {
        return (
            <Battle battle={battle} player={player} opponent={opponent} />
        );
    }

    return (
        <>
            <h1>Battle Landing</h1>
            {battle.initiator === player.id ? (
                <div>Battle expires in {countdown} seconds</div>
            ) : null}
        </>
    );

};

export default BattleLanding;