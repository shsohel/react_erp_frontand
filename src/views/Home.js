import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap';


const Home = () => {
  const baseModule = localStorage.getItem( 'module' );

  return (
    <div>


      <Card>
        <CardHeader>
          <CardTitle>Welcome to {baseModule} Module</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            We are working .....
          </CardText>

        </CardBody>
      </Card>

    </div>
  );
};

export default Home;
