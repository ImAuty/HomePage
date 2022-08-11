const tankore = {
    data: function () {
        return {
            numberOfLetters: 5,
            numberOfAnswers: 5,
            results: [
                // 二次元配列を想定
            ],
            outputs: [
                //一次元配列を想定
            ],
            inputs: [
                [
                    { key: 'a', value: 'あ', isDisabled: false },
                    { key: 'i', value: 'い', isDisabled: false },
                    { key: 'u', value: 'う', isDisabled: false },
                    { key: 'e', value: 'え', isDisabled: false },
                    { key: 'o', value: 'お', isDisabled: false },
                ],
                [
                    { key: 'ka', value: 'か', isDisabled: false },
                    { key: 'ki', value: 'き', isDisabled: false },
                    { key: 'ku', value: 'く', isDisabled: false },
                    { key: 'ke', value: 'け', isDisabled: false },
                    { key: 'ko', value: 'こ', isDisabled: false },
                ],
                [
                    { key: 'sa', value: 'さ', isDisabled: false },
                    { key: 'si', value: 'し', isDisabled: false },
                    { key: 'su', value: 'す', isDisabled: false },
                    { key: 'se', value: 'せ', isDisabled: false },
                    { key: 'so', value: 'そ', isDisabled: false },
                ],
                [
                    { key: 'ta', value: 'た', isDisabled: false },
                    { key: 'ti', value: 'ち', isDisabled: false },
                    { key: 'tu', value: 'つ', isDisabled: false },
                    { key: 'te', value: 'て', isDisabled: false },
                    { key: 'to', value: 'と', isDisabled: false },
                ],
                [
                    { key: 'na', value: 'な', isDisabled: false },
                    { key: 'ni', value: 'に', isDisabled: false },
                    { key: 'nu', value: 'ぬ', isDisabled: false },
                    { key: 'ne', value: 'ね', isDisabled: false },
                    { key: 'no', value: 'の', isDisabled: false },
                ],
                [
                    { key: 'ha', value: 'は', isDisabled: false },
                    { key: 'hi', value: 'ひ', isDisabled: false },
                    { key: 'hu', value: 'ふ', isDisabled: false },
                    { key: 'he', value: 'へ', isDisabled: false },
                    { key: 'ho', value: 'ほ', isDisabled: false },
                ],
                [
                    { key: 'ma', value: 'ま', isDisabled: false },
                    { key: 'mi', value: 'み', isDisabled: false },
                    { key: 'mu', value: 'む', isDisabled: false },
                    { key: 'me', value: 'め', isDisabled: false },
                    { key: 'mo', value: 'も', isDisabled: false },
                ],
                [
                    { key: 'ya', value: 'や', isDisabled: false },
                    { key: 'yu', value: 'ゆ', isDisabled: false },
                    { key: 'yo', value: 'よ', isDisabled: false },
                    { key: '_1', value: '　', isDisabled: true },
                    { key: '_2', value: '　', isDisabled: true },
                ],
                [
                    { key: 'ra', value: 'ら', isDisabled: false },
                    { key: 'ri', value: 'り', isDisabled: false },
                    { key: 'ru', value: 'る', isDisabled: false },
                    { key: 're', value: 'れ', isDisabled: false },
                    { key: 'ro', value: 'ろ', isDisabled: false },
                ],
                [
                    { key: 'wa', value: 'わ', isDisabled: false },
                    { key: 'wo', value: 'を', isDisabled: false },
                    { key: 'nn', value: 'ん', isDisabled: false },
                    { key: 'ds', value: 'ー', isDisabled: false },
                    { key: 'mp', value: '・', isDisabled: false },
                ],
            ],
        };
    },
    methods: {
        frontValue: function (val) {
            if (val === null) return;
            if (val.isDisabled) return;
            if (this.numberOfRemainingLetters <= 0) return;
            this.outputs.push(val);
        },
        backSpace: function () {
            if (this.numberOfRemainingLetters >= this.numberOfLetters) return;
            this.outputs.pop();
        },
        answer: function () {
            alert('Not implemented.');
        },
    },
    computed: {
        numberOfRemainingLetters: function () {
            return this.numberOfLetters - this.outputs.length;
        },
        numberOfRemainingAnswers: function () {
            const numberOfOutputs = 1;
            return this.numberOfAnswers - this.results.length - numberOfOutputs;
        },
    },
};

Vue.createApp(tankore).mount('main');
