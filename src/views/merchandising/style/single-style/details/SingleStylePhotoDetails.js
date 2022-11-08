import sliderImage1 from '@src/assets/images/elements/placeholder-image.jpg';
// import '@src/assets/scss/mechandising/carousel-hover.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonGroup, Carousel, CarouselControl, CarouselItem } from 'reactstrap';
import { baseUrl, localUrl } from '../../../../../utility/enums';
const defaultPhotos = [
    {
        fileUrl: sliderImage1,
        id: 1,
        rowId: 1,
        header: 'Slide 1',
        caption: '',
        extension: ".jpg",
        generatedName: "reekd045",
        isDefault: false,
        name: "",
        type: "IMAGE"
    }
];

const SingleStylePhotoDetails = () => {
    const {
        singleStyleBasicInfo
    } = useSelector( ( { styles } ) => styles );
    const [activeIndex, setActiveIndex] = useState( 0 );
    const [animating, setAnimating] = useState( 0 );
    const photoData = singleStyleBasicInfo?.imagesUrls ?? [];

    useEffect( () => {
        const isDefaultPhotoExisting = photoData.some( photo => photo.isDefault );
        setActiveIndex( ( photoData.length > 0 && isDefaultPhotoExisting ) ? photoData.findIndex( ( item ) => item.isDefault ) : 0 );
    }, [photoData] );


    const onExiting = () => {
        setAnimating( true );
    };

    const onExited = () => {
        setAnimating( false );
    };

    const next = () => {
        if ( animating ) return;
        const nextIndex = activeIndex === ( photoData.length ? photoData.length - 1 : defaultPhotos.length - 1 ) ? 0 : activeIndex + 1;
        setActiveIndex( nextIndex );
    };

    const previous = () => {
        console.log( 'previous' );
        if ( animating ) return;
        const nextIndex = activeIndex === 0 ? ( photoData.length ? photoData.length - 1 : defaultPhotos.length - 1 ) : activeIndex - 1;
        setActiveIndex( nextIndex );
    };


    const photoArrays = ( photoData.length > 0 ? photoData : defaultPhotos );
    const fileBasePath = ( photoData.length > 0 ? baseUrl : localUrl );
    //console.log( photoArrays.sort( ( a, b ) => ( a.isDefault - b.isDefault ) ) );

    console.log( photoArrays );
    const slides = photoArrays?.map( item => {
        return (
            <CarouselItem onExiting={onExiting} onExited={onExited} key={item.rowId}>
                <div className="image-main-div" >
                    <img src={`${item.fileUrl}`} alt={item.name} className='image-carousel' />
                    <div className="middle">
                        <ButtonGroup className='mb-1 action-btn'>

                            {/* <Button.Ripple
                                onClick={( e ) => { e.preventDefault(); }}
                                className='btn-icon'
                                color='flat-success'
                                size="sm"
                            >
                                <Eye size={16} />
                            </Button.Ripple> */}
                        </ButtonGroup>
                    </div>
                </div>
            </CarouselItem>
        );
    } );
    return (
        <>
            <Carousel
                interval={false}
                slide={false}
                activeIndex={activeIndex}
                next={next}
                previous={previous}
                keyboard={true}
                className="carousel-main-div"
            >
                {
                    photoArrays.length > 0 &&
                    slides
                }
                <CarouselControl direction='prev' directionText='Previous' onClickHandler={() => { previous(); }} />
                <CarouselControl direction='next' directionText='Next' onClickHandler={() => { next(); }} />
            </Carousel>


        </>
    );
};

export default SingleStylePhotoDetails;
