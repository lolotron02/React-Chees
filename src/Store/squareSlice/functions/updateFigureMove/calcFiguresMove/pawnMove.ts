import { figuresName } from "../../../Types/constFigureNames.ts";
import { figureMoveProps, pos, squareContentInter } from "../../../Types/stateInterface.ts";
import { addFigureMove } from "../../toolFunction/addFigureMove.ts";
import { posToId } from "../../toolFunction/id_posFunctions.ts";

const sides = { white: true, black: false };

export const pawnMove = ({ state, choosedFigure, id, contents }: figureMoveProps): void => {
    //переменая для коректировки напраления движения пешки в зависимости от его стороны 
    const pawnDirection: number = choosedFigure.side === sides.black ? 1 : -1;
    // #region verifyMoveDirectly
    const nextSquareId: number = posToId(choosedFigure.pos.x, choosedFigure.pos.y + 1 * pawnDirection);
    const isNextSquareEmpty: boolean = contents[nextSquareId]?.side === undefined;
    if (isNextSquareEmpty) {
        addFigureMove(state, id, { canMoveTo: nextSquareId });
        const isThisPawnFirstMove: boolean =
            (choosedFigure.pos.y === 2 && choosedFigure.side === sides.black) ||
            (choosedFigure.pos.y === 7 && choosedFigure.side === sides.white)
        if (isThisPawnFirstMove) {
            const afterNextSquareId: number = posToId(choosedFigure.pos.x, choosedFigure.pos.y + (2 * pawnDirection));
            const isAfterNextSquareEmpty: boolean = contents[afterNextSquareId]?.side === undefined;
            if (isAfterNextSquareEmpty) {
                addFigureMove(state, id, { canMoveTo: afterNextSquareId })
            }
        }
    }
    // #endregion
    // #region verifyDioganalBeating
    if (choosedFigure.pos.x + 1 > 0 && choosedFigure.pos.x + 1 < 9) {
        const leftDioganalSquareId: number = posToId(choosedFigure.pos.x + 1, choosedFigure.pos.y + 1 * pawnDirection);
        const isLeftDiognalaSquareEnemy: boolean = contents[leftDioganalSquareId]?.side === !choosedFigure.side;
        if (isLeftDiognalaSquareEnemy)
            addFigureMove(state, id, { canMoveTo: leftDioganalSquareId });
    }

    if (choosedFigure.pos.x - 1 > 0 && choosedFigure.pos.x - 1 < 9) {
        const rightDioganalSquareId: number = posToId(choosedFigure.pos.x - 1, choosedFigure.pos.y + 1 * pawnDirection);
        const isRightDiognalaSquareEnemy: boolean = contents[rightDioganalSquareId]?.side === !choosedFigure.side;
        if (isRightDiognalaSquareEnemy)
            addFigureMove(state, id, { canMoveTo: rightDioganalSquareId });
    }
    // #endregion
    // #region verifySpecialBeat
    const leftSquarePos: pos = { x: choosedFigure.pos.x - 1, y: choosedFigure.pos.y };
    const rightSquarePos: pos = { x: choosedFigure.pos.x + 1, y: choosedFigure.pos.y };
    const leftSquareId: number = posToId(leftSquarePos.x, leftSquarePos.y);
    const rightSquareId: number = posToId(rightSquarePos.x, rightSquarePos.y);
    const leftSquare: squareContentInter = contents[leftSquareId];
    const rightSquare: squareContentInter = contents[rightSquareId];

    const isInLeftSquareEnemyPawn: boolean =
        leftSquare?.type === figuresName.pawn &&
        leftSquare?.side === !choosedFigure.side;
    const isInRightSquareEnemyPawn: boolean =
        rightSquare?.type === figuresName.pawn &&
        rightSquare?.side === !choosedFigure.side;

    if (isInLeftSquareEnemyPawn || isInRightSquareEnemyPawn) {
        let pawnPos: pos, pawnId: any;
        if (isInLeftSquareEnemyPawn) {
            pawnPos = leftSquarePos;
            pawnId = leftSquareId;
        } else {
            pawnPos = rightSquarePos;
            pawnId = rightSquareId;
        }

        const prevMove: object = state.moveHistory[state.moveHistory.length - 2];
        const pawnStartPosId: number = posToId(pawnPos.x, pawnPos.y + 2 * pawnDirection);
        const wasPawnInStart: boolean = prevMove[pawnStartPosId]?.type === figuresName.pawn;
        if (wasPawnInStart) {
            const DioganalSquareId: number = posToId(pawnPos.x, pawnPos.y + 1 * pawnDirection);
            addFigureMove(state, id, { deleteFrom: pawnId, canMoveTo: DioganalSquareId });
        }
    }
    //#endregion
}