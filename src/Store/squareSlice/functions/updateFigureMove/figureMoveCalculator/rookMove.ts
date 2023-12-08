import { figureMoveProps, moveInfo, squareContentInter } from "../../../Types/stateInterface.ts";
import { addFigureMove } from "../../toolFunction/addFigureMove.ts";
import { posToId } from "../../toolFunction/id_posFunctions.ts";

export const rookMove = ({ state, choosedFigure, id, contents }: figureMoveProps): void => {
    const startX: number = choosedFigure.pos.x;
    const startY: number = choosedFigure.pos.y;
    for (let corOrder = -1; corOrder <= 1; corOrder += 2) {
        for (let yxDrt = -1; yxDrt <= 1; yxDrt += 2) {
            let xCounter: number = startX;
            let yCounter: number = startY;
            while ((xCounter > 0 && xCounter < 9) && (yCounter > 0 && yCounter < 9)) {
                xCounter += ((1 + corOrder) / 2) * yxDrt;
                yCounter += ((-1 + corOrder) / -2) * yxDrt;
                const testSquareId: number | string = posToId(xCounter, yCounter);
                const square: squareContentInter = contents[testSquareId];

                const isSquareEmpty: boolean = square?.side === undefined;
                const moveInfoProps: moveInfo = {
                    canMoveTo: testSquareId,
                }

                if (state.figureTurn) {
                    if (startY === 8) {
                        if (startX === 1) {
                            moveInfoProps.leftRookMove = true
                        } else if (startX === 8) {
                            moveInfoProps.rightRookMove = true
                        }
                    }
                } else {
                    if (startY === 1) {
                        if (startX === 1) {
                            moveInfoProps.leftRookMove = true
                        } else if (startX === 8) {
                            moveInfoProps.rightRookMove = true
                        }
                    }
                }

                if (isSquareEmpty) {
                    addFigureMove(state, id, moveInfoProps)
                    continue
                }

                const isInSquareEnemyFigure: boolean = square.side === !choosedFigure.side;
                if (isInSquareEnemyFigure) {
                    addFigureMove(state, id, moveInfoProps)
                }
                break
            }
        }
    }
}