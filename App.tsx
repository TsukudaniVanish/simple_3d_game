import {react, React, dodgeBoxesConfig as gameConfig} from './deps.ts';
import { Game as DodgeBoxes } from './src/Game.tsx';
import {Game as Explorer} from './src/Explorer.tsx';

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
        <DodgeBoxes></DodgeBoxes>
      </>
    );
  case GameSelect.Explorer:
    return (
      <Explorer/>
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
