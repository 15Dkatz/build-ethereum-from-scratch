/* LIGHTNING SMART CONTRACT LANGUAGE */

const STOP = 'STOP';
const ADD = 'ADD';
const PUSH = 'PUSH';

const code = [PUSH, 2, PUSH, 3, ADD, STOP];

class Interpreter {
    constructor() {
        this.state = {
            programCounter: 0,
            stack: [],
            code: []
        };
    }

    runCode(code) {
        this.state.code = code;

        while (this.state.programCounter < this.state.code.length) {
            const opCode = this.state.code[this.state.programCounter];

            try {
                switch (opCode) {
                    case STOP:
                        throw new Error('Execution complete');

                    case PUSH:
                        this.state.programCounter++;
                        const value = this.state.code[this.state.programCounter];
                        this.state.stack.push(value);
                        break;

                    case ADD:
                        const a = this.state.stack.pop();
                        const b = this.state.stack.pop();

                        this.state.stack.push(a + b);
                        break;
                    default:
                        break;

                }
            } catch (error) {




                return this.state.stack[this.state.stack.length - 1];
            }

            this.state.programCounter++;
        }
    }
}

const interpreter = new Interpreter();
console.log(interpreter.runCode(code));
