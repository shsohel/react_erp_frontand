import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/merchandising-core.scss';
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import classnames from 'classnames';
import { Fragment, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Check, UploadCloud, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import AutoProgress from '../../../../../utility/custom/AutoProgress';
import { selectDocCategory, selectProductionProcess, selectSampleAssignee, selectYear, status as insertStatus, styleStatus } from "../../../../../utility/enums";
import { createOption, formatDate, isObjEmpty, randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { getCascadeDropDownBuyerAgents } from '../../../buyer-agent/store/actions';
import { getCascadeDropDownBuyerDepartments } from '../../../buyer-department/store/actions';
import { getCascadeDropDownBuyerProductDevelopers } from '../../../buyer-product-developer/store/actions';
// import BuyerAddForm from '../../../buyer/form/BuyerAddForm';
import { getBuyersStyles, getDropDownBuyers } from '../../../buyer/store/actions';
import { getDropDownSeasons } from '../../../season/store/actions';
import { addSetStyle, bindSetStyleBasicInfo, getSetStyleById, getUploadedFileBySetStyleId, getUploadedImagesBySetStyleId, setStyleFileDelete, setStyleFileUpload, setStylePhotoUpload } from '../store/actions';
import SetStyleDetailsAddForm from './SetStyleDetailsAddForm';
import SetStyleDocumentTable from "./SetStyleDocumentTable";
import SetStylePhoto from "./SetStylePhoto";

const Label2 = () => (
    <Fragment>
        <span className='switch-icon-left'>
            <Check size={14} />
        </span>
        <span className='switch-icon-right'>
            <X size={14} />
        </span>
    </Fragment>
);


const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'setStyleList',
        name: 'List',
        link: "/set-styles",
        isActive: false
    },
    {
        id: 'setStyle',
        name: 'Set Style',
        link: "#",
        isActive: true
    }
];
const initialFilesUpload = {
    id: 0,
    name: '',
    type: '',
    file: null,
    uploadDate: '',
    documentCategory: null
};

const SetStyleAddFormNew = () => {
    const { replace, push } = useHistory();

    const dispatch = useDispatch();
    const {
        lastSetStyleId,
        isSetStylePhotoUploadComplete,
        isSetStyleFileUploadComplete,
        setStyleFiles,
        setStyleBasicInfo,
        setStyleImages } = useSelector( ( { setStyles } ) => setStyles );

    //   console.log( 'setStyleBasicInfo', JSON.stringify( setStyleBasicInfo, null, 2 ) );


    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { dropDownBuyerDepartments } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const { dropDownBuyerAgents } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const { dropDownProductDevelopers } = useSelector( ( { productDevelopers } ) => productDevelopers );

    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );


    const [season, setSeason] = useState( null );


    const [sampleAssignee, setSampleAssignee] = useState( null );
    const [productionProcess, setProductionProcess] = useState( null );
    ///For Document Upload
    const [uploadFiles, setUploadFiles] = useState( initialFilesUpload );

    ///For Photo Upload
    const [photos, setPhotos] = useState( [] );


    const [sizeGroups, setSizeGroups] = useState( null );
    const [colors, setColors] = useState( null );
    const [styleCombination, setStyleCombination] = useState( [
        {
            fieldId: randomIdGenerator(),
            styleNo: null,
            size: null,
            color: null,
            quantity: ''
        }
    ] );


    useEffect( () => {
        dispatch( getDropDownSeasons() );
        dispatch( getDropDownBuyers() );
        //   dispatch( getDropDownSizeGroups() );
        //  dispatch( getDropDownColors() );
    }, [] );

    // useEffect( () => {
    //     dispatch( getUploadedImagesBySetStyleId( lastSetStyleId ) );
    //     dispatch( getUploadedFileBySetStyleId( lastSetStyleId ) );
    // }, [dispatch, lastSetStyleId] );


    const handleInputOnChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedObj = {
            ...setStyleBasicInfo,
            [name]: value
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    //Function for Document Upload Start
    const handleFileUpload = async files => {
        const singleFile = files[0];
        setUploadFiles( {
            ...uploadFiles,
            id: randomIdGenerator(),
            name: singleFile.name,
            type: singleFile.type,
            file: singleFile,
            uploadDate: formatDate( new Date() )
        } );
    };


    const handleAddFileToTable = () => {
        const obj = {
            category: uploadFiles.documentCategory,
            file: uploadFiles.file
        };
        dispatch( setStyleFileUpload( obj, lastSetStyleId ) );
        setUploadFiles( initialFilesUpload );
    };

    const handleFileRemoveFromTable = ( fileId ) => {
        dispatch( setStyleFileDelete( fileId, lastSetStyleId ) );
        // const files = [...filesTable];
        // files.splice(
        //     files.findIndex( value => value.id === fileId ), 1 );
        // setFilesTable( files );
    };

    const { getRootProps, getInputProps } = useDropzone( {
        accept: 'application/pdf, .pdf, .doc, .docx, .xls, .csv, .xlsx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        maxFiles: 1,
        multiple: false,
        maxSize: 2097152,
        onDrop: ( acceptedFiles, fileRejections ) => {
            if ( acceptedFiles.length ) {
                handleFileUpload( acceptedFiles );
            } else {
                const message = fileRejections[0]?.errors[0]?.message;
                const fileError = fileRejections[0].errors[0].code === "file-too-large";
                if ( fileError ) {
                    notify( 'error', 'File size must be within 2 MB.' );
                } else {
                    notify( 'error', `${message}` );

                }
            }
        }
    } );

    const handleSeasonCreate = ( newValue ) => {
        baseAxios.post( `${merchandisingApi.season.add_season}`, { name: newValue, description: newValue } ).then( res => {
            if ( res.status === insertStatus.success ) {
                const newOption = createOption( newValue, res.data );
                setSeason( newOption );
                dispatch( getDropDownSeasons() );
                notify( 'success', 'The Season has been added Successfully!' );
            } else {
                notify( 'error', 'The Season has been added Failed!' );
            }
        } );
    };


    //Buyer Drop Down Control Start
    const handleBuyerChange = ( data ) => {
        if ( data ) {
            dispatch( getCascadeDropDownBuyerDepartments( data.value ) );
            dispatch( getCascadeDropDownBuyerAgents( data.value ) );
            dispatch( getCascadeDropDownBuyerProductDevelopers( data.value ) );
            dispatch( getBuyersStyles( data?.value ) );
            const updatedObj = {
                ...setStyleBasicInfo,
                buyer: data,
                agent: null,
                buyerDepartment: null,
                buyerProductDeveloper: null
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );

        } else {
            const updatedObj = {
                ...setStyleBasicInfo,
                buyer: null,
                agent: null,
                buyerDepartment: null,
                buyerProductDeveloper: null
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
            dispatch( getCascadeDropDownBuyerDepartments( null ) );
            dispatch( getCascadeDropDownBuyerAgents( null ) );
            dispatch( getCascadeDropDownBuyerProductDevelopers( null ) );
            dispatch( getBuyersStyles( null ) );
        }
    };

    const handleSeasonDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            season: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );

    };

    const handleYearDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            year: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );

    };


    const handleBuyerDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            buyerDepartment: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleAgentDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            agent: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleProductDevDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            buyerProductDeveloper: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleStatusDropdownChange = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            status: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };


    const handleAgentDropdownOnFocus = ( agents ) => {
        if ( !agents.length ) {
            dispatch( getCascadeDropDownBuyerAgents( setStyleBasicInfo.buyer?.value ) );
        }

    };

    const handleBuyerDepartmentDropdownOnFocus = ( buyerDepartments ) => {
        if ( !buyerDepartments.length ) {
            dispatch( getCascadeDropDownBuyerDepartments( setStyleBasicInfo.buyer?.value ) );
        }
    };

    const handleProductDeveloperDropdownOnFocus = ( developer ) => {
        if ( !developer.length ) {
            dispatch( getCascadeDropDownBuyerProductDevelopers( setStyleBasicInfo.buyer?.value ) );
        }
    };


    const handlePhotoAddToTable = ( photosFiles ) => {
        //For Show On Table
        const mutedPhotoArray = photosFiles.map( photo => ( {
            id: randomIdGenerator(),
            url: URL.createObjectURL( photo ),
            photoName: photo.name,
            isDefault: false,
            photo
        } ) );
        setPhotos( [...photos, ...mutedPhotoArray] );
    };

    const handlePhotoUploadToCarousel = () => {
        if ( photos.length > 0 ) {
            dispatch(
                setStylePhotoUpload( photos )
            );
        }

        setPhotos( [] );
    };

    const handlePhotoRemoveFromTable = photoId => {
        const exitPhotos = [...photos];
        exitPhotos.splice(
            exitPhotos.findIndex( value => value.id === photoId ),
            1
        );
        setPhotos( exitPhotos );
    };

    const handleUploadPhotoRemoveFromCarousel = ( generatedName ) => {
        const updatedImage = setStyleBasicInfo.images.filter( img => img.generatedName !== generatedName );
        const updatedImageUrl = setStyleBasicInfo.imagesUrls.filter( img => img.generatedName !== generatedName );
        const updatedObj = {
            ...setStyleBasicInfo,
            images: updatedImage,
            imagesUrls: updatedImageUrl
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleDefaultPhotoOnTable = ( photoId ) => {
        setPhotos(
            photos.map(
                ( photo ) => ( photo.id === photoId ? { ...photo, isDefault: !photo.isDefault } : { ...photo, isDefault: false } )
            )
        );

    };
    const handleDefaultPhotoOnCarousel = ( generatedName ) => {
        const updatedImage = setStyleBasicInfo.images.map( img => {
            if ( generatedName === img.generatedName ) {
                img['isDefault'] = true;
            } else {
                img['isDefault'] = false;
            }
            return img;
        } );
        const updatedImageUrl = setStyleBasicInfo.imagesUrls.map( img => {
            if ( generatedName === img.generatedName ) {
                img['isDefault'] = true;
            } else {
                img['isDefault'] = false;
            }
            return img;
        } );
        const updatedObj = {
            ...setStyleBasicInfo,
            images: updatedImage,
            imagesUrls: updatedImageUrl
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const { register, errors, handleSubmit } = useForm();


    const onSubmit = ( values ) => {

        const styleDetails = setStyleBasicInfo?.styleCombination.map( sd => (
            {
                styleId: sd.styleNo?.value,
                styleNo: sd.styleNo?.label,
                sizeId: !setStyleBasicInfo.isSizeSpecific ? null : sd.size?.value,
                size: !setStyleBasicInfo.isSizeSpecific ? null : sd.size?.label,
                // colorId: !setStyleBasicInfo.isColorSpecific ? setStyleBasicInfo?.colors.value : sd.color?.value,
                colorId: !setStyleBasicInfo.isColorSpecific ? null : sd.color?.value,
                // color: !setStyleBasicInfo.isColorSpecific ? setStyleBasicInfo?.colors.label : sd.color?.label,
                color: !setStyleBasicInfo.isColorSpecific ? null : sd.color?.label,
                quantity: sd.quantity
            } ) );

        const obj = {
            styleNo: setStyleBasicInfo.styleNo,
            season: setStyleBasicInfo?.season?.label,
            year: setStyleBasicInfo?.year?.value,
            buyerId: setStyleBasicInfo?.buyer?.value,
            buyerName: setStyleBasicInfo?.buyer?.label,
            agentId: setStyleBasicInfo?.agent?.value,
            agentName: setStyleBasicInfo?.agent?.label,
            buyerProductDeveloperId: setStyleBasicInfo?.buyerProductDeveloper?.value,
            buyerProductDeveloper: setStyleBasicInfo?.buyerProductDeveloper?.label,
            buyerDepartmentId: setStyleBasicInfo?.buyerDepartment?.value,
            buyerDepartment: setStyleBasicInfo?.buyerDepartment?.label,
            remarks: setStyleBasicInfo?.remarks,
            description: setStyleBasicInfo?.description,
            additionalInstruction: setStyleBasicInfo?.additionalInstruction,
            status: setStyleBasicInfo?.status?.label,
            isSizeSpecific: setStyleBasicInfo?.isSizeSpecific,
            isColorSpecific: setStyleBasicInfo?.isColorSpecific,
            styleDetails,
            images: setStyleBasicInfo?.images
        };

        console.log( JSON.stringify( obj, null, 2 ) );


        if ( isObjEmpty( errors ) ) {
            if ( setStyleBasicInfo.isColorSpecific || setStyleBasicInfo.isSizeSpecific ) {
                dispatch( addSetStyle( obj ) );
            } else {
                notify( 'error', 'Please define at least Size or Color Specification' );
            }
        }
    };

    const handleSizeSpecification = ( e ) => {
        const { checked } = e.target;
        if ( checked ) {
            setSizeGroups( null );
            // setColorSizeSpecification( {দ
            //     ...colorSizeSpecification,
            //     sizeSpecific: checked
            // } );
            const updatedObj = {
                ...setStyleBasicInfo,
                isSizeSpecific: checked
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
        } else {
            // for ( let index = 0; index < styleCombination.length; index++ ) {
            //     styleCombination[index].size = null;
            // }
            const updatedSizeData = setStyleBasicInfo?.styleCombination.map( cc => ( { ...cc, size: null } ) );

            // setColorSizeSpecification( {
            //     ...colorSizeSpecification,
            //     sizeSpecific: checked
            // } );
            const updatedObj = {
                ...setStyleBasicInfo,
                isSizeSpecific: checked,
                styleCombination: updatedSizeData
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
        }
    };
    const handleColorSpecification = ( e ) => {
        const { checked } = e.target;
        if ( checked ) {
            setColors( null );
            // setColorSizeSpecification( {
            //     ...colorSizeSpecification,
            //     colorSpecific: checked
            // } );
            const updatedObj = {
                ...setStyleBasicInfo,
                isColorSpecific: checked,
                colors: null
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
        } else {
            const updatedColorData = setStyleBasicInfo?.styleCombination.map( cc => ( { ...cc, color: null } ) );
            const updatedObj = {
                ...setStyleBasicInfo,
                isColorSpecific: checked,
                styleCombination: updatedColorData
            };
            dispatch( bindSetStyleBasicInfo( updatedObj ) );
        }
    };
    const handleColorDropDown = ( data ) => {
        const updatedObj = {
            ...setStyleBasicInfo,
            colors: data
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };
    const handleCancel = () => {
        replace( '/set-styles' );
        dispatch( getSetStyleById( null ) );
        dispatch( getUploadedImagesBySetStyleId( null ) );
        dispatch( getUploadedFileBySetStyleId( null ) );
    };


    return (
        <div>
            <Card className=" mt-3">

                <CardBody>
                    <Form onSubmit={handleSubmit( onSubmit )}>
                        <ActionMenu breadcrumb={breadcrumb} title='New Set Style' >
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="primary"
                                    type="submit"
                                    disabled={!!lastSetStyleId}
                                >Save</NavLink>
                            </NavItem>

                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="secondary"
                                    onClick={() => { handleCancel(); }}
                                >
                                    Cancel
                                </NavLink>
                            </NavItem>
                        </ActionMenu>
                        <Row >
                            <Col>
                                <div className='divider divider-left'>
                                    <div className='divider-text text-secondary font-weight-bolder '>Set Style Information</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row >
                                        <Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='styleNoId'> Buyer Style NO</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='styleNo'
                                                                        type='text'
                                                                        name='styleNo'
                                                                        bsSize='sm'
                                                                        placeholder='Buyer Set Style No'
                                                                        innerRef={register( { required: true } )}
                                                                        invalid={errors.buyerSetStyleNo && true}
                                                                        className={classnames( { 'is-invalid': errors['styleNo'] } )}
                                                                        value={setStyleBasicInfo?.styleNo}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.styleNo && <FormFeedback>Buyer Set Style No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-5' for='yearId'> Description</Label>
                                                                <Label className='custom-form-colons col-div-5'> : </Label>
                                                                <div className='custom-form-group col-div-5'>
                                                                    <Input
                                                                        id='descriptionId'
                                                                        type='text'
                                                                        name='description'
                                                                        bsSize='sm'
                                                                        placeholder='Description'
                                                                        innerRef={register( { required: false } )}
                                                                        invalid={errors.descriotion && true}
                                                                        className={classnames( { 'is-invalid': errors['description'] } )}
                                                                        value={setStyleBasicInfo?.description}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='seasonId'> Season</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='seasonId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownSeasons}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        onCreateOption={data => { handleSeasonCreate( data ); }}

                                                                        value={setStyleBasicInfo?.season}
                                                                        onChange={data => {
                                                                            handleSeasonDropdownOnChange( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.season && <FormFeedback>season is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='yearId'> Year</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='yearId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectYear}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': year === null } )}
                                                                        value={setStyleBasicInfo?.year}
                                                                        onChange={data => {
                                                                            handleYearDropdownOnChange( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.year && <FormFeedback>Year is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>

                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <div className='divider divider-right mt-0'>
                                                        <div className='divider-text text-secondary p-0'> <span>&nbsp;</span></div>
                                                    </div>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyer'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyers}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                                        value={setStyleBasicInfo?.buyer}
                                                                        onChange={data => {
                                                                            handleBuyerChange( data );
                                                                        }}
                                                                        onCreateOption={data => {

                                                                        }}
                                                                    />
                                                                    {errors && errors.buyer && <FormFeedback>Buyer No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerDepartmentId'> Department</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerDepartmentId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyerDepartments}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': buyerDepartment === null } )}
                                                                        value={setStyleBasicInfo?.buyerDepartment}
                                                                        onChange={data => {
                                                                            handleBuyerDepartmentDropdown( data );
                                                                        }}
                                                                        onFocus={() => {
                                                                            handleBuyerDepartmentDropdownOnFocus( dropDownBuyerDepartments );
                                                                        }}
                                                                    />
                                                                    {errors && errors.buyerDepartment && <FormFeedback>Buyer Department is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerAgentId'> Buyer Agent</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerAgentId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyerAgents}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': buyerAgent === null } )}
                                                                        value={setStyleBasicInfo?.agent}
                                                                        onChange={data => {
                                                                            handleAgentDepartmentDropdown( data );
                                                                        }}
                                                                        onFocus={() => {
                                                                            handleAgentDropdownOnFocus( dropDownBuyerAgents );
                                                                        }}
                                                                    />
                                                                    {errors && errors.buyerAgent && <FormFeedback>Buyer Agent is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerProductDeveloperId'> Buyer Prod. Dev.</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerProductDeveloperId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownProductDevelopers}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': buyerProductDeveloper === null } )}
                                                                        value={setStyleBasicInfo?.buyerProductDeveloper}
                                                                        onChange={data => {
                                                                            handleProductDevDepartmentDropdown( data );
                                                                        }}
                                                                        onFocus={() => {
                                                                            handleProductDeveloperDropdownOnFocus( dropDownProductDevelopers );
                                                                        }}
                                                                    />
                                                                    {errors && errors.buyerProductDeveloper && <FormFeedback>Description is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='merchandiserId'>Merchandiser</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        isSearchable
                                                                        isClearable
                                                                        isCreatable={false}
                                                                        id='merchandiserId'
                                                                        theme={selectThemeColors}
                                                                        options={[]}
                                                                        classNamePrefix='dropdown'
                                                                        className={classnames( 'erp-dropdown-select' )}
                                                                        innerRef={register( { required: true } )}
                                                                        value={null}
                                                                        onChange={data => {
                                                                            setProductionProcess( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.merchandiser && <FormFeedback>Merchandiser is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>

                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='statusId'>S. Assignee</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        id='assigneeId'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectSampleAssignee}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': sampleAssignee === null } )}
                                                                        value={sampleAssignee}
                                                                        onChange={data => {
                                                                            setSampleAssignee( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.sampleAssignee && <FormFeedback>Sample Assignee is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='statusId'>Prod. Process</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        isSearchable
                                                                        isClearable
                                                                        id='departmentId'
                                                                        theme={selectThemeColors}
                                                                        options={selectProductionProcess}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': productionProcess === null } )}
                                                                        value={productionProcess}
                                                                        onChange={data => {
                                                                            setProductionProcess( data );
                                                                        }}
                                                                    />
                                                                    {errors && errors.productionProcess && <FormFeedback>Production Process is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='statusId'>Status</Label>
                                                                <Label className='custom-form-colons  '> : </Label>
                                                                <div className='custom-form-group  '>
                                                                    <Select
                                                                        id='status'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={styleStatus}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': status === null } )}
                                                                        value={setStyleBasicInfo?.status}
                                                                        onChange={data => {
                                                                            handleStatusDropdownChange( data );
                                                                        }}
                                                                        onCreateOption={data => {

                                                                        }}
                                                                    />
                                                                    {errors && errors.status && <FormFeedback>Status No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-6' for='remarksId'>Remarks</Label>
                                                                <Label className='custom-form-colons col-div-6 '> : </Label>
                                                                <div className='custom-form-group  col-div-6'>
                                                                    <Input
                                                                        style={{ height: '38px' }}
                                                                        id='remarksId'
                                                                        type='textarea'
                                                                        name='remarks'
                                                                        bsSize='sm'
                                                                        placeholder='Remarks'
                                                                        innerRef={register( { required: false } )}
                                                                        invalid={errors.remarks && true}
                                                                        className={classnames( { 'is-invalid': errors['remarks'] } )}
                                                                        value={setStyleBasicInfo?.remarks}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.remarks && <FormFeedback>Remarks No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-6' for='spInstructionId'>Sp. Instruction</Label>
                                                                <Label className='custom-form-colons  col-div-6'> : </Label>
                                                                <div className='custom-form-group col-div-6 '>
                                                                    <Input
                                                                        style={{ height: '38px' }}
                                                                        id='spInstructionId'
                                                                        type='textarea'
                                                                        bsSize="sm"
                                                                        name='additionalInstruction'
                                                                        placeholder='Special Instruction'
                                                                        innerRef={register( { required: false } )}
                                                                        invalid={errors.additionalInstruction && true}
                                                                        className={classnames( { 'is-invalid': errors['additionalInstruction'] } )}
                                                                        value={setStyleBasicInfo?.additionalInstruction}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.additionalInstruction && <FormFeedback>Special Instruction No is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <SetStylePhoto
                                                    photoData={setStyleBasicInfo?.imagesUrls ?? []}
                                                    handlePhotoRemove={handleUploadPhotoRemoveFromCarousel}
                                                    handleDefaultPhotoOnCarousel={handleDefaultPhotoOnCarousel}
                                                    handlePhotoAddToTable={handlePhotoAddToTable}
                                                    handlePhotoRemoveFromTable={handlePhotoRemoveFromTable}
                                                    handleDefaultPhotoOnTable={handleDefaultPhotoOnTable}
                                                    photos={photos}
                                                    handlePhotoUploadToCarousel={handlePhotoUploadToCarousel}
                                                />
                                            </div>
                                            <div>
                                                {!isSetStylePhotoUploadComplete &&
                                                    (
                                                        <AutoProgress />
                                                    )
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <div className='divider divider-left '>
                            <div className='divider-text text-secondary font-weight-bolder'>Set Style Details</div>
                        </div>
                        <div >
                            <Row className="gx-5">
                                <Col xl={12} lg={12} md={12} sm={12} >
                                    <div className="border rounded rounded-3 p-1">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12} >
                                                <Row className="d-flex align-items-center">
                                                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={4} xl={4} >
                                                        <CustomInput
                                                            className="font-weight-bolder"
                                                            type='switch'
                                                            label="Size Specific"
                                                            id='icon-primary'
                                                            inline
                                                            name="isSizeSpecific"
                                                            checked={setStyleBasicInfo?.isSizeSpecific}
                                                            onChange={( e ) => { handleSizeSpecification( e ); }}
                                                        />
                                                    </FormGroup>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}  >
                                                        <Row>
                                                            <FormGroup tag={Col}>
                                                                <CustomInput
                                                                    type='switch'
                                                                    className="font-weight-bolder"
                                                                    label="Color Specific"
                                                                    id='colorSpecificId'
                                                                    name="isColorSpecific"
                                                                    checked={setStyleBasicInfo?.isColorSpecific}
                                                                    inline
                                                                    onChange={( e ) => handleColorSpecification( e )}
                                                                />
                                                            </FormGroup>

                                                        </Row>
                                                    </Col>


                                                </Row>

                                            </Col>
                                            <Col xl={12} lg={12} md={12} sm={12} >
                                                <SetStyleDetailsAddForm />
                                            </Col>
                                        </Row>

                                    </div>
                                </Col>
                                <Col xl={12}>
                                    <div className='divider divider-left'>
                                        <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                                    </div>
                                    <div className="border rounded rounded-3 p-1">
                                        <Row >
                                            <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='spInstructionId'>Doc. Category</Label>
                                                    <Label className='custom-form-colons  col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6 '>
                                                        <Select
                                                            id='docCategoryId'
                                                            isSearchable
                                                            isClearable
                                                            name='documentCategory'
                                                            theme={selectThemeColors}
                                                            options={selectDocCategory}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: true } )}
                                                            // className={classnames( 'react-select', { 'is-invalid': documentCategory === null } )}
                                                            // value={uploadFiles?.documentCategory}
                                                            value={selectDocCategory.filter( i => i.label === uploadFiles?.documentCategory )}
                                                            onChange={( data ) => { setUploadFiles( { ...uploadFiles, documentCategory: data ? data?.label : null } ); }}
                                                        />
                                                        {errors && errors.documentCategory && <FormFeedback>Document Category is required!</FormFeedback>}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={5} xl={6} xxl={6}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='spInstructionId'>Files</Label>
                                                    <Label className='custom-form-colons  col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6 '>
                                                        <div {...getRootProps()}>
                                                            <InputGroup >
                                                                <Input bsSize="sm" value={uploadFiles.name ? uploadFiles.name : 'Drop file here ...'} onChange={e => { e.preventDefault(); }} />
                                                                < input {...getInputProps()} id="uploadId" className='p-0' />
                                                                <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                                                    <Button.Ripple tag={InputGroupText} id="uploadId" className='btn-icon pb-0 pt-0' color='flat-primary'>
                                                                        <UploadCloud size={15} />
                                                                    </Button.Ripple>
                                                                </InputGroupAddon>
                                                                {errors && errors.cm && <FormFeedback>CM is required!</FormFeedback>}
                                                            </InputGroup>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={2} xl={1} xxl={1} className="text-right">
                                                <Button.Ripple
                                                    disabled={( !uploadFiles.name || !uploadFiles.documentCategory || !lastSetStyleId )}
                                                    onClick={() => { handleAddFileToTable(); }}
                                                    color='primary'
                                                    size='sm'
                                                    outline
                                                >
                                                    Upload
                                                </Button.Ripple>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                {
                                                    isSetStyleFileUploadComplete ? (
                                                        <SetStyleDocumentTable tableData={setStyleFiles} handleFileRemoveFromTable={handleFileRemoveFromTable} />
                                                    ) : <AutoProgress />
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>

                            </Row>
                        </div>


                    </Form >
                </CardBody >
            </Card >
            {/* {
                openBuyerSidebar ? (
                    <BuyerAddForm open={openBuyerSidebar} addInstantCreate={handleBuyerInstantAdd} buyerName={buyerName} toggleSidebar={buyerToggleSidebar} />
                ) : openSizeGroupSidebar ? (
                    <SizeGroupAddForm open={openSizeGroupSidebar} addInstantCreate={handleSizeGroupInstantAdd} sizeGroupName={sizeGroupName} toggleSidebar={sizeGroupToggleSidebar} />
                ) : openColorSidebar ? (
                    <ColorAddForm open={openColorSidebar} addInstantCreate={handleColorInstantAdd} colorName={colorName} toggleSidebar={colorToggleSidebar} />
                ) : openStatusSidebar ? (
                    <StatusAddForm open={openStatusSidebar} addInstantCreate={handleStatusInstantAdd} statusName={statusName} toggleSidebar={statusToggleSidebar} />
                ) : null
            } */}
        </div >
    );
};

export default SetStyleAddFormNew;
