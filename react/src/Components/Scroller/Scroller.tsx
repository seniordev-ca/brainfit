import React from 'react';
import './Scroller.scss';

export interface ScrollerProps {
  id?: string;
  options?: any;
  halfCount?: number;
  quarterCount?: number;
  a?: number;
  minV?: number;
  exceedA?: number;
  moveT?: number;
  elems?: any;
  events?: any;
  itemHeight?: any;
  itemAngle?: any;
  radius?: any;
  source: any;
  type?: any;
  value?: any;
  selected?: any;
  onChange?: any;
  selectorClass?: string;
}

const easing: any = {
  easeOutCubic: function (pos: any) {
    return Math.pow(pos - 1, 3) + 1;
  },
  easeOutQuart: function (pos: any) {
    return -(Math.pow(pos - 1, 4) - 1);
  }
};

export class Scroller
  extends React.Component<ScrollerProps>
  implements ScrollerProps
{
  [x: string]: any;
  source: any;

  state: any = {
    source: [],
    scroll: 0,
    touchData: {
      yArr: [],
      startY: 0
    },
    value: null
  };

  constructor(props: ScrollerProps) {
    super(props);
    let defaults = {
      el: 'hour', // dom
      type: 'infinite', // infinite，normal
      count: 12, // items counts - divisible by 4 (count 20 = 5 items)
      sensitivity: 0.4, // sensitivity
      value: this.props.value,
      onChange: null,
      itemHeight: 30
    };

    this.options = Object.assign({}, defaults, props);
    this.options.count = this.options.count - (this.options.count % 4);
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 50; // scroll deceleration
    this.minV = Math.sqrt(1 / this.a); // Minimum initial velocity

    this.exceedA = 10; // Pass acceleration
    this.moveT = 0; // scroll tick

    this.parent = React.createRef();

    this.elems = {
      el: React.createRef(),
      circleList: null,
      circleItems: null, // list

      highlight: null,
      highlightList: null,
      highlightitems: null,
      highListItems: null // list
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null
    };
  }

  componentDidMount() {
    this._init();
  }

  componentDidUpdate() {
    console.log('updated');
  }

  shouldComponentUpdate(nextProps: any) {
    return false;
  }

  _init() {
    const value = this.value ? this.value : this.source[0].value;
    const selected = this.value
      ? this.source[this.source.findIndex((x: any) => x.value === this.value)]
      : this.source[0];
    this.setState({
      selected: selected,
      value: value,
      moving: false,
      scroll: this.value
        ? this.source.findIndex((x: any) => x.value === this.value)
        : 0,
      source: this.source
    });

    this.itemHeight =
      (this.elems.el.current.offsetHeight * 3) / this.options.count; // height of each
    this.itemAngle = 360 / this.options.count; // degrees of rotation between each item
    this.radius = this.itemHeight / Math.tan((this.itemAngle * Math.PI) / 180); // Ring radius
    // this.scroll = 0; // The unit is the height of an item (degrees)

    this._create(this.source);

    // let touchData = {
    //   startY: 0,
    //   yArr: []
    // };

    for (let eventName of ['_touchstart', '_touchmove', '_touchend']) {
      this.events[eventName.replace('_', '')] = ((
        eventName: keyof Scroller
      ) => {
        return (e: any) => {
          if (
            this.elems?.el &&
            (this.elems.el.current.contains(e.target) ||
              e.target === this.elems.el)
          ) {
            // e.preventDefault();
            if (this.state.source.length) {
              this[eventName](e);
            }
          }
        };
      })(eventName as keyof Scroller);
    }

    this.elems.el.current.addEventListener(
      'touchstart',
      this.events.touchstart
    );
    document.addEventListener('mousedown', this.events.touchstart);
    this.elems.el.current.addEventListener('touchend', this.events.touchend);
    document.addEventListener('mouseup', this.events.touchend);
    if (this.state.source.length) {
      // this.state.value = this.state.value !== null ? this.state.value : this.state.source[0].value;
      // this.setState((prev: any) => ({
      //   ...prev,
      //   value: this.state.value !== null ? this.state.value : this.state.source[0].value
      // }));
      this.select(value, true);
    }
  }

  async _touchstart(e: any) {
    this.elems.el.current.addEventListener('touchmove', this.events.touchmove);
    document.addEventListener('mousemove', this.events.touchmove);
    document.addEventListener('mouseout', this.events.touchend);
    let eventY = e.clientY || e.touches[0].clientY;
    // console.log(
    //   `scroll touchData:\n${JSON.stringify(this.state.touchData.touchScroll)}`
    // );
    await this.setState((prev: any) => ({
      ...prev,
      touchData: {
        startY: eventY,
        yArr: [[eventY, new Date().getTime()]],
        // touchScroll: (this.state.moving) ? prev.scroll : this.state.touchData.touchScroll
        touchScroll: prev.scroll
      }
    }));
    // console.log(`scroll start:\n${JSON.stringify(this.state)}`);
    await this._stop();
  }

  async _touchmove(e: any) {
    let eventY = e.clientY || e.touches[0].clientY;
    // touchData.yArr.push([eventY, new Date().getTime()]);
    this.setState((prev: any) => ({
      ...prev,
      touchData: {
        ...prev.touchData,
        yArr: [...prev.touchData.yArr, [eventY, new Date().getTime()]]
      }
    }));
    if (this.state.touchData.length > 5) {
      // touchData.unshift();
      this.setState((prev: any) => ({
        ...prev,
        touchData: {
          ...prev.touchData,
          yArr: prev.yArr.unshift()
        }
      }));
    }

    let scrollAdd = (this.state.touchData.startY - eventY) / this.itemHeight;
    let moveToScroll = scrollAdd + this.state.scroll;

    // When non-infinite scrolling, out of bounds makes scrolling difficult
    if (this.type === 'normal') {
      if (moveToScroll < 0) {
        moveToScroll *= 0.3;
      } else if (moveToScroll > this.state.source.length) {
        moveToScroll =
          this.state.source.length +
          (moveToScroll - this.state.source.length) * 0.3;
      }
      // console.log(moveToScroll);
    } else {
      moveToScroll = this._normalizeScroll(moveToScroll);
    }

    // touchData.touchScroll = this._moveTo(moveToScroll);
    this.setState((prev: any) => ({
      ...prev,
      touchData: {
        ...prev.touchData,
        touchScroll: this._moveTo(moveToScroll)
      }
    }));
    // console.log(`scroll move:\n${JSON.stringify(this.state)}`);
  }

  async _touchend(e: any) {
    this.elems.el.current.removeEventListener(
      'touchmove',
      this.events.touchmove
    );
    document.removeEventListener('mousemove', this.events.touchmove);
    document.removeEventListener('mouseout', this.events.touchend);

    if (this.state.touchData.yArr.length === 0) {
      return;
    }

    let v: number;

    if (this.state.touchData.yArr.length === 1) {
      v = 0;
    } else {
      let startTime =
        this.state.touchData.yArr[this.state.touchData.yArr.length - 2][1];
      let endTime =
        this.state.touchData.yArr[this.state.touchData.yArr.length - 1][1];
      let startY =
        this.state.touchData.yArr[this.state.touchData.yArr.length - 2][0];
      let endY =
        this.state.touchData.yArr[this.state.touchData.yArr.length - 1][0];

      // Start custom override
      // let i = 3;
      // while (startY - endY < (this.itemHeight) * 1000 && i < this.state.touchData.yArr.length) {
      //   startY = this.state.touchData.yArr[this.state.touchData.yArr.length - i][0];
      //   startTime = this.state.touchData.yArr[this.state.touchData.yArr.length - i][1];
      //   i++;
      // }
      // End custom

      // calculate speed
      v = (((startY - endY) / this.itemHeight) * 1000) / (endTime - startTime);
      let sign = v > 0 ? 1 : -1;

      v = Math.abs(v) > 30 ? 30 * sign : v;
    }

    // this.scroll = touchData.touchScroll;
    await this.setState((prev: any) => ({
      ...prev,
      scroll: this.state.touchData.touchScroll
    }));

    // fix processing bug
    this._animateMoveByInitV(v);
    // setTimeout(() => this._animateMoveByInitV(v), 10);
    // console.log(`scroll end:\n${JSON.stringify(this.state)}`);
  }

  _create(source: any) {
    if (!source.length) {
      return;
    }

    let template = `
      <div class="select-wrap">
        <ul class="select-options" style="transform: translate3d(0, 0, ${-this
          .radius}px) rotateX(0deg);">
          {{circleListHTML}}
          <!-- <li class="select-option">a0</li> -->
        </ul>
        <div class="highlight">
          <ul class="highlight-list">
            <!-- <li class="highlight-item"></li> -->
            {{highListHTML}}
          </ul>
        </div>
      </div>
    `;

    // source
    if (this.options.type === 'infinite') {
      let concatSource = [].concat(source);
      while (concatSource.length < this.halfCount) {
        concatSource = concatSource.concat(source);
      }
      source = concatSource;
    }
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.source = source;

    let sourceLength = source.length;

    // ring HTML
    let circleListHTML = '';
    for (let i = 0; i < source.length; i++) {
      circleListHTML += `<li class="select-option"
                    style="
                      top: ${this.itemHeight * -0.5}px;
                      height: ${this.itemHeight}px;
                      line-height: ${this.itemHeight}px;
                      transform: rotateX(${
                        -this.itemAngle * i
                      }deg) translate3d(0, 0, ${this.radius}px);
                    "
                    data-index="${i}"
                    >${source[i].text}</li>`;
    }

    // middle highlight HTML
    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`;
    }

    if (this.options.type === 'infinite') {
      // ring head tail
      for (let i = 0; i < this.quarterCount; i++) {
        // head
        circleListHTML =
          `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${
                          this.itemAngle * (i + 1)
                        }deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${-i - 1}"
                      >${source[sourceLength - i - 1].text}</li>` +
          circleListHTML;
        // tail
        circleListHTML += `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${
                          -this.itemAngle * (i + sourceLength)
                        }deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${i + sourceLength}"
                      >${source[i].text}</li>`;
      }

      // Highlight head and tail
      highListHTML =
        `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                          ${source[sourceLength - 1].text}
                      </li>` + highListHTML;
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`;
    }

    this.elems.el.current.innerHTML = template
      .replace('{{circleListHTML}}', circleListHTML)
      .replace('{{highListHTML}}', highListHTML);
    this.elems.circleList =
      this.elems.el.current.querySelector('.select-options');
    this.elems.circleItems =
      this.elems.el.current.querySelectorAll('.select-option');

    this.elems.highlight = this.elems.el.current.querySelector('.highlight');
    this.elems.highlightList =
      this.elems.el.current.querySelector('.highlight-list');
    this.elems.highlightitems =
      this.elems.el.current.querySelectorAll('.highlight-item');

    if (this.type === 'infinite') {
      this.elems.highlightList.style.top = -this.itemHeight + 'px';
    }

    this.elems.highlight.style.height = this.itemHeight + 'px';
    this.elems.highlight.style.lineHeight = this.itemHeight + 'px';
  }

  /**
   * scroll imitation，eg source.length = 5 scroll = 6.1
   * after modulo normalizedScroll = 1.1
   * @param {init} scroll
   * @return result of normalizedScroll
   */
  _normalizeScroll(scroll: number) {
    let normalizedScroll = scroll; // rounding removes animation

    if (this.type !== 'infinite') {
      if (normalizedScroll < 0) {
        return 0;
      }
      if (normalizedScroll > this.state.source.length - 1) {
        return this.state.source.length - 1;
      }
    }

    while (normalizedScroll < 0) {
      normalizedScroll += this.state.source.length;
    }
    normalizedScroll = normalizedScroll % this.state.source.length;
    return normalizedScroll;
  }

  /**
   * Target scroll，No animation
   * @param {init} scroll
   * @return the scroll after the specified normalizel
   */
  _moveTo(scroll: number) {
    if (this.type === 'infinite') {
      scroll = this._normalizeScroll(scroll);
    }

    if (this.elems && this.elems.circleList) {
      this.elems.circleList.style.transform = `translate3d(0, 0, ${-this
        .radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    }
    if (this.elems && this.elems.highlightList) {
      this.elems.highlightList.style.transform = `translate3d(0, ${
        -scroll * this.itemHeight
      }px, 0)`;
    }

    this.elems?.circleItems &&
      [...this.elems.circleItems].forEach((itemElem) => {
        if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
          itemElem.style.visibility = 'hidden';
        } else {
          itemElem.style.visibility = 'visible';
        }
      });

    return scroll;
  }

  /**
   * Scroll with initial velocity initV
   * @param {init} initV， initV reset
   * to ensure scrolling to an integer scroll based on acceleration (guaranteed to locate a selected value by scrolling)
   */
  async _animateMoveByInitV(initV: number) {
    // console.log(initV);

    let initScroll;
    let finalScroll;

    let totalScrollLen;
    let a;
    let t;

    if (this.type === 'normal') {
      if (
        this.state.scroll < 0 ||
        this.state.scroll > this.state.source.length - 1
      ) {
        a = this.exceedA;
        initScroll = this.state.scroll;
        finalScroll = this.state.scroll < 0 ? 0 : this.state.source.length - 1;
        totalScrollLen = initScroll - finalScroll;

        t = Math.sqrt(Math.abs(totalScrollLen / a));
        initV = a * t;
        initV = this.state.scroll > 0 ? -initV : initV;
        await this._animateToScroll(initScroll, finalScroll, t);
      } else {
        initScroll = this.state.scroll;
        a = initV > 0 ? -this.a : this.a; // Deceleration or acceleration
        t = Math.abs(initV / a); // time it takes to slow down to 0
        totalScrollLen = initV * t + (a * t * t) / 2; // total roll length
        finalScroll = Math.round(this.state.scroll + totalScrollLen); // Rounded to ensure accurate final scroll is an integer
        finalScroll =
          finalScroll < 0
            ? 0
            : finalScroll > this.state.source.length - 1
            ? this.state.source.length - 1
            : finalScroll;

        totalScrollLen = finalScroll - initScroll;
        t = Math.sqrt(Math.abs(totalScrollLen / a));
        await this._animateToScroll(
          this.state.scroll,
          finalScroll,
          t,
          'easeOutQuart'
        );
      }
    } else {
      initScroll = this.state.scroll;

      a = initV > 0 ? -this.a : this.a; // deceleration acceleration
      t = Math.abs(initV / a); // time it takes to slow down to 0
      totalScrollLen = initV * t + (a * t * t) / 2; // total roll length
      finalScroll = Math.round(this.state.scroll + totalScrollLen); // Rounded to ensure accurate final scroll is an integer
      await this._animateToScroll(
        this.state.scroll,
        finalScroll,
        t,
        'easeOutQuart'
      );
    }

    // await this._animateToScroll(this.scroll, finalScroll, initV, 0);

    // this._selectByScroll(this.state.scroll);
    await this._selectByScroll(this.state.scroll);
  }

  _animateToScroll(
    initScroll: number,
    finalScroll: number,
    t: number,
    easingName = 'easeOutQuart'
  ) {
    if (initScroll === finalScroll || t === 0) {
      this._moveTo(initScroll);
      return;
    }

    let start = new Date().getTime() / 1000;
    let pass = 0;
    let totalScrollLen = finalScroll - initScroll;

    // console.log(initScroll, finalScroll, initV, finalV, a);
    return new Promise((resolve: any, reject: any) => {
      // this.moving = true;
      this.setState((prev: any) => ({
        ...prev,
        moving: true
      }));
      let tick = () => {
        pass = new Date().getTime() / 1000 - start;

        if (pass < t) {
          // this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
          this.setState((prev: any) => ({
            ...prev,
            scroll: this._moveTo(
              initScroll + easing[easingName](pass / t) * totalScrollLen
            ),
            moveT: requestAnimationFrame(tick)
          }));
        } else {
          resolve();
          this._stop();
          // this.scroll = this._moveTo(initScroll + totalScrollLen);

          this.setState((prev: any) => ({
            ...prev,
            scroll: this._moveTo(initScroll + totalScrollLen)
          }));
        }
      };
      tick();
    });
  }

  async _stop() {
    await this.setState((prev: any) => ({
      ...prev,
      moving: false
    }));
    cancelAnimationFrame(this.state.moveT);
  }

  async _selectByScroll(scroll: number, validChange = true) {
    let newScroll = Math.round(this._normalizeScroll(scroll)) || 0;
    if (newScroll > this.state.source.length - 1) {
      newScroll = this.state.source.length - 1;
    }
    this._moveTo(newScroll);
    this.setState((prev: any) => ({
      ...prev,
      selected: this.state.source[newScroll],
      value: this.state.source[newScroll].value,
      scroll: newScroll
    }));

    if (validChange) {
      this.onChange && this.onChange(this.state.source[newScroll].value);
    }
  }

  async updateSource(source: any) {
    this._create(source);

    if (!this.state.moving) {
      await this._selectByScroll(this.state.scroll);
    }
  }

  async select(value: any, noAnimation: boolean = false) {
    for (let i = 0; i < this.state.source.length; i++) {
      if (this.state.source[i].value === value) {
        window.cancelAnimationFrame(this.moveT);
        // this.scroll = this._moveTo(i);
        let initScroll = this._normalizeScroll(this.state.scroll);
        let finalScroll = i;
        let t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.a));
        await this._animateToScroll(
          initScroll,
          finalScroll,
          noAnimation ? 0 : t
        );
        this._selectByScroll(i, !noAnimation);
        return;
      }
    }
    throw new Error(
      `can not select value: ${value}, ${value} match nothing in current source`
    );
  }

  destroy() {
    this._stop();
    // document event unbinding
    for (let eventName in this.events) {
      this.elems.el.current.removeEventListener(
        'eventName',
        this.events[eventName]
      );
    }
    document.removeEventListener('mousedown', this.events['touchstart']);
    document.removeEventListener('mousemove', this.events['touchmove']);
    document.removeEventListener('mouseup', this.events['touchend']);
    document.removeEventListener('mouseleave', this.events['touchend']);
    // element removal
    this.elems.el.current.innerHTML = '';
    this.elems = null;
  }

  componentWillUnmount() {
    this.destroy();
  }

  render() {
    return (
      <div
        className={['spin-selector', this.selectorClass].join(' ')}
        ref={this.parent}
      >
        <div ref={this.elems.el} />
      </div>
    );
  }
}
