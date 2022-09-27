import {react, React, gameConfig} from './deps.ts';
import { Game } from './src/Game.tsx';

enum GameSelect {
  None,
  DodgeBoxes,
  Explorer,
}

function App() {
  const [game, setGame] = react.useState(GameSelect.None)

  switch(game) {
  case GameSelect.DodgeBoxes:
    return (
      <>
        <Game></Game>
      </>
    );
  case GameSelect.Explorer:
    return (
      <></>
    );
  default:
    return (
      <>
        <div style={{height:gameConfig.display_hight, width: gameConfig.display_width, textAlign: 'center'}}>
          <p>Choose a game!</p>
          <button onClick={() => setGame(GameSelect.DodgeBoxes)}>DodgeBoxes!</button>
          <br></br>
          <button onClick={() => setGame(GameSelect.Explorer)}>Explorer</button>
        </div>
      </>
    );
  }
}

export default App;
