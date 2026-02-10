import React from "react";
import {
    AppShell,
    Box,
    Button,
    Divider,
    Group,
    Image,
    InputLabel,
    NativeSelect,
    NumberInput,
    SegmentedControl,
    Select,
    Stack,
    Switch,
    Text,
    Tooltip,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";

import { DeckBackIcon } from "../../Rendering/deckStakeIcons.tsx";
import {
    IconFileText,
    IconJoker,
    IconLayout,
    IconListSearch,
    IconPlayCard
} from "@tabler/icons-react";
import { useCardStore } from "../../../modules/state/store.ts";
import UnlocksModal from "../../unlocksModal.tsx";
import FeaturesModal from "../../FeaturesModal.tsx";

import {RerollCalculatorModal} from "../../RerollCalculatorModal.tsx";
import {GaEvent} from "../../../modules/useGA.ts";
import { DrawSimulatorModal } from "../../DrawSimulatorModal.tsx";
import SeedInputAutoComplete from "../../SeedInputAutoComplete.tsx";


export default function NavBar() {
    const theme = useMantineTheme()
    const colorScheme = useMantineColorScheme()
    const viewMode = useCardStore(state => state.applicationState.viewMode);
    const setViewMode = useCardStore(state => state.setViewMode);
    const settingsOpen = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);

    const analyzeState = useCardStore(state => state.engineState);
    const { seed, deck, stake, gameVersion: version, minAnte, maxAnte, cardsPerAnte } = analyzeState;
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const useCardPeek = useCardStore(state => state.applicationState.useCardPeek);
    const setUseCardPeek = useCardStore(state => state.setUseCardPeek);
    const maxMiscCardSource = useCardStore(state => state.applicationState.maxMiscCardSource);
    const setMiscMaxSource = useCardStore(state => state.setMiscMaxSource);

    const setSeed = useCardStore(state => state.setSeed);
    const setDeck = useCardStore(state => state.setDeck);
    const setStake = useCardStore(state => state.setStake);
    const setVersion = useCardStore(state => state.setGameVersion);
    const setMaxAnte = useCardStore(state => state.setMaxAnte);
    const setCardsPerAnte = useCardStore(state => state.setCardsPerAnte);
    const setShowCardSpoilers = useCardStore(state => state.setShowCardSpoilers);
    const setStart = useCardStore(state => state.setStart);
    const openSelectOptionModal = useCardStore(state => state.openSelectOptionModal);
    const openFeaturesModal = useCardStore(state => state.openFeaturesModal);
    const openSnapshotModal = useCardStore(state => state.openSnapshotModal);
    const rerollCalculatorModalOpen = useCardStore(state => state.applicationState.rerollCalculatorModalOpen);
    const rerollCalculatorMetadata = useCardStore(state => state.applicationState.rerollCalculatorMetadata);
    const closeRerollCalculatorModal = useCardStore(state => state.closeRerollCalculatorModal);
    const reset = useCardStore(state => state.reset);

    const handleAnalyzeClick = () => {
        setStart(true);
    }


    const handleViewModeChange = (value: string) => {
        // If clicking JAML (custom), close the menu
        if (value === 'custom') {
            toggleSettings(); // Close the menu
        } else {
            // If switching from JAML to another view, switch to Blueprint instead
            const nextView = viewMode === 'custom' ? 'blueprint' : value;
            setViewMode(nextView);
        }
        setViewMode(value);
    }

    return (
        <AppShell.Navbar
            p="xs"
            hidden={!settingsOpen}
            style={{
                minWidth: 250,
                maxWidth: 'min(450px, 100%)',
                overscrollBehavior: 'contain',
                overflowX: 'hidden',
                overflowY: 'auto',
                height: 'calc(100dvh - 60px)',
                maxHeight: 'calc(100dvh - 60px)',
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: 'calc(var(--mantine-spacing-sm) + env(safe-area-inset-bottom, 0px))',
            }}
        >
            <UnlocksModal />
            <FeaturesModal />
            <DrawSimulatorModal />
            <RerollCalculatorModal
                opened={rerollCalculatorModalOpen}
                onClose={closeRerollCalculatorModal}
                targetIndex={rerollCalculatorMetadata?.index ?? 0}
                metaData={rerollCalculatorMetadata}
            />
            <AppShell.Section px={0} style={{ flex: '0 0 auto' }}>
                <SegmentedControl
                    id="view-mode"
                    fullWidth
                    value={viewMode}
                    onChange={handleViewModeChange}
                    data={[
                        {
                            value: 'blueprint',
                            label: (
                                <Group gap={4} wrap="nowrap" align="center">
                                    <IconLayout size={12} />
                                    <Text size="sm" style={{ whiteSpace: 'nowrap' }}>Blueprint</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'simple',
                            label: (
                                <Group gap={4} wrap="nowrap" align="center">
                                    <IconListSearch size={12} />
                                    <Text size="sm" style={{ whiteSpace: 'nowrap' }}>Efficiency</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'text',
                            label: (
                                <Group gap={4} wrap="nowrap" align="center">
                                    <IconFileText size={12} />
                                    <Text size="sm" style={{ whiteSpace: 'nowrap' }}>Text</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'jaml',
                            label: (
                                <Group gap={4} wrap="nowrap" align="center">
                                    <Image
                                        src={`${import.meta.env.BASE_URL}images/JAML.ico`}
                                        alt="JAML"
                                        w={18}
                                        h={18}
                                        fit="contain"
                                    />
                                    <Text size="sm" style={{ whiteSpace: 'nowrap' }}>JAML</Text>
                                </Group>
                            )
                        }
                    ]}
                    mb="xs"
                    size="sm"
                />
                <Divider mb='md' />
                <Group align={'flex-end'}>
                    <Select
                        label={'Choose Deck'}
                        value={deck}
                        onChange={(value) => {
                            if (value) setDeck(value);
                        }}
                        size="sm"
                        data={[
                            "Red Deck",
                            "Blue Deck",
                            "Yellow Deck",
                            "Green Deck",
                            "Black Deck",
                            "Magic Deck",
                            "Nebula Deck",
                            "Ghost Deck",
                            "Abandoned Deck",
                            "Checkered Deck",
                            "Zodiac Deck",
                            "Painted Deck",
                            "Anaglyph Deck",
                            "Plasma Deck",
                            "Erratic Deck"
                        ]}
                        leftSection={deck ? <DeckBackIcon deckName={deck} /> : null}
                    />
                    <Select
                        label={'Choose Stake'}
                        value={stake}
                        onChange={(value) => {
                            if (value) setStake(value);
                        }}
                        size="sm"
                        data={[
                            "White Stake",
                            "Red Stake",
                            "Green Stake",
                            "Black Stake",
                            "Blue Stake",
                        ]}
                        leftSection={stake ? <DeckBackIcon deckName={deck} /> : null}
                    />
                </Group>
                <InputLabel>Cards per Ante</InputLabel>
                <Button.Group w={'100%'} mb="xs">
                    <Button variant="default" size="sm" onClick={() => setCardsPerAnte(50)}>50</Button>
                    <Button variant="default" size="sm" onClick={() => setCardsPerAnte(Math.max(cardsPerAnte - 50, 0))}>-50</Button>
                    <Button.GroupSection flex={1} variant="default" miw={60} style={{ fontSize: 'var(--mantine-font-size-sm)', padding: '2px 8px', fontWeight: 800, textAlign: 'center' }}>
                        {cardsPerAnte}
                    </Button.GroupSection>
                    <Button variant="default" size="sm"
                        onClick={() => setCardsPerAnte(Math.min(cardsPerAnte + 50, 1000))}>+50</Button>
                    <Button variant="default" size="sm" onClick={() => setCardsPerAnte(1000)}>1000</Button>
                </Button.Group>
                <InputLabel> Cards per Misc source</InputLabel>
                <Button.Group w={'100%'} mb="xs">
                    <Button variant="default" size="sm" onClick={() => setMiscMaxSource(15)}>15</Button>
                    <Button variant="default" size="sm" onClick={() => setMiscMaxSource(Math.max(maxMiscCardSource - 5, 0))}>-5</Button>
                    <Button.GroupSection flex={1} variant="default" miw={60} style={{ fontSize: 'var(--mantine-font-size-sm)', padding: '2px 8px', fontWeight: 800, textAlign: 'center' }}>
                        {maxMiscCardSource}
                    </Button.GroupSection>
                    <Button variant="default" size="sm"
                        onClick={() => setMiscMaxSource(Math.min(maxMiscCardSource + 5, 100))}>+5</Button>
                    <Button variant="default" size="sm" onClick={() => setMiscMaxSource(100)}>100</Button>
                </Button.Group>

                <Group grow gap="xs" mb="xs">
                    <NativeSelect
                        label={'Version'}
                        value={version}
                        onChange={(e) => setVersion(e.currentTarget.value)}
                        size="sm"
                    >
                        <option value="10106">1.0.1f</option>
                        <option value="10103">1.0.1c</option>
                        <option value="10014">1.0.0n</option>
                    </NativeSelect>
                </Group>
                <Group grow gap="xs" mb="xs">
                    <Box>
                        <Text mb={0} fz={'sm'}>Show Joker Spoilers</Text>
                        <Tooltip label="Cards that give jokers, are replaced with the joker the card would give."
                            refProp="rootRef">
                            <Switch
                                size={'sm'}
                                checked={showCardSpoilers}
                                thumbIcon={showCardSpoilers ? (<IconJoker size={12} color={'black'} />) : (
                                    <IconPlayCard size={12} color={'black'} />)}
                                onChange={() => setShowCardSpoilers(!showCardSpoilers)}
                            />
                        </Tooltip>
                    </Box>
                    <Box id="setting-quick-reroll">
                        <Text mb={0} fz={'xs'}>Quick Reroll</Text>
                        <Tooltip label="Long pressing a card in the shop queue, will reroll that card."
                            refProp="rootRef">
                            <Switch
                                size={'sm'}
                                checked={useCardPeek}
                                onChange={() => setUseCardPeek(!useCardPeek)}
                            />
                        </Tooltip>
                    </Box>
                </Group>
            </AppShell.Section>
            <AppShell.Section
                id="tool-buttons"
                mt="auto"
                pb="xs"
                style={{
                    flex: '0 0 auto',
                    borderTop: `1px solid ${colorScheme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                    paddingTop: 'var(--mantine-spacing-xs)'
                }}
            >
                <Stack gap="xs">
                    <Button
                        id="analyze-button"
                        onClick={handleAnalyzeClick}
                        color="green"
                        size="sm"
                        fullWidth
                    >
                        Analyze Seed
                    </Button>
                    <Button
                        id="features-button"
                        color="grape"
                        onClick={() => {
                            GaEvent('view_features');
                            openFeaturesModal()
                        }}
                        size="sm"
                        fullWidth
                    >
                        Features
                    </Button>
                    <Button color="blue" onClick={() => openSelectOptionModal()} size="sm" fullWidth>
                        Modify Unlocks
                    </Button>
                    <Group grow gap="xs" align="stretch">
                        <Button
                            id="snapshot-button"
                            color="cyan"
                            onClick={() => {
                                openSnapshotModal();
                                GaEvent('view_seed_snapshot');
                            }}
                            size="sm"
                        >
                            Seed Summary
                        </Button>
                        <Button color="red" variant={'filled'} onClick={() => reset()} size="sm">
                            Reset
                        </Button>
                    </Group>
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    )
}
