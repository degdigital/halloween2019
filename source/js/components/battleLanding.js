import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import CountdownTimer from './countdownTimer.js';
import Battle from './battle.js';
import { joinBattle, abortBattle, getOpponentObject } from '../services';

const BattleLanding = ({battle, players, player}) => {

    useEffect(() => {
        const join = async () => {
            await joinBattle(battle.id, player.id);
        };
        join();
    }, []);

    if (!battle) {
        return <Redirect to={{
            pathname: '/'
        }} />
    }

    const opponent = getOpponentObject(battle, players, player.id);

    if (battle.winner) {
        return (
            <BattleResults battle={battle} player={player} opponent={opponent} />
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
                <div>
                    Battle expires in <CountdownTimer 
                    expiration={battle.battleWaitExpirationTime}
                    onComplete={() => abortBattle({
                        battleId: battle.id,
                        initiatorId: battle.initiator,
                        opponent
                    })} 
                /> seconds</div>
            ) : null}
        </>
    );

};

export default BattleLanding;