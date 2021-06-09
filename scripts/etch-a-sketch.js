const config = {
    colorMode: "black",
    showGridlines: true,
    dimension: 16,
    setDefaults: function() {
        const dimensionInput = document.querySelector("#dimension-setter");
        dimensionInput.value = this.dimension;
    },
}


config.setDefaults();
wireResetButton();
wireColorSelectionButtons();
wireSetDimensionButton();
wireToggleGridlinesButton();
renderGrid();

function renderGrid() {
    const container = document.querySelector("#container");
    let existingRows = document.querySelectorAll(".grid-row");
    if (existingRows) {
        existingRows.forEach(row => row.remove());
    }

    const minGridDim = 960 / config.dimension;
    for (let i = 0; i < config.dimension; ++i) {
        const newGridRow = document.createElement('div');
        newGridRow.classList.add('grid-row');
        newGridRow.style.minHeight = `${minGridDim}px`;
        newGridRow.style.minWidth = `${minGridDim}px`;

        for (let j = 0; j < config.dimension; ++j) {
            const newGridBox = document.createElement('div');
            newGridBox.classList.add('grid-block');
            newGridBox.addEventListener('mouseover', (e) => {
                if (config.colorMode === "black") {
                    e.target.style.backgroundColor = "black";
                } else if (config.colorMode === "rgb") {
                    e.target.style.backgroundColor = randomRGBValue();
                } else if (config.colorMode === "grayscale") {
                    const currentBackground = e.target.style.backgroundColor;
                    if (currentBackground === "rgb(0, 0, 0)") {
                        return;
                    }
                    const colorSplit = currentBackground.split(',');
                    if (colorSplit.length != 4) {
                        e.target.style.backgroundColor = "rgb(0, 0, 0, 0.1)";
                    } else {
                        const currentAlpha = +(colorSplit[colorSplit.length - 1].trim().slice(0, -1));
                        if (currentAlpha >= 1.0) {
                            return;
                        }
                        const newAlpha = currentAlpha + 0.1;
                        e.target.style.backgroundColor = `rgb(0, 0, 0, ${newAlpha})`;
                    }
                }
            });
            newGridBox.style.minHeight = `${minGridDim}px`;
            newGridBox.style.minWidth = `${minGridDim}px`;
            newGridRow.appendChild(newGridBox);
        }
        container.appendChild(newGridRow);
        setGridlines();
    }
}

function wireResetButton() {
    const resetButton = document.querySelector("#reset-button");
    resetButton.addEventListener('click', (e) => {
        const gridBoxes = document.querySelectorAll(".grid-block");
        gridBoxes.forEach(box => box.style.backgroundColor = 'white');
    });
}

function wireSetDimensionButton() {
    const setDimensionsButton = document.querySelector("#set-number-button");
    setDimensionsButton.addEventListener('click', (e) => {
        const dimensionInput = document.querySelector("#dimension-setter");
        if (dimensionInput.value < 1 || dimensionInput.value > 100) {
            alert("Square must be between 1x1 and 100x100");
            return;
        }
        config.dimension = dimensionInput.value;
        renderGrid();
    });
}

function wireToggleGridlinesButton() {
    const toggleGridlinesButton = document.querySelector("#toggle-gridlines");
    toggleGridlinesButton.addEventListener('click', (e) => {
        config.showGridlines = !(config.showGridlines);
        setGridlines();
    });
}

function setGridlines() {
    const gridBoxes = document.querySelectorAll(".grid-block");
    gridBoxes.forEach(box => {
        box.style.outline = config.showGridlines ? "1px solid black" : "none";
    })
}

function wireColorSelectionButtons() {
    const rgbButton = document.querySelector("#color-rgb");
    rgbButton.addEventListener('click', (e) => {
        config.colorMode = "rgb";
    });

    const blackButton = document.querySelector("#color-black");
    blackButton.addEventListener('click', (e) => {
        config.colorMode = "black";
    });

    const grayscaleButton = document.querySelector("#color-grayscale");
    grayscaleButton.addEventListener('click', (e) => {
        config.colorMode = "grayscale";
    });
}

function randomRGBValue() {
    const min = 0;
    const max = 255;
    const random255 = function() {
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    const r = random255();
    const g = random255();
    const b = random255();
    return `rgb(${r}, ${g}, ${b})`;
}