const WORD_WRAPPER_CLASS = 'balance-text-word'
const SPACE_WRAPPER_CLASS = 'balance-text-space'
// const balancedTextObserver = new IntersectionObserver(balanceTextHelper, {
//     rootMargin: '200px 0px',
// })

const elementIsEligible = element => {
    if (element.dataset.balanceTextParsed === 'true') return true
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) return true // if element only contains text
    return false
}

const removeExistingLineBreaks = element => {
    element.innerHTML = element.innerHTML.replace(/<br>/g, '')
}

const getElementHeight = element => {
    removeExistingLineBreaks(element)
    const styles = getComputedStyle(element)
    return element.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom)
}

const calcWordWidths = element => {
    const words = element.querySelectorAll(`.${WORD_WRAPPER_CLASS}`)
    const wordWidths = []
    words.forEach(word => {
        wordWidths.push(word.getBoundingClientRect().width)
    })
    return wordWidths
}

const getWords = element => {
    const wordElements = element.querySelectorAll(`.${WORD_WRAPPER_CLASS}`)
    const words = []
    wordElements.forEach(word => {
        words.push(word.innerText)
    })
    return words
}

const calcSpaceWidths = element => {
    const space = element.querySelector(`.${SPACE_WRAPPER_CLASS}`)
    return space.getBoundingClientRect().width
}

const calcContentLength = element => {
    const totalWordLength = element.wordsLengths.reduce((a, b) => (a += b))
    const totalSpacesLength = element.wordsLengths.length * element.space
    return totalWordLength + totalSpacesLength
}

const countLines = element => {
    const lineHeight = element.element.querySelector(`.${WORD_WRAPPER_CLASS}`).getBoundingClientRect().height
    return Math.round(element.height / lineHeight)
}

const getHeightOfEveryElement = elements => {
    elements.forEach(element => {
        element['height'] = getElementHeight(element.element)
    })
}

const wrapSpanAroundEveryWord = element => {
    const innerText = element.innerText
    const splitText = innerText.split(' ')
    const newHTML = `<span class='${WORD_WRAPPER_CLASS}'>${splitText.join(
        `</span> <span class='${WORD_WRAPPER_CLASS}'>`
    )}</span><span class='${SPACE_WRAPPER_CLASS}'>&nbsp;</span>`
    element.innerHTML = newHTML
}

const createElementsArray = elements => {
    elementCollection = document.querySelectorAll(elements)
    const elementsArray = []
    elementCollection.forEach(element => {
        if (elementIsEligible(element)) elementsArray.push({ element: element })
    })
    return elementsArray
}

const parseWords = elementsArray => {
    elementsArray.forEach(({ element }) => {
        wrapSpanAroundEveryWord(element)
        element.dataset.balanceTextParsed = 'true'
    })
}

const getWordWidths = elementsArray => {
    elementsArray.forEach(element => {
        element['wordsLengths'] = calcWordWidths(element.element)
        element['words'] = getWords(element.element)
        element['space'] = calcSpaceWidths(element.element)
        element['lines'] = countLines(element)
    })
}

const createOptimalLineBreaks = elementsArray => {
    elementsArray.forEach(element => {
        const averageLineLength = calcContentLength(element) / element.lines
        let newHTML = ''
        let currentLineLength = 0
        let totalLineBreaks = 1
        for (let i = 0; i < element.wordsLengths.length; i++) {
            const currentWordLength = element.wordsLengths[i] + element.space
            if (currentLineLength + currentWordLength > averageLineLength) {
                newHTML += '<br>' + element.words[i] + ' '
                currentLineLength = 0
                totalLineBreaks++
            } else {
                newHTML += element.words[i] + ' '
                currentLineLength += currentWordLength
            }
        }
        if (totalLineBreaks <= element.lines) element.element.innerHTML = newHTML
    })
}

const balanceTextHelper = ({ elements = '.has-balanced-text', lazyBalance = false, elementsArray }) => {
    const startTime = performance.now()
    if (!elementsArray) {
        elementsArray = createElementsArray(elements)
        if (lazyBalance === true) {
            document.querySelectorAll(elements).forEach(element => {
                balancedTextObserver.observe(element)
            })
            return
        }
    }
    getHeightOfEveryElement(elementsArray)
    parseWords(elementsArray)
    getWordWidths(elementsArray) // after DOM updates to prevent forced layout updates
    createOptimalLineBreaks(elementsArray)

    const endTime = performance.now()
    console.log(endTime - startTime)
}

const lazyBalanceHelper = entries => {
    requestAnimationFrame(() => {
        const elementsArray = []
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                elementsArray.push({ element: entry.target })
                balancedTextObserver.unobserve(entry.target)
            }
        })
        balanceTextHelper({
            elementsArray: elementsArray,
        })
    })
}

const runBalancedText = options => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(
            () => {
                balanceTextHelper(options)
            },
            { timeout: 1000 }
        )
    } else {
        requestAnimationFrame(() => {
            balanceTextHelper(options)
        })
    }
}

const balanceText = options => {
    if (CSS.supports('text-wrap', 'balance')) return
    if (!options) options = {}
    runBalancedText(options)
    if (options.watch) {
        const timing = options.debounce !== undefined ? options.debounce : 200
        window.addEventListener(
            'resize',
            debounce(() => {
                runBalancedText(options)
            }, timing)
        )
    }
}

const debounce = (func, wait) => {
    let timeout

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

const balancedTextObserver = new IntersectionObserver(lazyBalanceHelper, {
    rootMargin: '200px 0px',
})
