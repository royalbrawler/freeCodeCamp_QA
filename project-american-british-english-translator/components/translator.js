const americanOnly = require('./american-only.js')
const AmericanToBritishSpelling = require('./american-to-british-spelling.js')
const AmericanToBritishTitles = require('./american-to-british-titles.js')
const britishOnly = require('./british-only.js')

const objectSwap_KeyValue = (obj) => Object.entries(obj).reduce((acc, [key, value]) => (acc[value] = key, acc), {})
const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1)

class Translator {
    AmericanToBritish(text) {
        const dictionary = { ...americanOnly, ...AmericanToBritishSpelling }
        const titles = AmericanToBritishTitles;

        return this.translate(text, dictionary, titles)
    }

    BritishToAmerican(text) {
        const BritishToAmericanSpelling = objectSwap_KeyValue(AmericanToBritishSpelling)
        const dictionary = { ...britishOnly, ...BritishToAmericanSpelling }
        const BritishToAmericanTitles = objectSwap_KeyValue(AmericanToBritishTitles);

        return this.translate(text, dictionary, BritishToAmericanTitles);

    }
    translate(text, dictionary, titles) {
        const lowerText = text.toLowerCase();
        const timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(:|\.)([0-5][0-9]))/g;
        let translatedText = text;

        // searching for  Titles and replace them
        Object.entries(titles) //[ [key1, value1],[key1, value1] ]
            .map(([key, value]) => {
                if (lowerText.includes(key)) {
                    translatedText = text.replace(new RegExp(key, "gi"), `<span class="highlight">${capitalizeFirstLetter(value)}</span>`) || text;
                }
            })

        const changeTime = lowerText.match(timeRegex); //['12.15','11.15']
        if (changeTime) {
            changeTime.map(time => {
                translatedText = translatedText.replace(time, `<span class="highlight">${time.replace(':', '.')}</span>`) || text;
            })
        }

        // translate
        Object.entries(dictionary)
            .map(([key, value]) => {
                if (new RegExp(`${key} `, "gi").test(lowerText) ||
                    new RegExp(`${key}[^A-Za-z]`, "gi").test(lowerText) ||
                    new RegExp(`${key}$`, "gi").test(lowerText)) {

                    translatedText = translatedText.replace(new RegExp(key, "gi"), `<span class="highlight">${value}</span>`) || text;
                }
            });

        return translatedText;
    }
}

module.exports = Translator
