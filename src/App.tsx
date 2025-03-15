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
    View,
    Button,
    Alert,
} from '@aws-amplify/ui-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import Map, {
    Marker,
    NavigationControl,
    Source,
    Layer,
    Popup,
} from 'react-map-gl';
import {COLOR} from './constants/color';
import {IMAGE} from './constants/image';
import {LocationSearch} from '@aws-amplify/ui-react-geo';
import {
    LuArrowDown,
    LuArrowUp,
    LuBuilding,
    LuShowerHead,
    LuSlidersHorizontal,
} from 'react-icons/lu';
import {FACILITY, SORTING} from './constants/enum';
import {AiFillStar} from 'react-icons/ai';
import {
    MdOutlineFastfood,
    MdOutlineLocalLaundryService,
    MdOutlineMedicalServices,
} from 'react-icons/md';
import {GoBriefcase} from 'react-icons/go';
import {Geo} from '@aws-amplify/geo';
import {CONFIG} from './constants/configuration';
import Swal from 'sweetalert2';

const defaultViewport = {latitude: 37.7749, longitude: -122.4194};

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
        name: 'Offer meals',
        icon: <MdOutlineFastfood />,
    },
    {
        id: 2,
        name: 'Job agency',
        icon: <GoBriefcase />,
    },
    {
        id: 3,
        name: 'Long term stay',
        icon: <LuBuilding />,
    },
    {
        id: 4,
        name: 'Showers',
        icon: <LuShowerHead />,
    },
    {
        id: 5,
        name: 'Laundry',
        icon: <MdOutlineLocalLaundryService />,
    },
    {
        id: 6,
        name: 'Medical',
        icon: <MdOutlineMedicalServices />,
    },
];

const getRandomOffset = (min: number, max: number) =>
    (Math.random() * (max - min) + min) / 111000;

const mockPlaces = [
    {
        id: 1,
        type: FACILITY.SHELTER,
        name: 'Place 1',
        image: getRandomMockImage(),
        distance: '1.2km (10 mins walk)',
        rating: 4.5,
        address: 'Address 1, 3xxx, VIC',
        features: [1, 3, 2, 5, 6, 4],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 2,
        type: FACILITY.FOOD_BANK,
        name: 'Place 2',
        image: getRandomMockImage(),
        distance: '1.5km (15 mins walk)',
        rating: 4.2,
        address: 'Address 2, 3xxx, VIC',
        features: [2],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 3,
        type: FACILITY.MEDICAL,
        name: 'Place 3',
        image: getRandomMockImage(),
        distance: '1.8km (20 mins walk)',
        rating: 4.8,
        address: 'Address 3, 3xxx, VIC',
        features: [3],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 4,
        type: FACILITY.MEDICAL,
        name: 'Place 4',
        image: getRandomMockImage(),
        distance: '0.5km (5 mins walk)',
        rating: 4.9,
        address: 'Address 4, 3xxx, VIC',
        features: [1, 2],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 5,
        type: FACILITY.SHELTER,
        name: 'Place 5',
        image: getRandomMockImage(),
        distance: '4.5km (45 mins walk)',
        rating: 4.7,
        address: 'Address 5, 3xxx, VIC',
        features: [2, 3],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 6,
        type: FACILITY.FOOD_BANK,
        name: 'Place 6',
        image: getRandomMockImage(),
        distance: '2.5km (25 mins walk)',
        rating: 4.3,
        address: 'Address 6, 3xxx, VIC',
        features: [1, 4, 5],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 7,
        type: FACILITY.SHELTER,
        name: 'Place 7',
        image: getRandomMockImage(),
        distance: '3.5km (35 mins walk)',
        rating: 4.6,
        address: 'Address 7, 3xxx, VIC',
        features: [2, 3, 6],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
    {
        id: 8,
        type: FACILITY.MEDICAL,
        name: 'Place 8',
        image: getRandomMockImage(),
        distance: '2.2km (22 mins walk)',
        rating: 4.4,
        address: 'Address 8, 3xxx, VIC',
        features: [1, 3, 5],
        latitude: defaultViewport.latitude + getRandomOffset(-500, 500),
        longitude: defaultViewport.longitude + getRandomOffset(-500, 500),
    },
];


function App() {
    const {tokens} = useTheme();
    const [searchValue, setSearchValue] = useState<string>('');
    const [distanceSort, setDistanceSort] = useState<SORTING>(SORTING.NONE);
    const [ratingSort, setRatingSort] = useState<SORTING>(SORTING.NONE);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [mapStyle, setMapStyle] = useState<any>(null);
    const [currentLocation, setCurrentLocation] =
        useState<any>(defaultViewport);
    const mapRef = useRef(null);
    const [route, setRoute] = useState<any>(null);
    const [isFetchingRoute, setIsFetchingRoute] = useState<boolean>(false);
    const [routeDestination, setRouteDestination] = useState<any>(null);
    const [viewport, setViewport] = useState<any>({
        latitude: defaultViewport.latitude,
        longitude: defaultViewport.longitude,
        zoom: 16,
    });
    
    const [places, setPlaces] = useState<any[]>(mockPlaces);

    const drawPlaceMarkers = useMemo(() => {
        return places.map(place => {
            const isSelected = selectedPlace === place;
            const iconColor = isSelected ? 'red' : 'gray';
            const iconSize = 30;

            let icon =
                place.type === FACILITY.SHELTER ? (
                    <LuBuilding color={iconColor} size={iconSize} />
                ) : place.type === FACILITY.FOOD_BANK ? (
                    <MdOutlineFastfood color={iconColor} size={iconSize} />
                ) : (
                    <MdOutlineMedicalServices
                        color={iconColor}
                        size={iconSize}
                    />
                );

            return (
                <Marker
                    key={place.id}
                    latitude={place.latitude}
                    longitude={place.longitude}>
                    {icon}
                </Marker>
            );
        });
    }, [selectedPlace, places]); // Recalculate when selectedPlace or places change

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

    function initializeMap(mapStyle = 'Standard') {
        const styleUrl = `https://maps.geo.${CONFIG.AWS_REGION}.amazonaws.com/v2/styles/${mapStyle}/descriptor?key=${CONFIG.API_KEY}&color-scheme=Light`;
        setMapStyle(styleUrl);
    }

    const mapMoveTo = (place: any) => {
        if (!place) return;
        (mapRef?.current as any).flyTo({
            center: [place.longitude, place.latitude],
            zoom: viewport.zoom,
            duration: 1000, // Smooth transition in milliseconds
            essential: true, // Ensures animation completes even if user interacts
        });
    };

    const fetchRoute = async (origin: any, destination: any) => {
        if (!origin || !destination) return null;
        setIsFetchingRoute(true);
        const url = `https://routes.geo.${CONFIG.AWS_REGION}.amazonaws.com/v2/routes?key=${CONFIG.API_KEY}`;

        const requestBody = {
            Origin: [origin.longitude, origin.latitude],
            Destination: [destination.longitude, destination.latitude],
            TravelMode: 'Pedestrian',
            Waypoints: [],
            DepartNow: true,
            LegGeometryFormat: 'Simple',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const data = await response.json();
            if (data && data.Routes.length > 0) {
                const legs = data.Routes[0].Legs;

                const features = legs.map((leg: any) => ({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: leg.Geometry?.LineString,
                    },
                }));

                const geoJsonRoute = {
                    type: 'FeatureCollection',
                    features,
                };
                setRoute(geoJsonRoute);
                mapMoveTo(origin);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch route',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
        setIsFetchingRoute(false);
    };

    useEffect(() => {
        if (searchValue === '') {
            setPlaces(mockPlaces);
        } else {
            setPlaces(
                mockPlaces.filter(place =>
                    place.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()),
                ),
            );
        }
    }, [searchValue]);

    useEffect(() => {
        initializeMap();
    }, []);

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
                    <SearchField
                        label="Search"
                        placeholder="Search here..."
                        onChange={e => {
                            setSearchValue(e.target.value);
                        }}
                        value={searchValue}
                        onClear={() => {
                            setSearchValue('');
                        }}
                    />
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
                                <Card
                                    key={index}
                                    {...style.placeCard}
                                    onClick={() => {
                                        if (selectedPlace === item) {
                                            setSelectedPlace(null);
                                        } else {
                                            setSelectedPlace(item);
                                            mapMoveTo(item);
                                        }
                                    }}
                                    backgroundColor={
                                        selectedPlace === item
                                            ? COLOR.SECONDARY
                                            : COLOR.WHITE
                                    }>
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
                                                    items={mockListFeatures
                                                        .filter(feature =>
                                                            item.features.includes(
                                                                feature.id,
                                                            ),
                                                        )
                                                        .map(
                                                            feature =>
                                                                feature.name,
                                                        )}
                                                    type="list"
                                                    direction="row"
                                                    wrap={'wrap'}
                                                    gap="0.5rem">
                                                    {(item, index) => (
                                                        <Badge
                                                            size="small"
                                                            key={index}
                                                            backgroundColor={
                                                                COLOR.PRIMARY
                                                            }
                                                            color={COLOR.WHITE}
                                                            borderRadius="0.5rem">
                                                            {
                                                                mockListFeatures.find(
                                                                    feature =>
                                                                        feature.name ===
                                                                        item,
                                                                )?.icon
                                                            }
                                                            <Text
                                                                color={
                                                                    'inherit'
                                                                }
                                                                marginLeft={
                                                                    '0.5rem'
                                                                }>
                                                                {item}
                                                            </Text>
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
                    <Map
                        ref={mapRef} // Attach map reference
                        initialViewState={viewport}
                        style={{width: '100%', height: '100%'}}
                        mapStyle={mapStyle}
                        // onMove={evt => setViewport(evt.viewState)}
                        // onClick={e => {
                        //     const {lng, lat} = e.lngLat; // Get longitude and latitude from the click event
                        //     setCurrentLocation({latitude: lat, longitude: lng});
                        // }}
                    >
                        <NavigationControl position="top-right" />
                        {currentLocation && (
                            <Marker
                                latitude={currentLocation.latitude}
                                longitude={currentLocation.longitude}
                                color="blue"
                            />
                        )}
                        {drawPlaceMarkers}
                        {selectedPlace && (
                            <Popup
                                longitude={selectedPlace.longitude}
                                latitude={selectedPlace.latitude}
                                offset={[0, -20]}
                                anchor="bottom">
                                <Flex
                                    direction={'column'}
                                    gap={'0.5rem'}
                                    width={'100%'}>
                                    <Image
                                        src={selectedPlace.image}
                                        alt="map place image"
                                        width={'100%'}
                                        aspectRatio={4 / 3}
                                        borderRadius={'0.5rem'}
                                    />
                                    <Text
                                        fontSize={tokens.fontSizes.large}
                                        fontWeight={tokens.fontWeights.bold}>
                                        {selectedPlace.name}
                                    </Text>
                                    <Text
                                        fontSize={tokens.fontSizes.medium}
                                        fontWeight={tokens.fontWeights.normal}>
                                        {selectedPlace.address}
                                    </Text>
                                    <Text
                                        fontSize={tokens.fontSizes.medium}
                                        fontWeight={tokens.fontWeights.normal}>
                                        {selectedPlace.distance}
                                    </Text>
                                    <Flex alignItems={'center'} gap={'0.5rem'}>
                                        <AiFillStar color={COLOR.RATING} />
                                        <Text
                                            fontSize={tokens.fontSizes.medium}
                                            fontWeight={
                                                tokens.fontWeights.normal
                                            }>
                                            {selectedPlace.rating}
                                        </Text>
                                    </Flex>
                                    <Button
                                        onClick={() => {
                                            if (
                                                routeDestination ==
                                                selectedPlace
                                            ) {
                                                setRoute(null);
                                                setRouteDestination(null);
                                            } else {
                                                setRouteDestination(
                                                    selectedPlace,
                                                );
                                                fetchRoute(
                                                    currentLocation,
                                                    selectedPlace,
                                                );
                                            }
                                        }}
                                        loadingText="Finding route..."
                                        isLoading={isFetchingRoute}
                                        isDisabled={isFetchingRoute}>
                                        {routeDestination == selectedPlace
                                            ? 'Stop'
                                            : 'Get Direction'}
                                    </Button>
                                </Flex>
                            </Popup>
                        )}
                        {route && (
                            <Source
                                id="route-source"
                                type="geojson"
                                data={route}>
                                <Layer
                                    id="route-layer"
                                    type="line"
                                    source="route-source"
                                    layout={{
                                        'line-join': 'round',
                                        'line-cap': 'round',
                                    }}
                                    paint={{
                                        'line-color': '#ff0000',
                                        'line-width': 2,
                                    }}
                                />
                            </Source>
                        )}
                    </Map>
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
        borderRadius: '0.25rem',
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

// When query place, also join with the rate
// Table Name: Place
// Primary Key: PlaceID (unique identifier for each place)
// Attributes:
// Name: Name of the place (e.g., "Coffee Shop").
// Address: Address of the place (e.g. 1xxx, Point Cook, 3030, VIC). ==> Just for display
// Latitude: Latitude of the place.
// Longitude: Longitude of the place.
// Can use these 2 attributes: use this and update when add into the Rate table ==> may be faster when data is large and if the query is complex or usually query (our case)
// Avg Ratings:
// Total Ratings:

// Table Name: Rate
// Primary Key: RateID (unique identifier for each rate)
// Attributes:
// UserID: FK from User ===> Can allow rating from anonymous by use localStorage to track rated or not
// PlaceID: FK from Place
// Rating: 1 -> 5

// UPDATE Place
// SET
//     AverageRating = (SELECT AVG(Rating) FROM Rate WHERE PlaceID = 1),
//     TotalRatings = (SELECT COUNT(*) FROM Rate WHERE PlaceID = 1)
// WHERE PlaceID = 1;

// or CREATE INDEX if JOIN whenever query

// CREATE INDEX idx_placeid_rate ON Rate (PlaceID);
// CREATE INDEX idx_placeid_place ON Place (PlaceID);

// const getSuburbBoundingBox = async (suburbName) => {
//     try {
//         const results = await Geo.searchByText(suburbName, {
//             maxResults: 1, // Only get the first result
//         });

//         if (results.length > 0) {
//             const boundingBox = results[0].boundingBox; // Get the bounding box
//             return boundingBox; // { westLongitude, southLatitude, eastLongitude, northLatitude }
//         } else {
//             throw new Error('Suburb not found');
//         }
//     } catch (error) {
//         console.error('Error geocoding suburb:', error);
//         return null;
//     }
// };

// // Search by bounding box, not by the address input ==> use the location search to get the suburb,
// // then get the bounding box, then find places withing this bounding box
// const getPlacesByBoundingBox = async (boundingBox) => {
//     const { westLongitude, southLatitude, eastLongitude, northLatitude } = boundingBox;

//     try {
//         const params = {
//             TableName: 'Places',
//             FilterExpression: 'Latitude BETWEEN :south AND :north AND Longitude BETWEEN :west AND :east',
//             ExpressionAttributeValues: {
//                 ':south': southLatitude,
//                 ':north': northLatitude,
//                 ':west': westLongitude,
//                 ':east': eastLongitude,
//             },
//         };

//         const result = await dynamoDb.scan(params).promise();
//         return result.Items; // List of places in the bounding box
//     } catch (error) {
//         console.error('Error querying places by bounding box:', error);
//         return [];
//     }
// };
