(function() {
    'use strict';

    const fontSize = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));
    const defaultGridWidth = 16;
    const defaultGridHeight = 9;
    const defaultTileDimension = 5;
    const perspectiveModifier = 20;
    const perspective = perspectiveModifier * fontSize;

    const directions = {
        none: 0,
        positive: 1,
        negative: -1
    };

    const keyMap = {
        ArrowLeft: [directions.none, directions.negative],
        ArrowRight: [directions.none, directions.positive],
        ArrowUp: [directions.positive, directions.none],
        ArrowDown: [directions.negative, directions.none]
    };

    const keyMapValues = Object.keys(keyMap).map(key => keyMap[key]).concat([
        [directions.positive, directions.positive],
        [directions.negative, directions.negative],
        [directions.positive, directions.negative],
        [directions.negative, directions.positive]
    ]);

    function Grid(gridWidth = defaultGridWidth, gridHeight = defaultGridHeight, tileDimension = defaultTileDimension) {
        const gridElement = document.createElement('div');
        const rowElements = [];
        const tileElements = [];
        let x = 45;
        let z = 0;

        this.keyMapping = undefined;
        this.frameCount = 0;
        this.currentFrame = 0;
        this.raqId = 0;

        function generateRandomInteger(lowerBound = 0, upperBound = 1) {
            return Math.round(((upperBound - lowerBound) * Math.random()) + lowerBound);
        }
    
        function generateRandomColor() {
            return [
                generateRandomInteger(0, 255),
                generateRandomInteger(0, 255),
                generateRandomInteger(0, 255)
            ];
        }

        this.initialize = () => {
            const trueTileDimension = fontSize * tileDimension;
            gridElement.classList.add('grid');
            gridElement.style.transform = `perspective(${perspective}px) rotateX(${x}deg)`;

            for (let i = 0; i < gridHeight; ++i) {
                const rowElement = document.createElement('div');

                rowElement.classList.add('grid-row');
                gridElement.appendChild(rowElement);
                rowElements.push(rowElement);
                tileElements.push([]);

                for (let j = 0; j < gridWidth; ++j) {
                    const tileElement = document.createElement('div');

                    tileElement.classList.add('tile');
                    tileElement.style.backgroundColor = `rgb(${generateRandomColor().join()})`;
                    tileElement.style.margin = '0.25rem';
                    tileElement.style.width = tileElement.style.height = `${trueTileDimension}px`;
                    tileElements[i][j] = tileElement;
                    rowElement.appendChild(tileElement);
                }
            }

            document.body.appendChild(gridElement);

            window.addEventListener('keydown', (event) => {
                if (this.raqId) {
                    cancelAnimationFrame(this.raqId);
                    this.raqId = undefined;
                }

                event.preventDefault();

                const mapping = keyMap[event.key];

                if (mapping) {
                    this.rotateGrid(mapping)
                }
            });

            window.addEventListener('keyup', (event) => {
                if (!this.raqId) {
                    this.animate();
                }

                event.preventDefault();
            });
        };

        this.animate = () => {
            if (this.currentFrame >= this.frameCount) {
                this.keyMapping = keyMapValues[generateRandomInteger(0, keyMapValues.length - 1)];
                this.frameCount = generateRandomInteger(100, 500);
                this.currentFrame = 0;
            } else {
                this.rotateGrid(this.keyMapping);
                ++this.currentFrame;
            }

            this.raqId = requestAnimationFrame(this.animate);
        };

        this.rotateGrid = (mapping) => {
            x += mapping[0];
            z += mapping[1];
            gridElement.style.transform = `perspective(${perspective}px) rotateX(${x}deg) rotate(${z}deg)`;
        };
    }

    const grid = new Grid();
    grid.initialize();
    grid.animate();
})(); 