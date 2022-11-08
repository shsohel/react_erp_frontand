import themeConfig from '@configs/themeConfig';
import notAuthImg from '@src/assets/images/pages/not-authorized.svg';
import '@styles/base/pages/page-misc.scss';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';


const NotAuthorized = () => {
  const { goBack } = useHistory();
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img src={themeConfig.app.appLogoImage} width={35} alt='logo' />

        {/* <h2 className='brand-text text-primary ml-1'>QuadRION</h2> */}
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>You are not authorized! 🔐</h2>
          <p className='mb-2'>
            The Webtrends Marketing Lab website in IIS uses the default IUSR account credentials to access the web pages
            it serves.
          </p>
          <Button tag={Link} to='/login' color='primary' className='btn-sm-block mb-1 mr-1'>
            Back to login
          </Button>
          <Button tag={Link} to='/login' color='primary' className='btn-sm-block mb-1 mr-1'>
            Home
          </Button>
          <Button onClick={() => { goBack(); }} color='primary' className='btn-sm-block mb-1 '>
            Go Back
          </Button>
          <img className='img-fluid' src={notAuthImg} alt='Not authorized page' />
        </div>
      </div>
    </div>
  );
};
export default NotAuthorized;
