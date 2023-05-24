import * as React from "react";
import * as _ from "underscore";
import winningPathLength from "./util/winningPathLength";
import BracketGame from "./BracketGame";

const Side = {
  HOME: "home",
  VISITOR: "visitor",
};

const verifyNodes = (sourceGame) => {
  if (sourceGame) {
    if (
      !sourceGame.sides?.home?.seed?.sourceGame ||
      !sourceGame.sides?.visitor?.seed?.sourceGame
    ) {
      return false;
    }
  }
  return true;
};

/***
 *
 * Calcula a altura de uma partida considerando seus filhos
 *
 * @type {Object} game
 * @type {Number} gameHeight
 * @return {Number} size
 */
const handleAmountLevels = (sourceGame, gameHeight) => {
  let size = 0;

  if (sourceGame) {
    if (
      !sourceGame.sides?.home?.seed?.sourceGame ||
      !sourceGame.sides?.visitor?.seed?.sourceGame
    ) {
      return 0;
    }
  }

  const amountLevels = (newSourceGame) => {
    if (!newSourceGame) return 0;

    amountLevels(newSourceGame.sides?.home?.seed?.sourceGame);
    amountLevels(newSourceGame.sides?.visitor?.seed?.sourceGame);

    size += gameHeight;
  };

  amountLevels(sourceGame);

  return size;
};

const toBracketGames = ({
  GameComponent,
  game,
  x,
  y,
  gameDimensions,
  roundSeparatorWidth,
  round,
  lineInfo,
  homeOnTop,
  ...rest
}) => {
  const { width: gameWidth, height: gameHeight } = gameDimensions;

  const ySep = handleAmountLevels(game, 20);

  return [
    <g key={`${game.id}-${y}`}>
      <GameComponent
        {...rest}
        {...gameDimensions}
        key={game.id}
        homeOnTop={homeOnTop}
        game={game}
        x={x}
        y={y}
      />
    </g>,
  ].concat(
    _.chain(game.sides)
      .map((sideInfo, side) => ({ ...sideInfo, side }))
      // filter to the teams that come from winning other games
      .filter(({ seed }) => seed && seed.sourceGame !== null && seed.rank === 1)
      .map(({ seed: { sourceGame }, side }) => {
        // we put visitor teams on the bottom
        const isTop = side === Side.HOME ? homeOnTop : !homeOnTop;
        const multiplier = isTop ? -1 : 1;
        const ySep2 = handleAmountLevels(sourceGame, gameHeight / 4);

        const pathInfo = [
          `M${x - lineInfo.separation} ${
            y +
            gameHeight / 2 +
            lineInfo.yOffset +
            multiplier * lineInfo.homeVisitorSpread +
            (!verifyNodes(game) ? 5 - lineInfo.yOffset : 0)
          }`,
          `H${x - roundSeparatorWidth / 2}`,
          `V${y + ySep * multiplier + gameHeight / 2 + lineInfo.yOffset}`,
          `H${x - roundSeparatorWidth + lineInfo.separation}`,
        ];

        return [
          <path
            key={`${game.id}-${side}-${y}-path`}
            d={pathInfo.join(" ")}
            fill="transparent"
            stroke="black"
            className={`${game.id}-${side}-${y}-path`}
          />,
        ].concat(
          toBracketGames({
            GameComponent,
            game: sourceGame,
            homeOnTop,
            lineInfo,
            gameDimensions,
            roundSeparatorWidth,
            x: x - gameWidth - roundSeparatorWidth,
            y: y + ySep * multiplier,
            round: round - 1,
            ...rest,
          })
        );
      })
      .flatten(true)
      .value()
  );
};

const Bracket = ({
  GameComponent = BracketGame,
  homeOnTop = true,
  gameDimensions = {
    height: 80,
    width: 200,
  },
  svgPadding = 20,
  roundSeparatorWidth = 24,
  lineInfo = {
    yOffset: -6,
    separation: 6,
    homeVisitorSpread: 11,
  },
  game,
  ...rest
}) => {
  const numRounds = winningPathLength(game);

  const svgDimensions = {
    height: handleAmountLevels(game, gameDimensions.height),
    width:
      numRounds * (gameDimensions.width + roundSeparatorWidth) + svgPadding * 2,
  };

  return (
    <svg {...svgDimensions}>
      <g>
        {toBracketGames({
          GameComponent,
          gameDimensions,
          roundSeparatorWidth,
          game,
          round: numRounds,
          homeOnTop,
          lineInfo,
          // svgPadding away from the right
          x: svgDimensions.width - svgPadding - gameDimensions.width,
          // vertically centered first game
          y:
            handleAmountLevels(game.sides?.home?.seed?.sourceGame, 20) +
            handleAmountLevels(game, 20),
          ...rest,
        })}
      </g>
    </svg>
  );
};

export default Bracket;
