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
    Collection,
    ScrollView,
    Badge,
} from '@aws-amplify/ui-react';
import {useEffect, useState} from 'react';
import Map, {Marker, NavigationControl, Source, Layer} from 'react-map-gl';
import {COLOR} from './constants/color';
import {IMAGE} from './constants/image';
import {LocationSearch} from '@aws-amplify/ui-react-geo';
import {LuArrowDown, LuArrowUp, LuBuilding, LuShowerHead, LuSlidersHorizontal} from 'react-icons/lu';
import {SORTING} from './constants/enum';
import {AiFillStar} from 'react-icons/ai';
import { MdOutlineFastfood, MdOutlineLocalLaundryService, MdOutlineMedicalServices } from 'react-icons/md';
import { GoBriefcase } from 'react-icons/go';

function App() {
    const {tokens} = useTheme();
    const [distanceSort, setDistanceSort] = useState<SORTING>(SORTING.NONE);
    const [ratingSort, setRatingSort] = useState<SORTING>(SORTING.NONE);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    
    const getRandomMockImage = () => {
        const mockImages = [
            IMAGE.MOCK_PLACE_1,
            IMAGE.MOCK_PLACE_2,
            IMAGE.MOCK_PLACE_3,
            IMAGE.MOCK_PLACE_4,
            IMAGE.MOCK_PLACE_5,
            IMAGE.MOCK_PLACE_6,
            IMAGE.MOCK_PLACE_7,
        ];
        const randomIndex = Math.floor(Math.random() * mockImages.length);
        return mockImages[randomIndex];
    };

    const mockListFeatures = [
        {
            id: 1,
            name: "Offer meals",
            icon: <MdOutlineFastfood />
        },
        {
            id: 2,
            name: "Job agency",
            icon: <GoBriefcase />
        },
        {
            id: 3,
            name: "Long term stay",
            icon: <LuBuilding />
        },
        {
            id: 4,
            name: "Showers",
            icon: <LuShowerHead />
        },
        {
            id: 5,
            name: "Laundry",
            icon: <MdOutlineLocalLaundryService />
        },
        {
            id: 6,
            name: "Medical",
            icon: <MdOutlineMedicalServices />
        }
    ]

    const [places, setPlaces] = useState<any[]>([
        {
            name: 'Place 1',
            image: getRandomMockImage(),
            distance: '1.2km (10 mins walk)',
            rating: 4.5,
            address: 'Address 1, 3xxx, VIC',
            features: [1, 3, 2, 5, 6, 4]
        },
        {
            name: 'Place 2',
            image: getRandomMockImage(),
            distance: '1.5km (15 mins walk)',
            rating: 4.2,
            address: 'Address 2, 3xxx, VIC',
            features: [2]
        },
        {
            name: 'Place 3',
            image: getRandomMockImage(),
            distance: '1.8km (20 mins walk)',
            rating: 4.8,
            address: 'Address 3, 3xxx, VIC',
            features: [3]
        },
        {
            name: 'Place 4',
            image: getRandomMockImage(),
            distance: '0.5km (5 mins walk)',
            rating: 4.9,
            address: 'Address 4, 3xxx, VIC',
            features: [1, 2]
        },
        {
            name: 'Place 5',
            image: getRandomMockImage(),
            distance: '4.5km (45 mins walk)',
            rating: 4.7,
            address: 'Address 5, 3xxx, VIC',
            features: [2, 3]
        },
        {
            name: 'Place 6',
            image: getRandomMockImage(),
            distance: '2.5km (25 mins walk)',
            rating: 4.3,
            address: 'Address 6, 3xxx, VIC',
            features: [1, 4, 5]
        },
        {
            name: 'Place 7',
            image: getRandomMockImage(),
            distance: '3.5km (35 mins walk)',
            rating: 4.6,
            address: 'Address 7, 3xxx, VIC',
            features: [2, 3, 6]
        },
        {
            name: 'Place 8',
            image: getRandomMockImage(),
            distance: '2.2km (22 mins walk)',
            rating: 4.4,
            address: 'Address 8, 3xxx, VIC',
            features: [1, 3, 5]
        }
    ]);

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
                justifyContent="space-between"
                backgroundColor={COLOR.WHITE}
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
                    {
                        //#region Header
                    }
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
                    {
                        //#endregion Header
                    }

                    {
                        //#region Filter
                    }
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
                                            {distanceSort === SORTING.ASC ? (
                                                <LuArrowUp />
                                            ) : distanceSort ===
                                              SORTING.DESC ? (
                                                <LuArrowDown />
                                            ) : null}
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
                                            {ratingSort === SORTING.ASC ? (
                                                <LuArrowUp />
                                            ) : ratingSort === SORTING.DESC ? (
                                                <LuArrowDown />
                                            ) : null}
                                        </ToggleButton>
                                    </Flex>
                                </Flex>
                            </Menu>
                        </IconsProvider>
                    </Flex>
                    {
                        //#endregion Filter
                    }

                    {
                        //#region List
                    }
                    <ScrollView marginTop={'1rem'}>
                        <Collection
                            items={places}
                            marginRight={'1rem'}
                            marginBottom={'1rem'}
                            type="list"
                            direction="column"
                            gap="1rem"
                            wrap="wrap">
                            {(item, index) => (
                                <Card key={index} {...style.placeCard} onClick={()=>{
                                    if(selectedPlace === item) {
                                        setSelectedPlace(null);
                                    }
                                    else {
                                        setSelectedPlace(item);
                                    }
                                }} backgroundColor={selectedPlace === item ? COLOR.SECONDARY : COLOR.WHITE}>
                                    <Flex
                                        direction={'row'}
                                        gap={'1rem'}
                                        height={'100%'}
                                        alignItems={'center'}>
                                        <Image
                                            src={item.image}
                                            alt="place image"
                                            height={'100%'}
                                            aspectRatio={4 / 3}
                                            borderRadius={'0.5rem'}
                                        />
                                        <Flex
                                            direction={'column'}
                                            gap={0}
                                            height={'100%'}
                                            width={'100%'}
                                            padding={'0rem'}>
                                            <Text
                                                fontSize={
                                                    tokens.fontSizes.large
                                                }
                                                fontWeight={
                                                    tokens.fontWeights.bold
                                                }>
                                                {item.name}
                                            </Text>
                                            <Text
                                                fontSize={
                                                    tokens.fontSizes.medium
                                                }
                                                fontWeight={
                                                    tokens.fontWeights.normal
                                                }>
                                                {item.address}
                                            </Text>
                                            <Text
                                                fontSize={
                                                    tokens.fontSizes.medium
                                                }
                                                fontWeight={
                                                    tokens.fontWeights.normal
                                                }>
                                                {item.distance}
                                            </Text>
                                            <Flex
                                                alignItems={'center'}
                                                gap={'0.5rem'}>
                                                <AiFillStar
                                                    color={COLOR.RATING}
                                                />
                                                <Text
                                                    fontSize={
                                                        tokens.fontSizes.medium
                                                    }
                                                    fontWeight={
                                                        tokens.fontWeights
                                                            .normal
                                                    }>
                                                    {item.rating}
                                                </Text>
                                            </Flex>
                                            <ScrollView width={'100%'}>
                                                <Collection
                                                    items={mockListFeatures.filter(feature => item.features.includes(feature.id)).map(feature => feature.name)}
                                                    type="list"
                                                    direction="row"
                                                    wrap={'wrap'}
                                                    gap="0.5rem">
                                                    {(item, index) => (
                                                        <Badge size='small' key={index} backgroundColor={COLOR.PRIMARY} color={COLOR.WHITE} borderRadius="0.5rem">
                                                            {mockListFeatures.find(feature => feature.name === item)?.icon}
                                                            <Text color={'inherit'} marginLeft={'0.5rem'}>{item}</Text>
                                                        </Badge>
                                                    )}
                                                </Collection>
                                            </ScrollView>
                                        </Flex>
                                    </Flex>
                                </Card>
                            )}
                        </Collection>
                    </ScrollView>
                    {
                        //#endregion List
                    }
                </Flex>
                <Card
                    width="100%"
                    margin="2rem 2rem 2rem 1rem"
                    backgroundColor={COLOR.WHITE}
                    variation="elevated">
                    {
                        selectedPlace ? `Detail of ${selectedPlace.name}` : "Select a place to view details"
                    }
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
    placeCard: {
        variation: 'elevated',
        width: '100%',
        height: '10rem',
        backgroundColor: COLOR.WHITE,
        padding: '1rem',
        borderRadius: '0.5rem',
    },
};
