import React, { useEffect, useState } from 'react';
import './SportsPage.css'; // Import your CSS file

interface Game {
  id: string;
  league: string;
  teams: string;
  score: string;
  status: string;
  odds: string;
}

const SportsPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // Fetch sports data from an API
    // Placeholder data for demonstration
    setGames([
      {
        id: '1',
        league: 'NFL',
        teams: 'Team A vs Team B',
        score: '21-14',
        status: 'Live',
        odds: 'Team A -110',
      },
      // Add more games as needed
    ]);
  }, []);

  return (
    <section className="sports-page">
      <h2>Sports Scores and Odds</h2>
      <div className="games-list">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <h3>{game.league}</h3>
            <p>{game.teams}</p>
            <p>Score: {game.score}</p>
            <p>Status: {game.status}</p>
            <p>Odds: {game.odds}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SportsPage;
