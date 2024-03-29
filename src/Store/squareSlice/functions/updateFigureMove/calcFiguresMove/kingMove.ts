import { contentInter, figureMoveProps, kingCanBeatedProps, squareContentInter } from "../../../Types/stateInterface.ts";
import isKingCanBeated from "../../isKingCanBeated.ts";
import { addFigureMove } from "../../toolFunction/addFigureMove.ts";
import { posToId } from "../../toolFunction/id_posFunctions.ts";
import { figuresName } from "../../../Types/constFigureNames.ts";

export const kingMove = ({ state, choosedFigure, id, contents }: figureMoveProps) => {
    const startX: number = choosedFigure.pos.x;
    const startY: number = choosedFigure.pos.y;
    for (let xCof = -1; xCof <= 1; ++xCof) {
        for (let yCof = -1; yCof <= 1; ++yCof) {
            const xCounter: number = startX + xCof;
            const yCounter: number = startY + yCof;
            if (xCounter > 0 && xCounter < 9 && yCounter > 0 && yCounter < 9) {
                const potentialSquareId: number = posToId(xCounter, yCounter);
                const square: squareContentInter = contents[potentialSquareId];
                if (square?.side !== choosedFigure.side) {
                    addFigureMove(state, id, { changedKingSide: choosedFigure.side, canMoveTo: potentialSquareId, kingMove: true, figure: figuresName.king })
                }
            }
        }
    }
    //#castingTest
    const isKingMove: boolean =
        state.castlingCondition[String(choosedFigure.side)].isKingMove;
    const isKingInDanger: boolean = isKingCanBeated({
        tableContent: state.content,
        kingSide: choosedFigure.side,
        kingPos: choosedFigure.pos
    })
    
    if (!isKingMove && !isKingInDanger) {
        const isRightRookMove: boolean =
            state.castlingCondition[String(choosedFigure.side)].isRightRookMove;
        const isLeftRookMove: boolean =
            state.castlingCondition[String(choosedFigure.side)].isLeftRookMove;

        if (!isRightRookMove) {
            let isSquaresBetweenKingRookEmpty: boolean = true;
            for (let xCounter: number = 6; xCounter < 8; ++xCounter) {
                const potentialSquareId: number = posToId(xCounter, startY);
                const potentialSquare: squareContentInter = contents[potentialSquareId]
                const isSquareEmpty: boolean = potentialSquare?.side === undefined;
                if (!isSquareEmpty) {
                    isSquaresBetweenKingRookEmpty = false
                    break
                }
            }
            if (isSquaresBetweenKingRookEmpty) {
                const isKingCanBeatedProps: kingCanBeatedProps = {
                    tableContent: buildAlternativeContents({ tableContent: { ...contents }, kingId: id, kingGo: id + 1 }),
                    kingPos: {
                        x: choosedFigure.pos.x + 1,
                        y: choosedFigure.pos.y
                    },
                    kingSide: choosedFigure.side
                }
                const isKingBeAttacekWhileMove: boolean = isKingCanBeated(isKingCanBeatedProps)
                debugger
                if (!isKingBeAttacekWhileMove) {
                    const kingCastingSquareId: number = posToId(choosedFigure.pos.x + 2, choosedFigure.pos.y);
                    const rightRookId: number = posToId(8, choosedFigure.pos.y);
                    const rightRookGoTo: number = posToId(6, choosedFigure.pos.y)
                    addFigureMove(state, id,
                        {
                            changedKingSide: choosedFigure.side, canMoveTo: kingCastingSquareId, figure: figuresName.king,
                            kingMove: true, alsoMoveTo: { from: rightRookId, to: rightRookGoTo }
                        })
                }
            }
        }
        if (!isLeftRookMove) {
            let isSquaresBetweenKingRookEmpty: boolean = true;
            for (let xCounter: number = 2; xCounter < 5; ++xCounter) {
                const potentialSquareId: number = posToId(xCounter, startY);
                const potentialSquare: squareContentInter = contents[potentialSquareId]
                const isSquareEmpty: boolean = potentialSquare?.side === undefined;
                if (!isSquareEmpty) {
                    isSquaresBetweenKingRookEmpty = false
                    break
                }
            }
            if (isSquaresBetweenKingRookEmpty) {
                const isKingCanBeatedProps: kingCanBeatedProps = {
                    tableContent: buildAlternativeContents({ tableContent: { ...contents }, kingId: id, kingGo: id - 1 }),
                    kingPos: {
                        x: choosedFigure.pos.x - 1,
                        y: choosedFigure.pos.y
                    },
                    kingSide: choosedFigure.side
                }
                const isKingBeAttacekWhileMove: boolean = isKingCanBeated(isKingCanBeatedProps);
                const leftRookId: number = posToId(1, choosedFigure.pos.y);
                if (!isKingBeAttacekWhileMove) {
                    const kingCastingSquareId: number = posToId(choosedFigure.pos.x - 2, choosedFigure.pos.y);
                    const leftRookGoTo: number = posToId(4, choosedFigure.pos.y)
                    addFigureMove(state, id,
                        {
                            changedKingSide: choosedFigure.side, canMoveTo: kingCastingSquareId, figure: figuresName.king,
                            kingMove: true, alsoMoveTo: { from: leftRookId, to: leftRookGoTo }
                        })
                }
            }
        }
    }
}

const buildAlternativeContents = (
    { tableContent,
        kingId,
        kingGo }: {
            tableContent: contentInter,
            kingId: number,
            kingGo: number
        }): contentInter => {
    tableContent[kingGo] = tableContent[kingId]
    tableContent[kingId] = {}
    return (tableContent)
}