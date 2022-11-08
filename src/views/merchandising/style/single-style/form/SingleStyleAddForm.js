import Loader from '@components/spinner/Fallback-spinner';
// import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/form/style-form.scss';

import '@custom-styles/merchandising/merchandising-core.scss';
import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Edit3, UploadCloud } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select, { components } from 'react-select';
import { Button, Card, CardBody, Col, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import AutoProgress from '../../../../../utility/custom/AutoProgress';
import OperationProgress from '../../../../../utility/custom/OperationProgress';
import { selectDocCategory, selectProductionProcess, selectYear, status as insertStatus, styleStatus } from '../../../../../utility/enums';
import { createOption, formatDate, isPermit, randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { getFabricSubGroupDropdown } from '../../../../inventory/item-sub-group/store/actions';
import { getItemGroupSegmentWithValueInput } from '../../../../inventory/segment/store/actions';
import { getCascadeDropDownBuyerAgents } from '../../../buyer-agent/store/actions';
import { getCascadeDropDownBuyerDepartments } from '../../../buyer-department/store/actions';
import { getCascadeDropDownBuyerProductDevelopers } from '../../../buyer-product-developer/store/actions';
// import BuyerAddForm from '../../../buyer/form/BuyerAddForm';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import OptionSelect from '../../../../../utility/custom/OptionSelect';
import { getUserDropdown } from '../../../../auth/user/store/actions';
import { getBuyerColorsDropdownByBuyerById, getBuyerSizeGroupsDropdownByBuyerById, getDropDownBuyers } from '../../../buyer/store/actions';
import { getDropDownSampleAssignees } from '../../../sample-assignee/store/actions';
import { getDropDownSeasons } from '../../../season/store/actions';
import { getCascadeDropDownStyleCategories } from '../../../style-master/style-category/store/actions';
import { getCascadeDropDownDepartments } from '../../../style-master/style-department/store/actions';
import { getCascadeDropDownDivisions } from '../../../style-master/style-division/store/actions';
import { getCascadeDropDownProductCategories } from '../../../style-master/style-product-category/store/actions';
import { addStyle, bindStyleBasicInfo, getSingleStyleDefaultTemplateDropdown, getStyleById, getUploadedFileBySingleStyleId, getUploadedImagesBySingleStyleId, singleStylePhotoUpload, styleFileUpload } from '../store/actions';
import AssignBuyerColorModal from './AssignBuyerColorModal';
import FabricCategoryModal from './FabricCategoryModal';
import SingleStyleDocumentTable from './SingleStyleDocumentTable';
import SingleStylePhoto from './SingleStylePhoto';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: '/',
        isActive: false
    },
    {
        id: 'singleStyleList',
        name: 'List',
        link: '/single-styles',
        isActive: false
    },
    {
        id: 'singleStyle',
        name: 'Single Style',
        link: '/new-single-style',
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


const SingleStyleAddForm = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();
    const {
        isFileUploadComplete,
        isPhotoUploadComplete,
        singleStyleBasicInfo,
        singleStyleTemplateDropdown,
        isSingleStyleTemplateDropdownLoaded,
        isSingleStyleDataLoaded,
        isSingleStyleDataProgress
    } = useSelector( ( { styles } ) => styles );
    const { dropdownFabricSubGroup } = useSelector( ( { itemSubGroups } ) => itemSubGroups );

    const { dropDownSeasons, isDropDownSeasonsLoaded } = useSelector( ( { seasons } ) => seasons );
    const { dropDownBuyerDepartments, isDropDownBuyerDepartmentsLoaded } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const { dropDownBuyerAgents, isDropDownBuyerAgentsLoaded } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const { dropDownProductDevelopers, isDropDownProductDevelopersLoaded } = useSelector( ( { productDevelopers } ) => productDevelopers );
    const { dropDownDivisions, isDropDownDivisionsLoaded } = useSelector( ( { divisions } ) => divisions );
    const { userDropdown, isUserDropdownLoaded } = useSelector( ( { users } ) => users );

    const { dropDownDepartments, isDropDownDepartmentsLoaded } = useSelector( ( { departments } ) => departments );
    const { dropDownProductCategories, isDropDownProductCategoriesLoaded } = useSelector( ( { productCategories } ) => productCategories );
    const { dropDownStyleCategories, isDropDownStyleCategoriesLoaded } = useSelector( ( { styleCategories } ) => styleCategories );

    const { dropDownBuyers,
        dropdownBuyerColors,
        dropdownBuyerSizeGroups,
        isBuyerDropdownLoaded,
        isDropdownBuyerSizeGroupsLoaded,
        isDropdownBuyerColorsLoaded
    } = useSelector( ( { buyers } ) => buyers );


    const { dropDownSampleAssignees, isDropDownSampleAssigneesLoaded } = useSelector( ( { sampleAssignees } ) => sampleAssignees );
    const { authenticateUser, userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    const [uploadFiles, setUploadFiles] = useState( initialFilesUpload );


    ///For Photo Upload
    const [photos, setPhotos] = useState( [] );

    const SignupSchema = yup.object().shape( {

        styleNo: singleStyleBasicInfo?.styleNo.length ? yup.string() : yup.string().required( 'Style No is Required!!' ),
        description: singleStyleBasicInfo?.description.length ? yup.string() : yup.string().required( 'Description No is Required!!' ),
        season: singleStyleBasicInfo?.season ? yup.string() : yup.string().required( 'Season is Required!!' ),
        year: singleStyleBasicInfo?.year ? yup.string() : yup.string().required( 'Year is Required!!' ),
        buyer: singleStyleBasicInfo?.buyer ? yup.string() : yup.string().required( 'Buyer is Required!!' ),
        buyerDepartment: singleStyleBasicInfo?.buyerDepartment ? yup.string() : yup.string().required( 'Buyer Department is Required!!' ),
        agent: singleStyleBasicInfo?.agent ? yup.string() : yup.string().notRequired( 'Buyer Agent is Required!!' ),
        buyerProductDeveloper: singleStyleBasicInfo?.buyerProductDeveloper ? yup.string() : yup.string().notRequired( 'Buyer Product Developer is Required!!' ),
        styleDivision: singleStyleBasicInfo?.styleDivision ? yup.string() : yup.string().required( 'Style Division is Required!!' ),
        styleDepartment: singleStyleBasicInfo?.styleDepartment ? yup.string() : yup.string().required( 'Style Department is Required!!' ),
        productCategory: singleStyleBasicInfo?.productCategory ? yup.string() : yup.string().required( 'Product Category is Required!!' ),
        styleCategory: singleStyleBasicInfo?.styleCategory ? yup.string() : yup.string().required( 'Style Category is Required!!' ),
        sizeGroups: singleStyleBasicInfo?.sizeGroups.length ? yup.string() : yup.string().required( 'Size Group is Required!!' ),
        colors: singleStyleBasicInfo?.colors.length ? yup.string() : yup.string().required( 'Color is Required!!' ),
        defaultFabDescValue: singleStyleBasicInfo?.defaultFabDescValue ? yup.string() : yup.string().required( 'Default Fabric is Required!!' ),
        status: singleStyleBasicInfo?.status ? yup.string() : yup.string().required( 'Status is Required!!' )
    } );

    // const { register, errors, handleSubmit } = useForm();
    const { register, errors, handleSubmit, control } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );


    useEffect( () => {
        dispatch( getFabricSubGroupDropdown() );

    }, [] );

    const handleBuyerDropdownOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };
    const handleSampleAssigneeDropdownOnFocus = () => {
        if ( !dropDownSampleAssignees.length ) {
            dispatch( getDropDownSampleAssignees() );
        }
    };

    const handleDivisionDropdownOnFocus = () => {
        if ( !dropDownDivisions.length ) {
            dispatch( getCascadeDropDownDivisions() );
        }
    };
    const handleSeasonDropdownOnFocus = () => {
        if ( !dropDownSeasons.length ) {
            dispatch( getDropDownSeasons() );
        }
    };

    const handleSizeGroupOnFocus = () => {
        if ( !dropdownBuyerSizeGroups.length && singleStyleBasicInfo?.buyer ) {
            dispatch( getBuyerSizeGroupsDropdownByBuyerById( singleStyleBasicInfo?.buyer?.value ) );
        }
    };
    const handleColorOnFocus = () => {
        if ( !dropdownBuyerColors.length && singleStyleBasicInfo?.buyer ) {
            dispatch( getBuyerColorsDropdownByBuyerById( singleStyleBasicInfo?.buyer?.value ) );
        }
    };
    const handleInputOnChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedObj = {
            ...singleStyleBasicInfo,
            [name]: value
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
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
        //  dispatch( singleStyleFileUpload( obj ) );
        dispatch( styleFileUpload( obj ) );

        setUploadFiles( initialFilesUpload );
    };


    const handleFileRemoveFromTable = fileId => {
        //  dispatch( singleFileDelete( fileId ) );
    };

    const { getRootProps, getInputProps } = useDropzone( {
        accept: 'application/pdf, .pdf, .doc, .docx, .xls, .csv, .xlsx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .png, .jpg, .jpeg',
        maxFiles: 1,
        multiple: false,
        maxSize: 2097152,
        onDrop: ( acceptedFiles, fileRejections ) => {
            if ( acceptedFiles.length ) {
                handleFileUpload( acceptedFiles );
            } else {
                const message = fileRejections[0]?.errors[0]?.message;
                const fileError = fileRejections[0].errors[0].code === 'file-too-large';
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
                //   setSeason( newOption );
                dispatch( getDropDownSeasons() );
                notify( 'success', 'The Season has been added Successfully!' );
            } else {
                notify( 'error', 'The Season has been added Failed!' );
            }
        } );
    };


    //Buyer Drop Down Control Start
    const handleBuyerChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            buyer: data,
            agent: null,
            buyerDepartment: null,
            buyerProductDeveloper: null,
            sizeGroups: [],
            colors: []
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

        dispatch( getCascadeDropDownBuyerDepartments( null ) );
        dispatch( getCascadeDropDownBuyerAgents( null ) );
        dispatch( getCascadeDropDownBuyerProductDevelopers( null ) );
        dispatch( getBuyerSizeGroupsDropdownByBuyerById( null ) );
        dispatch( getBuyerColorsDropdownByBuyerById( null ) );
    };

    const handleBuyerDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            buyerDepartment: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

    };

    const handleAgentDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            agent: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleProductDevDepartmentDropdown = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            buyerProductDeveloper: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleStyleCategoryDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            styleCategory: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleSizeGroupDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            sizeGroups: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleColorDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            colors: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };
    const handleSampleAssigneeDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            sampleAssignee: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    //Buyer Drop Down Control End

    ///Division Drop Down Control Start
    const handleProductCategoryChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            productCategory: data,
            styleCategory: null
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
        dispatch( getCascadeDropDownStyleCategories( null ) );
    };

    const handleStyleDepartmentChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            styleDepartment: data,
            productCategory: null,
            styleCategory: null
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
        dispatch( getCascadeDropDownProductCategories( null ) );
        dispatch( getCascadeDropDownStyleCategories( null ) );
    };

    const handleDivisionChange = ( data ) => {
        // dispatch( getCascadeDropDownDepartments( data.value ) );
        const updatedObj = {
            ...singleStyleBasicInfo,
            styleDivision: data,
            styleDepartment: null,
            productCategory: null,
            styleCategory: null
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
        dispatch( getCascadeDropDownDepartments( null ) );
        dispatch( getCascadeDropDownProductCategories( null ) );
        dispatch( getCascadeDropDownStyleCategories( null ) );

    };

    const handleStatusDropdownChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            status: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleMerchandiserDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            merchandiser: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleSeasonDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            season: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

    };
    const handleProductionProcessDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            productionProcess: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

    };
    const handleYearDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...singleStyleBasicInfo,
            year: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

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
        console.log( mutedPhotoArray );
    };

    const handlePhotoUploadToCarousel = () => {
        const sortedPhoto = photos.sort( ( a, b ) => ( a.isDefault - b.isDefault ) );

        if ( photos.length > 0 ) {
            dispatch( singleStylePhotoUpload( sortedPhoto ) );
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
        const updatedImage = singleStyleBasicInfo.images.filter( img => img.generatedName !== generatedName );
        const updatedImageUrl = singleStyleBasicInfo.imagesUrls.filter( img => img.generatedName !== generatedName );
        const updatedObj = {
            ...singleStyleBasicInfo,
            images: updatedImage,
            imagesUrls: updatedImageUrl
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleDefaultPhotoOnTable = ( photoId ) => {
        setPhotos(
            photos.map(
                ( photo ) => ( photo.id === photoId ? { ...photo, isDefault: !photo.isDefault } : { ...photo, isDefault: false } )
            )
        );

    };

    const handleDefaultPhotoOnCarousel = ( generatedName ) => {
        const updatedImage = singleStyleBasicInfo.images.map( img => {
            if ( generatedName === img.generatedName ) {
                img['isDefault'] = true;
            } else {
                img['isDefault'] = false;
            }
            return img;
        } );
        const updatedImageUrl = singleStyleBasicInfo.imagesUrls.map( img => {
            if ( generatedName === img.generatedName ) {
                img['isDefault'] = true;
            } else {
                img['isDefault'] = false;
            }
            return img;
        } );
        const updatedObj = {
            ...singleStyleBasicInfo,
            images: updatedImage,
            imagesUrls: updatedImageUrl
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );
    };

    const handleAgentDropdownOnFocus = ( agents ) => {
        if ( !agents.length ) {
            dispatch( getCascadeDropDownBuyerAgents( singleStyleBasicInfo.buyer?.value ) );
        }

    };

    const handleBuyerDepartmentDropdownOnFocus = ( buyerDepartments ) => {
        if ( !buyerDepartments.length ) {
            dispatch( getCascadeDropDownBuyerDepartments( singleStyleBasicInfo.buyer?.value ) );
        }
    };

    const handleProductDeveloperDropdownOnFocus = ( developer ) => {
        if ( !developer.length ) {
            dispatch( getCascadeDropDownBuyerProductDevelopers( singleStyleBasicInfo.buyer?.value ) );
        }

    };

    const handleDepartmentsDropdownOnFocus = ( departments ) => {
        if ( !departments.length ) {
            dispatch( getCascadeDropDownDepartments( singleStyleBasicInfo.styleDivision?.value ) );
        }

    };

    const handleProductCategoriesDropdownOnFocus = ( proCategories ) => {
        if ( !proCategories.length ) {
            dispatch( getCascadeDropDownProductCategories( singleStyleBasicInfo.styleDepartment?.value ) );
        }
    };
    const handleStyleCategoriesDropdownOnFocus = ( styleCategories ) => {
        if ( !styleCategories.length ) {
            dispatch( getCascadeDropDownStyleCategories( singleStyleBasicInfo.productCategory?.value ) );
        }
    };

    const handleMerchandiserOnFocus = () => {
        if ( !userDropdown.length ) {
            dispatch( getUserDropdown() );
        }
    };


    const handleFabricOnFocus = () => {
        if ( !singleStyleTemplateDropdown.length ) {
            dispatch( getSingleStyleDefaultTemplateDropdown() );
        }
    };

    const handleFabricOnChange = ( data ) => {
        console.log( data );
        const updatedObj = {
            ...singleStyleBasicInfo,
            defaultFabCatId: data?.categoryId ?? 0,
            defaultFabSubCatId: data?.subCategoryId ?? 0,
            defaultFabDesc: data?.fabricDescription ?? "",
            defaultFabDescTemplate: data?.fabricDescriptionTemplate ?? "",
            defaultFabDescValue: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

    };

    const onSubmit = ( values ) => {
        const sizeGroupsMuted = singleStyleBasicInfo.sizeGroups?.map( i => i.value );
        const colorsMuted = singleStyleBasicInfo.colors?.map( i => i.value );
        const postObj = {
            styleNo: singleStyleBasicInfo.styleNo,
            season: singleStyleBasicInfo.season?.label,
            year: singleStyleBasicInfo.year?.value,
            description: singleStyleBasicInfo.description,
            buyerId: singleStyleBasicInfo.buyer?.value,
            buyerName: singleStyleBasicInfo.buyer?.label,
            buyerDepartmentId: singleStyleBasicInfo.buyerDepartment?.value,
            buyerDepartment: singleStyleBasicInfo.buyerDepartment?.label,
            agentId: singleStyleBasicInfo.agent?.value,
            agentName: singleStyleBasicInfo.agent?.label,
            sampleAssigneeId: singleStyleBasicInfo.sampleAssignee?.value,
            buyerProductDeveloperId: singleStyleBasicInfo.buyerProductDeveloper?.value,
            buyerProductDeveloper: singleStyleBasicInfo.buyerProductDeveloper?.label,
            styleDivisionId: singleStyleBasicInfo.styleDivision?.value,
            styleDivision: singleStyleBasicInfo.styleDivision?.label,
            styleDepartmentId: singleStyleBasicInfo.styleDepartment?.value,
            styleDepartment: singleStyleBasicInfo.styleDepartment?.label,
            productCategoryId: singleStyleBasicInfo.productCategory?.value,
            productCategory: singleStyleBasicInfo.productCategory?.label,
            styleCategoryId: singleStyleBasicInfo.styleCategory?.value,
            styleCategory: singleStyleBasicInfo.styleCategory?.label,
            colorIds: colorsMuted,
            sizeGroupIds: sizeGroupsMuted,
            remarks: singleStyleBasicInfo.remarks,
            additionalInstruction: singleStyleBasicInfo.additionalInstruction,
            status: singleStyleBasicInfo.status?.label,
            productionProcess: singleStyleBasicInfo.productionProcess?.label,
            merchandiserId: singleStyleBasicInfo?.merchandiser?.value ?? authenticateUser?.id,
            images: singleStyleBasicInfo.images,
            defaultFabCatId: singleStyleBasicInfo.defaultFabCatId,
            defaultFabSubCatId: singleStyleBasicInfo.defaultFabSubCatId,
            defaultFabDesc: singleStyleBasicInfo.defaultFabDesc,
            defaultFabDescTemplate: singleStyleBasicInfo.defaultFabDescTemplate,
            files: singleStyleBasicInfo?.files
        };
        console.log( JSON.stringify( postObj, null, 2 ) );


        if ( postObj.images?.length > 0 ) {
            const isHaveAnyDefaultImage = postObj?.images.some( image => image.isDefault );
            if ( isHaveAnyDefaultImage ) {
                dispatch( addStyle( postObj, push ) );
            } else {
                notify( 'warning', 'Please set at least one photo as default!!!' );
            }
        } else {
            notify( 'warning', 'Please Upload at least one photo!!!' );
        }

    };

    const [fabricCategoryOpenModal, setFabricCategoryOpenModal] = useState( false );

    const handleFabricCategoryCreate = ( itemGroupId, itemSubGroupId, template ) => {
        if ( itemGroupId > 0 && template ) {

            dispatch( getItemGroupSegmentWithValueInput( itemGroupId, template ) );
            const updatedObj = {
                ...singleStyleBasicInfo,
                itemGroup: dropdownFabricSubGroup.find( subGroup => subGroup.value === itemSubGroupId )
            };
            dispatch( bindStyleBasicInfo( updatedObj ) );
        }

        setFabricCategoryOpenModal( !fabricCategoryOpenModal );
    };

    const [openBuyerColorModal, setOpenBuyerColorModal] = useState( false );

    const handleBuyerColorModalOpen = ( buyerId ) => {
        if ( buyerId ) {
            setOpenBuyerColorModal( !openBuyerColorModal );
        } else {
            notify( 'warning', `Please select a buyer at first` );
        }
    };


    const handleCancel = () => {
        replace( '/single-styles' );
        dispatch( getStyleById( null ) );
        dispatch( getUploadedFileBySingleStyleId( null ) );
        dispatch( getUploadedImagesBySingleStyleId( null ) );
    };

    const MenuList = ( { ...props } ) => {
        return (
            <>
                <Button.Ripple
                    size="sm"
                    color="success"
                    onClick={() => { console.log( 'f' ); }}
                    style={{
                        borderRadius: "0%",
                        background: 'white',
                        width: '100%',
                        marginBottom: '3px'
                    }} >
                    Add New
                </Button.Ripple>
                <components.MenuList {...props} >

                    {props.children}

                </components.MenuList>
            </>
        );
    };

    return (
        <div >
            <div hidden={!isSingleStyleDataProgress}>
                <Loader />
            </div>
            <ActionMenu breadcrumb={breadcrumb} title='New Single Style' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                        onClick={handleSubmit( onSubmit )}
                        disabled={isSingleStyleDataProgress}

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
                <OperationProgress progress={isSingleStyleDataProgress} />

            </ActionMenu>
            <Card className="mt-3 style-form" hidden={isSingleStyleDataProgress}>
                <CardBody>


                    <Row >
                        <Col>
                            <div className='divider divider-left'>
                                <div className='divider-text text-secondary font-weight-bolder '>Style Information</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row >
                                    <Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='styleNoId'> Buyer Style NO <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Input
                                                                    id="styleNoId"
                                                                    type="text"
                                                                    name="styleNo"
                                                                    bsSize="sm"
                                                                    placeholder="Buyer Style No"
                                                                    //  innerRef={register( { required: true } )}
                                                                    invalid={!!( errors.styleNo && !singleStyleBasicInfo?.styleNo.length )}
                                                                    value={singleStyleBasicInfo?.styleNo}
                                                                    onChange={( e ) => { handleInputOnChange( e ); }}

                                                                />

                                                                {/* {errors && errors.styleNo && <FormFeedback>Buyer PO No is required!</FormFeedback>} */}
                                                            </div>
                                                        </div>

                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-5' for='yearId'> Description <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons col-div-5'> : </Label>
                                                            <div className='custom-form-group col-div-5'>
                                                                <Input
                                                                    id='description'
                                                                    type='text'
                                                                    bsSize="sm"
                                                                    name='description'
                                                                    placeholder='Description'
                                                                    // innerRef={register( { required: true } )}
                                                                    invalid={!!( errors.description && !singleStyleBasicInfo?.description.length )}
                                                                    value={singleStyleBasicInfo?.description}
                                                                    onChange={( e ) => { handleInputOnChange( e ); }}
                                                                // className={classnames( { 'is-invalid': errors['description'] } )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='seasonId'> Season <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='seasonId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownSeasonsLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownSeasons}
                                                                    // options={selectSeason}
                                                                    classNamePrefix='dropdown'
                                                                    // innerRef={register( { required: true } )}
                                                                    onCreateOption={data => { handleSeasonCreate( data ); }}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.season && !singleStyleBasicInfo?.season ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.season}
                                                                    onChange={data => {
                                                                        handleSeasonDropdownOnChange( data );
                                                                    }}
                                                                    onFocus={() => { handleSeasonDropdownOnFocus(); }}
                                                                />
                                                                {/* {errors && errors.season && <FormFeedback>Season is required!</FormFeedback>} */}
                                                            </div>
                                                        </div>

                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='yearId'> Year <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='yearId'
                                                                    isSearchable
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={selectYear}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.year && !singleStyleBasicInfo?.year ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.year}
                                                                    onChange={data => {
                                                                        handleYearDropdownOnChange( data );
                                                                    }}
                                                                />

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
                                                            <Label className='custom-form-label' for='buyerId'> Buyer <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='buyerId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isBuyerDropdownLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownBuyers}
                                                                    classNamePrefix='dropdown'
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.buyer && !singleStyleBasicInfo?.buyer ) && 'is-invalid'}` )}
                                                                    innerRef={register( { required: true } )}
                                                                    value={singleStyleBasicInfo?.buyer}
                                                                    onChange={data => {
                                                                        handleBuyerChange( data );
                                                                    }}
                                                                    // onCreateOption={data => {  }}
                                                                    onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                                                />
                                                            </div>
                                                        </div>

                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='buyerDepartmentId'> Buyer Dept. <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='buyerDepartmentId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownBuyerDepartmentsLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownBuyerDepartments}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.buyerDepartment && !singleStyleBasicInfo?.buyerDepartment ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.buyerDepartment}
                                                                    onChange={data => {
                                                                        handleBuyerDepartmentDropdown( data );
                                                                    }}
                                                                    onFocus={() => { handleBuyerDepartmentDropdownOnFocus( dropDownBuyerDepartments ); }}
                                                                />

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
                                                                    isLoading={!isDropDownBuyerAgentsLoaded}
                                                                    options={dropDownBuyerAgents}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.agent && !singleStyleBasicInfo?.agent ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.agent}
                                                                    onChange={data => {
                                                                        handleAgentDepartmentDropdown( data );
                                                                    }}
                                                                    onFocus={() => { handleAgentDropdownOnFocus( dropDownBuyerAgents ); }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='buyerProductDeveloperId'> Buyer Pro. Dev.</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='buyerProductDeveloperId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownProductDevelopersLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownProductDevelopers}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.buyerProductDeveloper && !singleStyleBasicInfo?.buyerProductDeveloper ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.buyerProductDeveloper}
                                                                    onChange={data => {
                                                                        handleProductDevDepartmentDropdown( data );
                                                                    }}
                                                                    onFocus={() => { handleProductDeveloperDropdownOnFocus( dropDownProductDevelopers ); }}

                                                                />
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
                                                            <Label className='custom-form-label' for='divisionId'> Style Division <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='divisionId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownDivisionsLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownDivisions}
                                                                    classNamePrefix='dropdown'
                                                                    // innerRef={register( { required: true } )}
                                                                    // className={classnames( 'react-select', { 'is-invalid': division === null } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.styleDivision && !singleStyleBasicInfo?.styleDivision ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.styleDivision}
                                                                    onChange={
                                                                        data => {
                                                                            handleDivisionChange( data );
                                                                        }
                                                                    }
                                                                    onFocus={() => { handleDivisionDropdownOnFocus(); }}


                                                                />
                                                            </div>
                                                        </div>

                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='styleDepartmentId'>Style Dept. <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='styleDepartmentId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownDepartmentsLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownDepartments}
                                                                    // options={division?.styleDepartment}
                                                                    //options={dropDownDivisions?.dropDownDepartments}
                                                                    classNamePrefix='dropdown'
                                                                    // innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.styleDepartment && !singleStyleBasicInfo?.styleDepartment ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.styleDepartment}
                                                                    onChange={
                                                                        data => {
                                                                            handleStyleDepartmentChange( data );
                                                                        }
                                                                    }
                                                                    onFocus={() => { handleDepartmentsDropdownOnFocus( dropDownDepartments ); }}

                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='productCategoryId'> Product Cat. <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='productCategoryId'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownProductCategoriesLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownProductCategories}
                                                                    classNamePrefix='dropdown'
                                                                    // innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.productCategory && !singleStyleBasicInfo?.productCategory ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.productCategory}
                                                                    onChange={data => {
                                                                        handleProductCategoryChange( data );
                                                                    }}
                                                                    onFocus={() => { handleProductCategoriesDropdownOnFocus( dropDownProductCategories ); }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='productCategoryId'> Style Category <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Select
                                                                    id='styleCategory'
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownStyleCategoriesLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownStyleCategories}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.styleCategory && !singleStyleBasicInfo?.styleCategory ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.styleCategory}
                                                                    onChange={data => {
                                                                        handleStyleCategoryDropdownOnChange( data );
                                                                    }}
                                                                    onFocus={() => { handleStyleCategoriesDropdownOnFocus( dropDownStyleCategories ); }}
                                                                />
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
                                                            <Label className='custom-form-label col-div-6' for='sizeGroupIds'> Size Rang <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons col-div-6'> : </Label>
                                                            <div className='custom-form-group col-div-6'>
                                                                <Select
                                                                    id='sizeGroupIds'
                                                                    isMulti
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropdownBuyerSizeGroupsLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropdownBuyerSizeGroups}
                                                                    // options={selectSizeGroups}
                                                                    classNamePrefix='dropdown'
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.sizeGroups && !singleStyleBasicInfo?.sizeGroups.length ) && 'is-invalid'}` )}
                                                                    innerRef={register( { required: true } )}
                                                                    value={singleStyleBasicInfo?.sizeGroups}
                                                                    onChange={data => {
                                                                        handleSizeGroupDropdownOnChange( data );
                                                                    }}
                                                                    //   onCreateOption={data => { }}
                                                                    onFocus={() => { handleSizeGroupOnFocus(); }}
                                                                />
                                                                {errors && errors.sizeGroupIds && <FormFeedback>Buyer No is required!</FormFeedback>}
                                                            </div>
                                                        </div>

                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-6' for='colorIds'>Color <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons col-div-6'> : </Label>
                                                            <div className='custom-form-group col-div-6'>
                                                                <OptionSelect
                                                                    isSearchable
                                                                    isMulti
                                                                    isClearable
                                                                    isLoading={!isDropdownBuyerColorsLoaded}
                                                                    id='colorIds'
                                                                    name="colors"
                                                                    // menuIsOpen={false}
                                                                    theme={selectThemeColors}
                                                                    options={dropdownBuyerColors}
                                                                    // options={selectColor}
                                                                    classNamePrefix='dropdown'
                                                                    //innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.colors && !singleStyleBasicInfo?.colors.length ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.colors}
                                                                    onChange={data => {
                                                                        handleColorDropdownOnChange( data );
                                                                    }}
                                                                    btnAction={() => {
                                                                        handleBuyerColorModalOpen( singleStyleBasicInfo.buyer?.value );
                                                                    }}
                                                                    buttonLabel="Assign Buyer Color"
                                                                    isBtnVisible={isPermit( userPermission?.BuyerAssignColor, authPermissions )}
                                                                    //  onCreateOption={data => { }}

                                                                    onFocus={() => { handleColorOnFocus(); }}

                                                                />
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
                                                                    isLoading={!isUserDropdownLoaded}
                                                                    id='merchandiserId'
                                                                    theme={selectThemeColors}
                                                                    options={userDropdown}
                                                                    // options={selectColor}
                                                                    classNamePrefix='dropdown'
                                                                    // innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ` )}
                                                                    value={singleStyleBasicInfo?.merchandiser ?? { value: authenticateUser?.id, label: authenticateUser?.name }}
                                                                    onChange={data => {
                                                                        handleMerchandiserDropdownOnChange( data );
                                                                    }}
                                                                    //  onCreateOption={data => { }}

                                                                    onFocus={() => { handleMerchandiserOnFocus(); }}
                                                                />

                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label ' for='assigneeId'>S. Assignee</Label>
                                                            <Label className='custom-form-colons '> : </Label>
                                                            <div className='custom-form-group  '>
                                                                <Select
                                                                    id='assigneeId'
                                                                    name="sampleAssignee"
                                                                    isSearchable
                                                                    isClearable
                                                                    isLoading={!isDropDownSampleAssigneesLoaded}
                                                                    theme={selectThemeColors}
                                                                    options={dropDownSampleAssignees}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( 'erp-dropdown-select' )}
                                                                    value={singleStyleBasicInfo?.sampleAssignee}
                                                                    onChange={data => {
                                                                        handleSampleAssigneeDropdownOnChange( data );
                                                                    }}
                                                                    onFocus={() => { handleSampleAssigneeDropdownOnFocus(); }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col xs={12} sm={12} md={12} lg={6} xl={6} >
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-3-style-pp' for='proProcId'>Prod. Process</Label>
                                                            <Label className='custom-form-colons col-div-3-style-pp '> : </Label>
                                                            <div className='custom-form-group col-div-3-style-pp'>
                                                                <Select
                                                                    isSearchable
                                                                    isClearable
                                                                    id='proProcId'
                                                                    theme={selectThemeColors}
                                                                    options={selectProductionProcess}
                                                                    classNamePrefix='dropdown'
                                                                    className={classnames( 'erp-dropdown-select' )}
                                                                    innerRef={register( { required: true } )}
                                                                    value={singleStyleBasicInfo?.productionProcess}
                                                                    onChange={data => {
                                                                        handleProductionProcessDropdownOnChange( data );
                                                                    }}
                                                                />
                                                                {errors && errors.productionProcess && <FormFeedback>Production Process is required!</FormFeedback>}
                                                            </div>
                                                        </div>
                                                    </Col>


                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={9} xl={9} >
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-9' for='merchandiserId'>Fabric Cat. <span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons  col-div-9'> : </Label>
                                                            <div className='custom-form-group  col-div-9'>
                                                                <div className='custom-form-input-group  style'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <Select
                                                                            isSearchable
                                                                            isClearable
                                                                            isLoading={!isSingleStyleTemplateDropdownLoaded}
                                                                            id='merchandiserId'
                                                                            theme={selectThemeColors}
                                                                            options={singleStyleTemplateDropdown}
                                                                            classNamePrefix='dropdown'
                                                                            innerRef={register( { required: true } )}
                                                                            className={classnames( `erp-dropdown-select ${( errors && errors.defaultFabDescValue && !singleStyleBasicInfo?.defaultFabDescValue ) && 'is-invalid'}` )}

                                                                            value={singleStyleBasicInfo?.defaultFabDescValue}
                                                                            onChange={data => {
                                                                                handleFabricOnChange( data );
                                                                            }}
                                                                            onFocus={() => {
                                                                                handleFabricOnFocus();
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>
                                                                        <Button.Ripple
                                                                            className='btn-icon'
                                                                            outline
                                                                            size="sm"
                                                                            color='primary'
                                                                            onClick={() => {
                                                                                handleFabricCategoryCreate(
                                                                                    singleStyleBasicInfo.defaultFabCatId,
                                                                                    singleStyleBasicInfo.defaultFabSubCatId,
                                                                                    singleStyleBasicInfo.defaultFabDescTemplate
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Edit3 size={16} />
                                                                        </Button.Ripple>
                                                                    </div>
                                                                </div>
                                                                {/* <Select
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
                                                                    {errors && errors.merchandiser && <FormFeedback>Merchandiser is required!</FormFeedback>} */}
                                                            </div>
                                                        </div>
                                                    </Col>


                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label ' for='statusId'>Status<span className="text-danger">*</span></Label>
                                                            <Label className='custom-form-colons  '> : </Label>
                                                            <div className='custom-form-group '>
                                                                <Select
                                                                    id='statusId'
                                                                    isSearchable
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={styleStatus}
                                                                    // options={selectStatus}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.status && !singleStyleBasicInfo?.status ) && 'is-invalid'}` )}
                                                                    value={singleStyleBasicInfo?.status}
                                                                    onChange={data => {
                                                                        handleStatusDropdownChange( data );
                                                                    }}

                                                                />

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
                                                                    bsSize="sm"
                                                                    name='remarks'
                                                                    placeholder='Remarks'
                                                                    // innerRef={register( { required: false } )}
                                                                    invalid={errors.remarks && true}
                                                                    className={classnames( { 'is-invalid': errors['remarks'] } )}
                                                                    value={singleStyleBasicInfo?.remarks}
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
                                                                    // innerRef={register( { required: false } )}
                                                                    invalid={errors.specialInstruction && true}
                                                                    className={classnames( { 'is-invalid': errors['additionalInstruction'] } )}
                                                                    value={singleStyleBasicInfo?.additionalInstruction}
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
                                            <SingleStylePhoto
                                                photoData={singleStyleBasicInfo?.imagesUrls ?? []}
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
                                            {!isPhotoUploadComplete &&
                                                (

                                                    <AutoProgress />
                                                )
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xl={12}>
                            <div className='divider divider-left'>
                                <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
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
                                                    innerRef={register( { required: true } )}
                                                    className={classnames( 'erp-dropdown-select' )}
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
                                            disabled={( !uploadFiles.name || !uploadFiles.documentCategory )}
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
                                            isFileUploadComplete ? (
                                                <SingleStyleDocumentTable />

                                            ) : <AutoProgress />
                                        }
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>


                </CardBody>
            </Card>
            <FabricCategoryModal
                openModal={fabricCategoryOpenModal}
                setOpenModal={setFabricCategoryOpenModal}
            />
            {
                openBuyerColorModal && (
                    <AssignBuyerColorModal
                        buyerId={singleStyleBasicInfo?.buyer?.value ?? null}
                        openModal={openBuyerColorModal}
                        setOpenModal={setOpenBuyerColorModal}
                    />
                )
            }
        </div >
    );
};

export default SingleStyleAddForm;
