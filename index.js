addListeners();

const blocks = {
    heartBeating: {},
    moveAndHide: {}
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y:10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            blocks.moveAndHide = animaster().addMove(2000, {x: 100, y: 20}).addFadeOut(3000).play(block, true);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            blocks.moveAndHide.reset();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().addFadeIn(1666).addDelay(1666).addFadeOut(1666).play(block);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            blocks.heartBeating = animaster().addScale(500, 1.4).addScale(500, 1).play(block, true);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            blocks.heartBeating.stop();
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    
    return {
        _steps: [],
        addMove(duration, translation){
            this._steps.push({func: 'move',
                duration: duration,
                extra: translation
            })
            return this;
        },
        addFadeIn(duration){
            this._steps.push({func: 'fadeIn',
                duration: duration,
            })
            return this;
        },
        addFadeOut(duration){
            this._steps.push({func: 'fadeOut',
                duration: duration,
            })
            return this;
        },
        addScale(duration, ratio){
            this._steps.push({func: 'scale',
                duration: duration,
                extra: ratio
            })
            return this;
        },
        addDelay(duration) {
            this._steps.push({func: 'delay',
                duration: duration,
            })
            return this;
        },
        play(element, cycled = false) {
            let lastDuration = 0;
            const intervals = [];
            const timeouts = [];

            const playStep = (step) => {
                switch (step.func) {
                    case 'move':
                        timeouts.push(setTimeout(this.move, lastDuration, element, step.duration, step.extra));
                        lastDuration += step.duration;
                        break;
                    case 'fadeIn':
                        timeouts.push(setTimeout(this.fadeIn, lastDuration, element, step.duration));
                        lastDuration += step.duration;
                        break;
                    case 'fadeOut':
                        timeouts.push(setTimeout(this.fadeOut, lastDuration, element, step.duration));
                        lastDuration += step.duration;
                        break;
                    case 'scale':
                        timeouts.push(setTimeout(this.scale, lastDuration, element, step.duration, step.extra));
                        lastDuration += step.duration;
                        break;
                    case 'delay':
                        timeouts.push(setTimeout(() => {}, lastDuration));
                        lastDuration += step.duration;
                        break;
                }
            };

            if (cycled) {
                const interval = setInterval(() => {
                    this._steps.forEach(playStep);
                }, lastDuration);
                intervals.push(interval);
            } else {
                this._steps.forEach(playStep);
            }

            return {
                stop() {
                    intervals.forEach(clearInterval);
                    timeouts.forEach(clearTimeout);
                },
                reset() {
                    this.stop();
                    resetFadeIn(element);
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            }
        },
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        buildHandler() {
            return (event) => {
                this.play(event.currentTarget);
            };
        }
    }
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }


    return {
        _steps: [],
        addMove(duration, translation){
            this._steps.push({func: 'move',
                duration: duration,
                extra: translation
            })
            return this;
        },
        play(element) {
            for (const step of this._steps) {
                switch (step.func) {
                    case 'move':
                        this.move(element, step.duration, step.extra);
                        break;
                }
            }
            this._steps = [];
        },
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, {x: 100, y: 20});
            setTimeout(this.fadeOut, duration * 0.4, element, duration * 0.6)
            return {
                reset() {
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            }
        },
        showAndHide(element, duration) {
            const stepDuration = duration / 3;
            this.fadeIn(element, stepDuration);
            setTimeout(this.fadeOut, stepDuration * 2, element, stepDuration);
        },
        heartBeating(element) {
            const animate = () => {
                this.scale(element, 500, 1.4);
                setTimeout(this.scale, 500, element, 500, 1);
            };
            const interval = setInterval(animate, 1000);
            return {
                stop() {
                    clearInterval(interval);
                }
            }
        }

    }
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}