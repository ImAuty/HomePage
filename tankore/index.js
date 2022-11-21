const ERROR_MASSAGE = 'エラーが発生しました。時間をおいて再度操作を行ってください。';
const API_PATH = '/tankore/api/index.php';

async function sendToApi(path, init) {
    const url = new URL(window.location.origin);
    url.pathname = path;
    const response = await fetch(url.href, init);
    const data = await response.json()
    if (response.ok) {
        return Promise.resolve(data);
    } else {
        const message = data.errorMessage;
        throw new Error(message);
    }
};

async function sendGetToApi(path) {
    const init = {
        method: 'GET',
    };
    return sendToApi(path, init);
}

async function sendPostToApi(path, json = {}) {
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
    };
    return sendToApi(path, init);
}

function popupMessage(type, message, seconds = 2) {
    const popupArea = document.getElementById('popupArea');
    const row = document.createElement('div');
    row.classList.add('row');
    const col = document.createElement('div');
    col.classList.add('col');
    const content = document.createElement('div');
    if (type !== null) content.classList.add(type);
    const span = document.createElement('span');
    const text = document.createTextNode(message);
    span.append(text);
    content.append(span);
    col.append(content);
    row.append(col);
    const timeoutId = window.setTimeout(() => {
        row.remove();
    }, seconds * 1000);
    row.addEventListener('click', () => {
        window.clearTimeout(timeoutId);
        row.remove();
    });
    popupArea.prepend(row);
};

function popupInfoMessage(message) {
    popupMessage('info', message);
};

function popupSuccessMessage(message) {
    popupMessage('success', message);
};

function popupErrorMessage(message) {
    popupMessage('error', message, 10);
};

function convertToLetter(val) {
    return {
        key: val.code,
        type: val.type,
        value: val.value,
        numberOfMatched: null,
        numberOfContained: null,
        get state() {
            if (this.numberOfMatched === null) return 'none';
            if (this.numberOfContained === null) return 'none';
            if (this.numberOfMatched > 0) return 'matched';
            if (this.numberOfContained > 0) return 'contained';
            return 'wrong';
        },
        get isVisible() {
            const types = ['seion', 'hatuon', 'tyouon'];
            return types.includes(this.type);
        },
    };
};

function createLetters(vals) {
    if (vals === null) return [];
    const letters = vals.map(convertToLetter);
    return letters;
};

function convertToReply(val) {
    return {
        value: val.value,
        isMatched: val.matchesAnswerLetter,
        numberOfContained: val.inAnswerWord,
        get isContained() {
            if (this.numberOfContained === null) return false;
            return (this.numberOfContained > 0);
        },
        get state() {
            if (this.isMatched) return 'matched';
            if (this.isContained) return 'contained';
            return 'none';
        },
    };
};

function createReplies(vals) {
    if (vals === null) return [];
    const replies = vals.map(e => e.map(convertToReply));
    return replies;
};

const tankore = {
    data: function () {
        return {
            numberOfAnswerLetters: 0,
            answerLimit: 0,
            targetDate: '',
            replies: [],
            letters: [],
            inputLetters: [],
        };
    },
    methods: {
        toColumns: function (vals, size) {
            const columns = [];
            const max = vals.length;
            for (let i = 0; i < max; i = i + size) {
                const column = vals.slice(i, i + size);
                columns.push(column);
            }
            return columns;
        },
        frontValue: function (key) {
            if (!this.isRepliable) return;
            const letter = this.letters.filter(e => e.key !== null).find(e => e.key === key);
            if (letter === undefined) {
                popupErrorMessage('想定外の操作が行われました。');
                return;
            }
            this.inputLetters.push(letter);
        },
        backSpace: function () {
            if (!this.isRepliable) return;
            this.inputLetters.pop();
        },
        answer: function () {
            if (!this.isRepliable) return;
            const json = {
                answerDate: this.targetDate,
                inputWord: this.inputWord,
            };
            const self = this;
            sendPostToApi(API_PATH, json).then(data => {
                if (data.isFailedToReply) {
                    popupInfoMessage('単語を見つけられませんでした。');
                }
                self.numberOfAnswerLetters = data.numberOfAnswerLetters;
                self.answerLimit = data.answerLimit;
                self.targetDate = data.targetDate;
                self.replies = createReplies(data.replies);
                self.letters = createLetters(data.letters);
                self.inputLetters = [];
                popupInfoMessage('回答数の残り：' + this.numberOfRemainingReplies);
            }).catch(error => {
                console.error(error);
                popupErrorMessage(ERROR_MASSAGE);
            });
        },
    },
    computed: {
        inputWord: function () {
            return this.inputLetters.map(e => e.value).join('');
        },
        isRepliable: function () {
            return (this.answerLimit > this.replies.length);
        },
        numberOfRemainingReplies: function () {
            return this.answerLimit - this.replies.length;
        },
    },
    created: function () {
        const self = this;
        sendGetToApi(API_PATH).then(data => {
            self.numberOfAnswerLetters = data.numberOfAnswerLetters;
            self.answerLimit = data.answerLimit;
            self.targetDate = data.targetDate;
            self.replies = createReplies(data.replies);
            self.letters = createLetters(data.letters);
            self.inputLetters = [];
        }).catch(error => {
            console.error(error);
            popupErrorMessage(ERROR_MASSAGE);
        });
    },
};

Vue.createApp(tankore).mount('main');
