import Spinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/merchandising/form/style-form.scss';
import '@custom-styles/merchandising/merchandising-core.scss';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Badge, Button, Card, CardBody, Col, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import AutoProgress from '../../../../../utility/custom/AutoProgress';
import LabelBox from '../../../../../utility/custom/LabelBox';
import OperationProgress from '../../../../../utility/custom/OperationProgress';
import { isPermit } from '../../../../../utility/Utils';
import StyleSearchableListModal from '../form/StyleSearchableListModal';
import {
    getStyleById,
    getUploadedFileBySingleStyleId,
    getUploadedImagesBySingleStyleId
} from '../store/actions';
import SingleStyleDocumentTable from './SingleStyleDocumentTable';
import SingleStylePhotoDetails from './SingleStylePhotoDetails';

const initialFilesUpload = {
    id: 0,
    name: '',
    type: '',
    file: null,
    uploadDate: '',
    documentCategory: null
};

const SingleStyleDetails = () => {
    const { replace } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();
    console.log( state );
    const styleId = state;

    const {
        singleStyleBasicInfo,
        isFileUploadComplete,
        isPhotoUploadComplete,
        isSingleStyleDataProgress,
        isSingleStyleDataLoaded
    } = useSelector( ( { styles } ) => styles );
    const { authenticateUser, userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    useEffect( () => {
        dispatch( getStyleById( styleId ) );

    }, [dispatch, styleId] );


    const [styleSearchModalOpen, setStyleSearchModalOpen] = useState( false );

    const handleStyleSearchModalOpen = () => {
        setStyleSearchModalOpen( !styleSearchModalOpen );
    };


    const handleCancel = () => {
        replace( '/single-styles' );
        dispatch( getStyleById( null ) );
        dispatch( getUploadedFileBySingleStyleId( null ) );
        dispatch( getUploadedImagesBySingleStyleId( null ) );
    };


    const handleAddNew = () => {
        replace( '/new-single-style' );
        dispatch( getStyleById( null ) );
        dispatch( getUploadedFileBySingleStyleId( null ) );
        dispatch( getUploadedImagesBySingleStyleId( null ) );
    };
    const handleEdit = () => {
        replace( { pathname: '/edit-style', state: styleId } );
    };


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
            name: 'Single Style Edit',
            link: '/edit-style',
            state: styleId,
            isActive: true
        }
    ];
    return (
        <div >
            <div hidden={!isSingleStyleDataProgress}>
                <Spinner />
            </div>
            <ActionMenu breadcrumb={breadcrumb} title='Single Style Details' >

                <NavItem
                    hidden={!isPermit( userPermission?.StyleEdit, authPermissions )}
                    className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={() => { handleEdit(); }} >
                        Edit
                    </NavLink>
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
                <NavItem
                    className="mr-1"
                    hidden={!isPermit( userPermission?.StyleCreate, authPermissions )}
                >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={() => { handleAddNew(); }}                    >
                        Add New
                    </NavLink>
                </NavItem>
                <OperationProgress progress={isSingleStyleDataProgress} />

            </ActionMenu>
            <Card hidden={isSingleStyleDataProgress} className=" mt-3 style-form" >
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
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-3-style' for='styleNoId'> SYS ID</Label>
                                                            <Label className='custom-form-colons col-div-3-style'> : </Label>
                                                            <div className='custom-form-group '>

                                                                <div className=' custom-form-input-group style-col-div-3'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <LabelBox text={singleStyleBasicInfo.sysId} />

                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>
                                                                        <Button.Ripple
                                                                            className='btn-icon'
                                                                            outline
                                                                            size="sm"
                                                                            color='secondary'
                                                                            onClick={() => { handleStyleSearchModalOpen(); }}
                                                                        >
                                                                            <Search size={16} />
                                                                        </Button.Ripple>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label ' for='yearId'> Description</Label>
                                                            <Label className='custom-form-colons '> : </Label>
                                                            <div className='custom-form-group '>

                                                                <LabelBox text={singleStyleBasicInfo.description} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label ' for='yearId'> Date</Label>
                                                            <Label className='custom-form-colons '> : </Label>
                                                            <div className='custom-form-group'>

                                                                <LabelBox text={moment( Date.parse( singleStyleBasicInfo?.creationDate ) ).format( 'DD-MM-yy' )} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-3-style' for='styleNoId'> Buyer Style NO </Label>
                                                            <Label className='custom-form-colons col-div-3-style'> : </Label>
                                                            <div className='custom-form-group col-div-3-style'>
                                                                <LabelBox text={singleStyleBasicInfo.styleNo} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='seasonId'> Season </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.season?.label} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='yearId'> Year </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.year?.label} />
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
                                                            <Label className='custom-form-label' for='buyerId'> Buyer </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>

                                                                <LabelBox text={singleStyleBasicInfo.buyer?.label} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='buyerDepartmentId'> Buyer Dept. </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.buyerDepartment?.label} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='buyerAgentId'> Buyer Agent</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.agent?.label} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>

                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='buyerProductDeveloperId'> Buyer Pro. Dev.</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.buyerProductDeveloper?.label} />
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
                                                            <Label className='custom-form-label' for='divisionId'> Style Division </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.styleDivision?.label} />
                                                            </div>
                                                        </div>

                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='styleDepartmentId'>Style Dept. </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>

                                                                <LabelBox text={singleStyleBasicInfo.styleDepartment?.label} />

                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='productCategoryId'> Product Cat. </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <LabelBox text={singleStyleBasicInfo.productCategory?.label} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='productCategoryId'> Style Category </Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>

                                                                <LabelBox text={singleStyleBasicInfo.styleCategory?.label} />

                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                                        <Row>
                                                            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                                <div className='custom-form-main'>
                                                                    <Label className='custom-form-label col-div-6' for='sizeGroupIds'> Size Rang </Label>
                                                                    <Label className='custom-form-colons col-div-6'> : </Label>
                                                                    <div className='custom-form-group col-div-6'>
                                                                        <LabelBox text={singleStyleBasicInfo.sizeGroups.map( ( sg, index ) => (
                                                                            <Fragment key={index + 1}>
                                                                                <Badge color='primary' style={{ marginRight: '.5rem' }}>
                                                                                    {sg.label}
                                                                                </Badge>
                                                                            </Fragment>
                                                                        ) )} />


                                                                    </div>
                                                                </div>

                                                            </Col>
                                                            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                                                <div className='custom-form-main'>
                                                                    <Label className='custom-form-label col-div-6' for='colorIds'>Color  </Label>
                                                                    <Label className='custom-form-colons col-div-6'> : </Label>
                                                                    <div className='custom-form-group col-div-6'>
                                                                        <LabelBox text={singleStyleBasicInfo.colors.map( ( c, index ) => (
                                                                            <Fragment key={index + 1}>
                                                                                <Badge color='primary' style={{ marginRight: '.5rem' }}>
                                                                                    {c.label}
                                                                                </Badge>
                                                                            </Fragment>
                                                                        ) )} />
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>


                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label  ' for='merchandiserId'>Merchandiser</Label>
                                                            <Label className='custom-form-colons  '> : </Label>
                                                            <div className='custom-form-group '>

                                                                <LabelBox text={singleStyleBasicInfo?.merchandiser?.label} />

                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label ' for='statusId'>S. Assignee</Label>
                                                            <Label className='custom-form-colons  '> : </Label>
                                                            <div className='custom-form-group  '>

                                                                <LabelBox text={singleStyleBasicInfo?.sampleAssignee?.label ?? ''} />

                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={6} xl={6} >
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label col-div-3-style-pp' for='proProcId'>Prod. Process</Label>
                                                            <Label className='custom-form-colons col-div-3-style-pp '> : </Label>
                                                            <div className='custom-form-group col-div-3-style-pp'>

                                                                <LabelBox text={singleStyleBasicInfo?.productionProcess?.label} />

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
                                                            <Label className='custom-form-label col-div-9' for='merchandiserId'>Fabric Cat.</Label>
                                                            <Label className='custom-form-colons  col-div-9'> : </Label>
                                                            <div className='custom-form-group  col-div-9'>
                                                                <div className='custom-form-input-group style'>
                                                                    <div className='custom-input-group-prepend inside-btn'>


                                                                        <LabelBox text={singleStyleBasicInfo?.defaultFabDescValue?.label} />
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </Col>


                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label ' for='statusId'>Status </Label>
                                                            <Label className='custom-form-colons  '> : </Label>
                                                            <div className='custom-form-group '>

                                                                <LabelBox text={singleStyleBasicInfo?.status?.label} />

                                                            </div>
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <SingleStylePhotoDetails />
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

                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='remarksId'>Remarks</Label>
                                                    <Label className='custom-form-colons col-div-6 '> : </Label>
                                                    <div className='custom-form-group  col-div-6'>

                                                        <LabelBox text={singleStyleBasicInfo.remarks} />

                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='spInstructionId'>Sp. Instruction</Label>
                                                    <Label className='custom-form-colons  col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6 '>

                                                        <LabelBox text={singleStyleBasicInfo.additionalInstruction} />

                                                    </div>
                                                </div>
                                            </Col>

                                        </Row>
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

                </CardBody >
            </Card >

            {/* <FabricCategoryModal
                openModal={fabricCategoryOpenModal}
                setOpenModal={setFabricCategoryOpenModal}
            />
            {
                styleSearchModalOpen && <StyleSearchableListModal
                    setOpenModal={setStyleSearchModalOpen}
                    openModal={styleSearchModalOpen}
                />
            }

            {
                openBuyerColorModal && (
                    <AssignBuyerColorModal
                        buyerId={singleStyleBasicInfo?.buyer?.value ?? null}
                        openModal={openBuyerColorModal}
                        setOpenModal={setOpenBuyerColorModal}
                    />
                )
            } */}


            {
                styleSearchModalOpen && <StyleSearchableListModal
                    setOpenModal={setStyleSearchModalOpen}
                    openModal={styleSearchModalOpen}
                    searchFor="style-details"
                />
            }

        </div >
    );
};

export default SingleStyleDetails;
