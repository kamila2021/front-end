import { Box } from 'native-base';
import useStore from '../stores/useStore';
import { Text } from 'native-base';

const Home = () => {
  const { user } = useStore();
  return (
    <Box
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '7%',
        marginVertical: '10%',
      }}
    >
      <Text>Hello world!{user}</Text>
    </Box>
  );
};

export default Home;
