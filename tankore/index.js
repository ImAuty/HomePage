const INPUT_DATA_LENGTH = 5;
const GET_INIT_PARAM_PATH = '/tankore/api/index.php';
const POPUP_TYPE_INFO = 'info';
const POPUP_TYPE_SUCCESS = 'success';
const POPUP_TYPE_ERROR = 'error';
const POPUP_DISPLAY_SECOND = 2;

async function sendToApi(path, method, json = {}) {
    const url = new URL(window.location.origin);
    url.pathname = path;
    const response = await fetch(url.href, {
        method: method,
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(json),
    });
    return response.json();
};

function popupMessage(type, message) {
    const popupArea = document.getElementById('popupArea');
    const row = document.createElement('div');
    row.classList.add('row');
    const col = document.createElement('div');
    col.classList.add('col');
    const content = document.createElement('div');
    if (type === POPUP_TYPE_INFO) content.classList.add('info');
    if (type === POPUP_TYPE_SUCCESS) content.classList.add('success');
    if (type === POPUP_TYPE_ERROR) content.classList.add('error');
    const span = document.createElement('span');
    const text = document.createTextNode(message);
    span.append(text);
    content.append(span);
    col.append(content);
    row.append(col);
    const timeoutId = window.setTimeout(() => {
        row.remove();
    }, POPUP_DISPLAY_SECOND * 1000);
    row.addEventListener('click', () => {
        window.clearTimeout(timeoutId);
        row.remove();
    });
    popupArea.prepend(row);
};

function popupInfoMessage(message) {
    const type = POPUP_TYPE_INFO;
    popupMessage(type, message);
};

function popupSuccessMessage(message) {
    const type = POPUP_TYPE_SUCCESS;
    popupMessage(type, message);
};

function popupErrorMessage(message) {
    const type = POPUP_TYPE_ERROR;
    popupMessage(type, message);
};

function createInputData(val) {
    return {
        key: val.key,
        value: val.value,
        isDisabled: val.isDisabled,
        numberOfMatches: null,
        numberOfExists: null,
        get state() {
            if (this.numberOfMatches === null) return 'none';
            if (this.numberOfExists === null) return 'none';
            if (this.numberOfExists === 0) return 'wrong';
            return 'right';
        },
        get matchRate() {
            if (this.numberOfMatches === null) return 0;
            if (this.numberOfExists === null) return 0;
            if (this.numberOfExists === 0) return 0;
            const rate = this.numberOfMatches / this.numberOfExists;
            return Math.round(rate * 100) / 100;
        },
    };
};

function createInputCols(val) {
    const cols = [];
    val.forEach((letter, index) => {
        const colIndex = Math.floor(index / INPUT_DATA_LENGTH);
        while (cols.length <= colIndex) {
            cols.push({ datas: [] });
        }
        const inputData = createInputData(letter);
        cols[colIndex].datas.push(inputData);
    });
    return cols;
};

function creatOutputData(val) {
    return {
        key: val.key,
        value: val.value,
    };
};

function creatResultData(val) {
    return {
        key: val.key,
        value: val.value,
        isMatch: null, //val.isMatch,
        numberOfExists: null, //val.numberOfExists,
        get state() {
            if (this.isMatch === null) return 'none';
            if (this.numberOfExists === null) return 'none';
            if (this.numberOfExists === 0) return 'wrong';
            if (!this.isMatch) return 'right';
            return 'match';
        },
    };
};

const tankore = {
    data: function () {
        return {
            numberOfLetters: 0,
            numberOfAnswers: 0,
            letters: [{ key: '', value: '', isDisabled: false }],
            input: { cols: [/** { datas: [Input Data Objects] } */] },
            output: {
                isAvailable: false,
                datas: [/** Output Data Objects */],
            },
            result: { answers: [/** { datas: [Result Data Objects] } */] },
        };
    },
    methods: {
        frontValue: function (key) {
            if (!this.output.isAvailable) {
                popupInfoMessage('回答数が上限に達しました。');
                return;
            }
            if (this.numberOfRemainingLetters <= 0) {
                popupInfoMessage('文字数が上限に達しました。');
                return;
            }
            if (key === null) {
                popupErrorMessage('想定外の操作が行われました。');
                return;
            }
            const letter = this.letters.find(e => e.key === key);
            if (letter === undefined) {
                popupErrorMessage('想定外の操作が行われました。');
                return;
            }
            if (letter.isDisabled) {
                popupErrorMessage('想定外の操作が行われました。');
                return;
            }
            const outputData = creatOutputData(letter);
            this.output.datas.push(outputData);
        },
        backSpace: function () {
            if (!this.output.isAvailable) {
                popupInfoMessage('回答数が上限に達しました。');
                return;
            }
            if (this.numberOfRemainingLetters >= this.numberOfLetters) {
                return;
            }
            this.output.datas.pop();
        },
        answer: function () {
            if (!this.output.isAvailable) {
                popupInfoMessage('回答数が上限に達しました。');
                return;
            }
            if (this.numberOfRemainingLetters != 0) {
                popupInfoMessage('文字数が不足しています。');
                return;
            }
            this.output.isAvailable = false;
            const outputDatas = this.output.datas;
            const resultDatas = outputDatas.map(creatResultData);
            this.result.answers.push({ datas: resultDatas });
            this.output.datas = [];
            popupInfoMessage('回答数の残り：' + this.numberOfRemainingAnswers);
            if (this.numberOfRemainingAnswers > 0) {
                this.output.isAvailable = true;
            }
        },
    },
    computed: {
        numberOfRemainingLetters: function () {
            if (!this.output.isAvailable) return 0;
            return this.numberOfLetters - this.output.datas.length;
        },
        numberOfRemainingAnswers: function () {
            const outputLength = this.output.isAvailable ? 1 : 0;
            return this.numberOfAnswers - this.result.answers.length - outputLength;
        },
    },
    created: function () {
        const self = this;
        sendToApi(GET_INIT_PARAM_PATH, 'GET').then(initParam => {
            self.numberOfLetters = initParam.numberOfLetters;
            self.numberOfAnswers = initParam.numberOfAnswers;
            self.letters = initParam.letters;
            const inputCols = createInputCols(self.letters);
            self.input.cols = inputCols;
            self.output.isAvailable = true;
            self.result.answers = [];
        });
    },
};

Vue.createApp(tankore).mount('main');
