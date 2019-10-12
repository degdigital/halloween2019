import React from 'react';

const TeamStandings = ({players}) => {

    const survivorCount = players.filter(player => player.team === 'survivor').length;
    const zombieCount = players.filter(player => player.team === 'zombie').length;

    return (
        <div>
            <h1>Team Standings</h1>
            Survivors: {survivorCount}<br />
            Zombies: {zombieCount}<br /><br />
        </div>
    );

};

export default TeamStandings;