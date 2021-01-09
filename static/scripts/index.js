const initiateCanvas = () => {
    const introductionCanvas = document.querySelector('#introduction-canvas');
    
    class DrawCanvas {
        constructor(context) {
            this.lastCoordinates = [0, 0];
            this.context = context;
            this.isLMBOn = false;
    
            this.initializeContextStyles();
    
            this.context.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.context.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.context.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
            this.context.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        }
    
        initializeContextStyles() {
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.lineWidth = 5;
        }
    
        handleMouseDown(event) {
            this.isLMBOn = true;
            this.lastCoordinates = [event.offsetX, event.offsetY];
        }
    
        handleMouseUp() {
            this.isLMBOn = false;
        }
    
        handleMouseMove(event) {
            if (!this.isLMBOn) {
                return;
            }
    
            this.context.beginPath();
            this.context.moveTo(this.lastCoordinates[0], this.lastCoordinates[1]);
            this.context.lineTo(event.offsetX, event.offsetY);
            this.context.stroke();
    
            this.lastCoordinates = [event.offsetX, event.offsetY];
        }
    }
    
    if (introductionCanvas.getContext) {
        new DrawCanvas(introductionCanvas.getContext('2d'));
    }
};

const countExperience = () => {
    const workExperienceNode = document.querySelector('.introduction__experience');
    const startDate = new Date('2018-06-19').getTime();

    const pluralize = (forms = [], n = 0) => {
        let id;

        if (n % 10 === 1 && n % 100 !== 11) {
            return forms[0] || '';
        } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
            id = 1;
            return forms[1] || '';
        }

        return forms[2] || '';
    }

    if (workExperienceNode) {
        const currentDate = Date.now();
        const experience = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365);
        const yearLiteral = pluralize(['год', 'года', 'лет'], experience);

        workExperienceNode.textContent = `${experience.toFixed(1)} ${yearLiteral}`;
    }
};

const toggleExperience = () => {
    let isExperienceCollapsed = true;
    const toggleButton = document.getElementById('toggle');

    toggleButton && toggleButton.addEventListener('click', (event) => {
        const sectionNode = event.target.closest('.section');

        isExperienceCollapsed = !isExperienceCollapsed;
        toggleButton.text = isExperienceCollapsed ? 'Коротко' : 'Развернуто';

        if (isExperienceCollapsed) {
            return sectionNode.classList.remove('section--full');
        }

        sectionNode.classList.add('section--full');
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initiateCanvas();
    countExperience();
    toggleExperience();
});