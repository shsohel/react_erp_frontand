import '@custom-styles/merchandising/merchandising-core.scss';
import '@styles/react/libs/react-select/_react-select.scss';
import BuyerList from './BuyerList';


const Buyers = () => {
  return (
    <div className='merchandising-buyer-list' >
      <BuyerList />
    </div>
  );
};

export default Buyers;
