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
            blocks.moveAndHide = animaster().moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            blocks.moveAndHide.reset();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            blocks.heartBeating = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            blocks.heartBeating.stop();
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
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
        play(element) {
            let lastDuration = 0;
            for (const step of this._steps) {
                switch (step.func) {
                    case 'move':
                        setTimeout(this.move, lastDuration, element, step.duration, step.extra)
                        lastDuration = step.duration;
                        break;
                    case 'fadeIn':
                        setTimeout(this.fadeIn, lastDuration, element, step.duration)
                        lastDuration = step.duration;
                        break;
                    case 'fadeOut':
                        setTimeout(this.fadeOut, lastDuration, element, step.duration)
                        lastDuration = step.duration;
                        break;
                    case 'scale':
                        setTimeout(this.scale, lastDuration, element, step.duration, step.extra)
                        lastDuration = step.duration;
                        break;
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
