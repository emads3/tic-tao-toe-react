import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
    renderSquare(i) {
        return (
            <button className="square" onClick={() => this.props.handleClick(i)}>
                {this.props.squares[i]}
            </button>
        );
    }

    render() {
        return (
            <div>
                {/*<div className="status">{status}</div>*/}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }

}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) return;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares}]),
            xIsNext: !this.state.xIsNext,
            setNumber: history.length,
        });
    }


    render() {
        console.clear();
        console.table(this.state.history);

        const history = this.state.history;
        const currentGameState = history[this.state.stepNumber];
        const winner = calculateWinner(currentGameState.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Goto move #" + move : "Goto game start"
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = winner === 'D' ? "Draw" : "Winner: " + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        handleClick={(i) => this.handleClick(i)} /*TODO: review*/
                        squares={currentGameState.squares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol start={0}>{moves}</ol>
                </div>
            </div>
        );
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    // TODO: change the color of the winning squares..
    let areAllCellsFull = true;
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            areAllCellsFull = false;
            break;
        }
    }
    if (areAllCellsFull) return 'D' // D for draw

    return null;
}
