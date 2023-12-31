import classNames from 'classnames';
import { useActions } from '../../../../../Hooks/useActions/useActions';
import { useSelector } from 'react-redux';

import Figures from './Figures/Figures';


function Square({ id, squareMathColor }) {
  const squareContent = useSelector(state => state.squaresList.content[id]);
  const chessTurn = useSelector(state => state.squaresList.figureTurn);
  const isChoosedFigure = useSelector(state => state.squaresList.choosedFigureId === id);
  const isMoveableSquare = useSelector(state => !!state.squaresList.moveableSquares[id])

  const isThisFigureSideTurn = chessTurn === squareContent?.side;
  const squareColorOrder = squareMathColor === 0 ? "white" : "black";
  const squareSkin = useSelector(state => state.skinManagment.selectedSkin.squares[squareColorOrder]);
  const skinStyles = useSelector(state => state.skinManagment.selectedSkin.squareStyles)
  const emptySquareMoveBalsSkins = useSelector(state => state.skinManagment.selectedSkin.emptySquareMove)
  const { selectFigure, moveFigure } = useActions();

  const isEmptySquare = squareContent?.type === undefined;

  const draggableStates = {
    "draggable": false,
    "onDragOver": (e) => e.preventDefault(),
    "onDrop": (e) => {
      e.preventDefault()
      selectFigure("notChosedFigure")
    }
  };

  if (isThisFigureSideTurn) {
    draggableStates.draggable = true;
    draggableStates.onDragStart = () => selectFigure(id)
  }

  let moveSquareBall = "none";
  let squareClassNames = classNames(
    skinStyles.component,
    squareColorOrder === "white"
      ? skinStyles.whiteSquare
      : skinStyles.blackSquare);

  let squareOnClick = () => selectFigure("notChosedFigure");

  if (isChoosedFigure) {
    squareClassNames += " " + skinStyles.choosedFigure;
  }
  else if (isThisFigureSideTurn) {
    squareOnClick = () => selectFigure(id);
  }
  else if (isMoveableSquare) {
    squareOnClick = () => moveFigure(id);
    draggableStates.onDrop = () => moveFigure(id);
    if (isEmptySquare) {
      squareClassNames += ` ` + skinStyles.moveableSquare
      moveSquareBall = emptySquareMoveBalsSkins[chessTurn]
    }
    else squareClassNames += " " + skinStyles.takeableFigure;
  }

  return (
    <div id={id} className={squareClassNames}
      style={{
        "--backgroundeImg": `url(${squareSkin})`,
        "--moveBall": `url(${moveSquareBall})`
      }}
    >
      <div
        onClick={() => squareOnClick()}
        className={skinStyles.figureContainer}
        {...draggableStates}
      >
        {
          <Figures
            figureSide={squareContent.side}
            figureType={squareContent.type} />
        }
      </div>
    </div>
  )
}

export default Square