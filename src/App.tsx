import {Flex, Text, Image, SearchField, useTheme} from '@aws-amplify/ui-react';
import {useEffect, useState} from 'react';
import {COLOR} from './constants/color';
import {IMAGE} from './constants/image';
function App() {
    const { tokens } = useTheme();
    return (
        <Flex direction="column" gap={0}>
            <Flex
                backgroundColor={COLOR.WHITE}
                justifyContent="space-between"
                alignItems="center"
                height="4rem"
                padding="0 2rem">
                <Flex alignItems="center">
                    <Image
                        src={IMAGE.LOGO}
                        alt="logo"
                        height="3rem"
                        borderRadius="1rem"
                        onClick={() => (window.location.href = '/')}
                    />
                    <SearchField label="Search" placeholder="Search here..." />
                </Flex>
                <Flex alignItems="center">
                    <Text fontSize={tokens.fontSizes.medium} fontWeight={tokens.fontWeights.medium}>Hotline: </Text>
                    <Text fontSize={tokens.fontSizes.medium} fontWeight={tokens.fontWeights.medium} color={COLOR.PRIMARY}>
                        +61 4XX XXX XXX
                    </Text>
                </Flex>
            </Flex>
            <Flex
                backgroundColor={COLOR.BACKGROUND}
                height="calc(100vh - 4rem)"></Flex>
        </Flex>
    );
}

export default App;
