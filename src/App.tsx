import {
  Button,
  Center,
  Heading,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import pkg from '../package.json';

export function App() {
  const isDesktop = process.env.VITE_BUILD_PLATFORM === 'desktop';

  const { toggleColorMode } = useColorMode();

  function processComunication() {
    if (isDesktop) {
      import('./processCommunication').then(
        ({ sendToMain, sendUpdateBadge }) => {
          sendToMain('flashFrame');
          sendUpdateBadge(100);
        }
      );
    }
  }

  return (
    <Center
      flexDirection="column"
      h="100vh"
    >
      <Heading
        textAlign="center"
        mb="8"
      >
        Hello Electron!
      </Heading>

      <Heading textAlign="center">
        A template for building Electron apps with Vite, React and Chakra UI -
        version {pkg.version}
      </Heading>

      <VStack p="8">
        <Button
          onClick={() => toggleColorMode()}
          colorScheme="blue"
        >
          Toggle Color Mode
        </Button>

        {isDesktop && (
          <Button onClick={() => processComunication()}>
            Process Communication
          </Button>
        )}
      </VStack>
    </Center>
  );
}
