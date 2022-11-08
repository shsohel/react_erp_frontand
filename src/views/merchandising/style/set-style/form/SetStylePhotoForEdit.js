import sliderImage1 from '@src/assets/images/elements/placeholder-image.jpg';
// import '@src/assets/scss/mechandising/carousel-hover.scss';
import { useState } from 'react';
import { CheckSquare, Square, Trash2 } from 'react-feather';
import { Button, ButtonGroup, Carousel, CarouselControl, CarouselItem } from 'reactstrap';
import { baseUrl, localUrl } from '../../../../../utility/enums';


const photos = [
    {
        fileUrl: sliderImage1,
        id: 1,
        header: 'Slide 1',
        caption: ''
    }
];

const SetStylePhotoForEdit = ( { photoData, handleRemovePhoto, handleDefaultPhotoOnCarousel } ) => {
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
        const nextIndex = activeIndex === ( photoData.length ? photoData.length - 1 : photos.length - 1 ) ? 0 : activeIndex + 1;
        setActiveIndex( nextIndex );
    };

    const previous = () => {
        if ( animating ) return;
        const nextIndex = activeIndex === 0 ? ( photoData.length ? photoData.length - 1 : photos.length - 1 ) : activeIndex - 1;
        setActiveIndex( nextIndex );
    };

    const handleRemovePhotoWithIndex = ( id ) => {
        const foundId = photoData.findIndex( i => i.id === id );
        if ( foundId === 0 ) {
            handleRemovePhoto( id );
            setActiveIndex( foundId );
        } else {
            handleRemovePhoto( id );
            previous();
        }
    };

    const photoArrays = ( photoData.length > 0 ? photoData : photos );
    const fileBasePath = ( photoData.length > 0 ? baseUrl : localUrl );

    const slides = photoArrays?.map( item => {
        return (
            <CarouselItem onExiting={onExiting} onExited={onExited} key={item.id}>
                <div className="image-main-div" >
                    <img src={`${fileBasePath}/${item.fileUrl}`} alt={item.id} className='image-carousel' />
                    {
                        photoData.length > 0 &&
                        ( <div className="middle">
                            <ButtonGroup className='mb-1 action-btn'>
                                <Button.Ripple
                                    onClick={() => { handleDefaultPhotoOnCarousel( item.id ); }}
                                    className='btn-icon'
                                    color='flat-success'
                                    size="sm"
                                >
                                    {item.isDefault ? <CheckSquare size={16} /> : <Square color='grey' size={16} />}
                                </Button.Ripple>

                                <Button.Ripple
                                    onClick={() => { handleRemovePhotoWithIndex( item.id ); }}
                                    className='btn-icon'
                                    color='flat-danger'
                                    size="sm"
                                >
                                    <Trash2 size={16} />
                                </Button.Ripple>
                            </ButtonGroup>
                        </div> )
                    }
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

export default SetStylePhotoForEdit;
