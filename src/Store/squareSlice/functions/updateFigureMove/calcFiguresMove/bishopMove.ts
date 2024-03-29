import { squareContentInter } from './../../../Types/stateInterface';
import { addFigureMove } from "../../toolFunction/addFigureMove.ts";
import { posToId } from "../../toolFunction/id_posFunctions.ts";
import { figureMoveProps } from "../../../Types/stateInterface.ts";
import { figuresName } from '../../../Types/constFigureNames.ts';

export const bishopMove = ({ state, choosedFigure, id, contents }: figureMoveProps): void => {
    const startX: number = choosedFigure.pos.x;
    const startY: number = choosedFigure.pos.y;
    for (let xDrt = -1; xDrt <= 1; xDrt += 2) {
        for (let yDrt = -1; yDrt <= 1; yDrt += 2) {
            let xCounter: number = startX + xDrt;
            let yCounter: number = startY + yDrt;
            while ((xCounter > 0 && xCounter < 9) && (yCounter > 0 && yCounter < 9)) {
                const testSquareId: number = posToId(xCounter, yCounter);
                xCounter += xDrt;
                yCounter += yDrt;
                const square: squareContentInter = contents[testSquareId];
                const isSquareEmpty: boolean = square?.side === undefined;
                if (isSquareEmpty) {
                    addFigureMove(state, id, { canMoveTo: testSquareId, figure: figuresName.bishop });
                    continue
                }

                const isInSquareEnemyFigure: boolean = square.side === !choosedFigure.side;
                if (isInSquareEnemyFigure) {
                    addFigureMove(state, id, { canMoveTo: testSquareId, figure: figuresName.bishop })
                }
                break
            }
        }
    }
}