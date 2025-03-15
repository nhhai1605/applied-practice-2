import {
    Flex,
    Text,
    Image,
    SearchField,
    useTheme,
    Card,
    ToggleButton,
    Menu,
    IconsProvider,
} from '@aws-amplify/ui-react';
import {useEffect, useState} from 'react';
import Map, {Marker, NavigationControl, Source, Layer} from 'react-map-gl';
import {COLOR} from './constants/color';
import {IMAGE} from './constants/image';
import {LocationSearch} from '@aws-amplify/ui-react-geo';
import {LuArrowDown, LuArrowUp, LuSlidersHorizontal} from 'react-icons/lu';
import {SORTING} from './constants/enum';
function App() {
    const {tokens} = useTheme();
    const [distanceSort, setDistanceSort] = useState<SORTING>(SORTING.NONE);
    const [ratingSort, setRatingSort] = useState<SORTING>(SORTING.NONE);

    const controlSorting = (value: SORTING, setValue: any) => {
        if (value === SORTING.NONE) {
            setValue(SORTING.ASC);
        }
        if (value === SORTING.ASC) {
            setValue(SORTING.DESC);
        }
        if (value === SORTING.DESC) {
            setValue(SORTING.NONE);
        }
    };

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
                    <Text
                        fontSize={tokens.fontSizes.medium}
                        fontWeight={tokens.fontWeights.medium}>
                        Hotline:{' '}
                    </Text>
                    <Text
                        fontSize={tokens.fontSizes.medium}
                        fontWeight={tokens.fontWeights.medium}
                        color={COLOR.PRIMARY}>
                        +61 4XX XXX XXX
                    </Text>
                </Flex>
            </Flex>
            <Flex
                backgroundColor={COLOR.BACKGROUND}
                height="calc(100vh - 4rem)"
                alignContent="center"
                justifyContent="center"
                gap={0}>
                <Flex
                    width="100%"
                    direction="column"
                    gap={0}
                    margin="2rem 1rem 2rem 2rem">
                    <Text
                        fontSize={tokens.fontSizes.medium}
                        fontWeight={tokens.fontWeights.normal}>
                        +150 facilities
                    </Text>
                    <Text
                        fontSize={tokens.fontSizes.xxl}
                        fontWeight={tokens.fontWeights.bold}>
                        Facilities in Melbourne
                    </Text>
                    <Flex
                        alignItems={'center'}
                        marginTop={'1rem'}
                        justifyContent={'space-between'}>
                        <Flex alignItems={'center'} gap={'1rem'}>
                            <ToggleButton {...style.toggleButton}>
                                Available
                            </ToggleButton>
                            <ToggleButton {...style.toggleButton}>
                                {'< 1km'}
                            </ToggleButton>
                            <ToggleButton {...style.toggleButton}>
                                {'< 5km'}
                            </ToggleButton>
                            <ToggleButton {...style.toggleButton}>
                                {'< 10km'}
                            </ToggleButton>
                        </Flex>
                        <IconsProvider
                            icons={{
                                menu: {
                                    menu: <LuSlidersHorizontal />,
                                },
                            }}>
                            <Menu
                                menuAlign="end"
                                style={{
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                }}>
                                <Flex
                                    direction="column"
                                    gap={0}
                                    padding="0.5rem">
                                    <Flex gap={'1rem'} alignItems={'center'}>
                                        <Text>Sort By</Text>
                                        <ToggleButton
                                            {...style.toggleButton}
                                            isPressed={
                                                distanceSort != SORTING.NONE
                                            }
                                            onClick={() =>
                                                controlSorting(
                                                    distanceSort,
                                                    setDistanceSort,
                                                )
                                            }>
                                            Distance
                                            {distanceSort === SORTING.ASC ? 
                                                <LuArrowUp /> : 
                                                distanceSort === SORTING.DESC ? 
                                                <LuArrowDown /> : 
                                                null
                                            }
                                        </ToggleButton>
                                        <ToggleButton
                                            {...style.toggleButton}
                                            isPressed={
                                                ratingSort != SORTING.NONE
                                            }
                                            onClick={() =>
                                                controlSorting(
                                                    ratingSort,
                                                    setRatingSort,
                                                )
                                            }>
                                            Rating 
                                            {ratingSort === SORTING.ASC ? 
                                                <LuArrowUp /> : 
                                                ratingSort === SORTING.DESC ? 
                                                <LuArrowDown /> : 
                                                null
                                            }
                                        </ToggleButton>
                                    </Flex>
                                </Flex>
                            </Menu>
                        </IconsProvider>
                    </Flex>
                </Flex>
                <Card
                    width="100%"
                    margin="2rem 2rem 2rem 1rem"
                    backgroundColor={COLOR.WHITE}
                    variation="elevated">
                    Map goes here
                </Card>
            </Flex>
        </Flex>
    );
}

export default App;

const style: any = {
    toggleButton: {
        size: 'small',
        variation: 'primary',
        width: '7rem',
        borderRadius: '0.5rem',
    },
};
