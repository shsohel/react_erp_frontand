import sliderImage1 from '@src/assets/images/elements/placeholder-image.jpg';
// import '@src/assets/scss/mechandising/carousel-hover.scss';
import { useState } from 'react';
import { CheckSquare, Eye, Square, Trash2, Upload } from 'react-feather';
import { useDispatch } from 'react-redux';
import { Button, ButtonGroup, Carousel, CarouselControl, CarouselItem } from 'reactstrap';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { baseUrl, confirmObj, localUrl } from '../../../../../utility/enums';
import SetStylePhotoUploadModal from './SetStylePhotoUploadModal';


const defaultPhotos = [
    {
        fileUrl: sliderImage1,
        id: 1,
        header: 'Slide 1',
        caption: ''
    }
];

const StylePhoto = ( { photoData, handlePhotoRemove, handleDefaultPhotoOnCarousel, handlePhotoAddToTable, handlePhotoRemoveFromTable, handleDefaultPhotoOnTable, photos, handlePhotoUploadToCarousel } ) => {
    const dispatch = useDispatch();
    // const { singleStyleImages } = useSelector( ( { styles } ) => styles );
    const [openPhotoUploadModal, setOpenPhotoUploadModal] = useState( false );

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
        const nextIndex = activeIndex === ( photoData.length ? photoData.length - 1 : defaultPhotos.length - 1 ) ? 0 : activeIndex + 1;
        setActiveIndex( nextIndex );
    };

    const previous = () => {
        if ( animating ) return;
        const nextIndex = activeIndex === 0 ? ( photoData.length ? photoData.length - 1 : defaultPhotos.length - 1 ) : activeIndex - 1;
        setActiveIndex( nextIndex );
    };

    const handleRemovePhotoWithIndex = ( id, generatedName ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const foundId = photoData.findIndex( i => i.id === id );
                if ( foundId === 0 ) {
                    handlePhotoRemove( generatedName );
                    setActiveIndex( foundId );
                } else {
                    handlePhotoRemove( generatedName );
                    previous();
                }
            }
        } );
    };


    const handlePhotoUploadModal = () => {
        setOpenPhotoUploadModal( !openPhotoUploadModal );
    };

    const photoArrays = ( photoData.length > 0 ? photoData : defaultPhotos );
    const fileBasePath = ( photoData.length > 0 ? baseUrl : localUrl );

    const slides = photoArrays?.map( item => {
        return (
            <CarouselItem onExiting={onExiting} onExited={onExited} key={item.id}>
                <div className="image-main-div" >
                    <img src={`${item.fileUrl}`} alt={item.id} className='image-carousel' />
                    <div className="middle">
                        <ButtonGroup className='mb-1 action-btn'>
                            <Button.Ripple
                                onClick={() => { handleDefaultPhotoOnCarousel( item.generatedName ); }}
                                className='btn-icon'
                                color='flat-success'
                                size="sm"
                            >
                                {item.isDefault ? <CheckSquare size={16} /> : <Square color='grey' size={16} />}
                            </Button.Ripple>

                            <Button.Ripple
                                onClick={() => { handleRemovePhotoWithIndex( item.id, item.generatedName ); }}
                                className='btn-icon'
                                color='flat-danger'
                                size="sm"
                            >
                                <Trash2 size={16} />
                            </Button.Ripple>
                            <Button.Ripple
                                onClick={() => { handlePhotoUploadModal(); }}
                                className='btn-icon'
                                color='flat-success'
                                size="sm"
                            >
                                <Upload size={16} />
                            </Button.Ripple>
                            <Button.Ripple
                                onClick={( e ) => { e.preventDefault(); }}
                                className='btn-icon'
                                color='flat-success'
                                size="sm"
                            >
                                <Eye size={16} />
                            </Button.Ripple>
                        </ButtonGroup>
                    </div>
                </div>
            </CarouselItem>
        );
    } );
    return (
        <>
            <Carousel interval={false} slide={false} activeIndex={activeIndex} next={next} previous={previous} keyboard={true} className="carousel-main-div">
                {slides}
                <CarouselControl direction='prev' directionText='Previous' onClickHandler={previous} />
                <CarouselControl direction='next' directionText='Next' onClickHandler={next} />
            </Carousel>
            <SetStylePhotoUploadModal
                openModal={openPhotoUploadModal}
                setOpenModal={setOpenPhotoUploadModal}
                handlePhotoAddToTable={handlePhotoAddToTable}
                photos={photos}
                handlePhotoRemoveFromTable={handlePhotoRemoveFromTable}
                handleDefaultPhotoOnTable={handleDefaultPhotoOnTable}
                handlePhotoUploadToCarousel={handlePhotoUploadToCarousel}
            />
        </>
    );
};

export default StylePhoto;
