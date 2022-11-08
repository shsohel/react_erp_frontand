import sliderImage1 from '@src/assets/images/elements/placeholder-image.jpg';
import { useState } from 'react';
import { Carousel, CarouselControl, CarouselItem } from 'reactstrap';
import { baseUrl, localUrl } from '../../../../../utility/enums';


const photos = [
    {
        fileUrl: sliderImage1,
        id: 1,
        header: 'Slide 1',
        caption: ''
    }
];

const SetStylePhotoDetails = ( { photoData } ) => {
    const [activeIndex, setActiveIndex] = useState( 0 );
    const [animating, setAnimating] = useState( 0 );

    const onExiting = () => {
        setAnimating( true );
    };

    const onExited = () => {
        setAnimating( false );
    };

    const next = () => {
        if ( animating ) return;
        const nextIndex = activeIndex === ( photoData?.length ? photoData.length - 1 : photos.length - 1 ) ? 0 : activeIndex + 1;
        setActiveIndex( nextIndex );
    };

    const previous = () => {
        if ( animating ) return;
        const nextIndex = activeIndex === 0 ? ( photoData?.length ? photoData.length - 1 : photos.length - 1 ) : activeIndex - 1;
        setActiveIndex( nextIndex );
    };


    const photoArrays = ( photoData?.length > 0 ? photoData : photos );
    const fileBasePath = ( photoData?.length > 0 ? baseUrl : localUrl );

    const slides = photoArrays?.map( item => {
        return (
            <CarouselItem onExiting={onExiting} onExited={onExited} key={item.id}>
                <div className="image-main-div" >
                    <img src={`${fileBasePath}/${item.fileUrl}`} alt={item.id} className='image-carousel-details' />
                </div>
            </CarouselItem>
        );
    } );
    return (
        <>
            <Carousel interval={false} slide={false} activeIndex={activeIndex} next={next} previous={previous} keyboard={true}>
                {slides}
                <CarouselControl direction='prev' directionText='Previous' onClickHandler={previous} />
                <CarouselControl direction='next' directionText='Next' onClickHandler={next} />
            </Carousel>
        </>
    );
};

export default SetStylePhotoDetails;
