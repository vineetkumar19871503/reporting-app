
import React, { Component } from 'react';
import Header from '../../views/HomeLayout/Header';
import './styles.css';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
} from 'reactstrap';
const items = [
    {
        src: '/assets/img/slider/1.jpg',
        altText: '',
        caption: ''
    },
    {
        src: '/assets/img/slider/2.jpg',
        altText: '',
        caption: ''
    }
    /*,
    {
        src: '/assets/img/slider/3.jpg',
        altText: '',
        caption: ''
    },
    {
        src: '/assets/img/slider/4.jpg',
        altText: '',
        caption: ''
    },
    {
        src: '/assets/img/slider/5.jpg',
        altText: '',
        caption: ''
    },
    {
        src: '/assets/img/slider/6.jpg',
        altText: '',
        caption: ''
    },
    {
        src: '/assets/img/slider/7.jpg',
        altText: '',
        caption: ''
    }
    */
];
export default class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    componentDidMount() {
        document.title = "SENSA NETWORKING - HOME";
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    render() {
        const { activeIndex } = this.state;

        const slides = items.map((item) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={item.src}
                >
                    <img src={item.src} alt={item.altText} />
                    <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
                </CarouselItem>
            );
        });
        return (
            <div className="main">
                <Header activeClass="home" />
                <Carousel
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous}
                    className="txt-align-center"
                >
                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                </Carousel>
            </div>
        )
    }
}
