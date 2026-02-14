import React from "react";
import {
    AppShell,
    Box,
    Button,
    Divider,
    Group,
    Image,
    InputLabel,
    Modal,
    NativeSelect,
    NumberInput,
    Paper,
    SegmentedControl,
    Select,
    Stack,
    Switch,
    Text,
    Textarea,
    Tooltip,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { DeckBackIcon } from "../../Rendering/deckStakeIcons.tsx";
import {
    IconFileText,
    IconJoker,
    IconLayout,
    IconListSearch,
    IconPlayCard,
    IconUpload
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

    const [bulkSeedsOpened, { open: openBulkSeeds, close: closeBulkSeeds }] = useDisclosure(false);
    const [bulkSeedsText, setBulkSeedsText] = React.useState('');

    const handleAnalyzeClick = () => {
        setStart(true);
    }

    const handleBulkSeedsImport = () => {
        const parsed = bulkSeedsText
            .split(/\r?\n/)
            .map(line => {
                const firstCol = line.split(',')[0].trim();
                const stripped = firstCol.replace(/^["']|["']$/g, '');
                return stripped;
            })
            .filter(s => s.length > 0 && /^[A-Z0-9]+$/i.test(s))
            .map(s => s.toUpperCase());

        if (parsed.length > 0) {
            setSeed(parsed[0]);
            setStart(true);
            closeBulkSeeds();
            setBulkSeedsText('');
        }
    }


    const handleViewModeChange = (value: string) => {
        // Close the menu when opening the JAML view
        if (value === 'jaml') {
            toggleSettings();
        } else {
            // If switching away from JAML, keep Blueprint selected
            const nextView = viewMode === 'jaml' ? 'blueprint' : value;
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
                 <Group grow gap="xs" mb="xs">
                    <Box flex={1}>
                        <SeedInputAutoComplete
                            seed={seed}
                            setSeed={setSeed}
                        />
                    </Box>
                    <Box flex={1}>
                        <NumberInput
                            label={'Max Ante'}
                            value={maxAnte}
                            onChange={(val) => {
                                const newMax = Number(val) || 8;
                                setMaxAnte(Math.max(minAnte, Math.min(newMax, 39)));
                            }}
                            min={minAnte}
                            max={39}
                            size="sm"
                        />
                    </Box>
                </Group>
                <Group align={'flex-end'} grow>
                    <Select
                        label={'Choose Deck'}
                        value={deck}
                        onChange={(value) => {
                            if (value) setDeck(value);
                        }}
                        size="sm"
                        flex={1}
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
                        flex={1}
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
                    <Box>
                        <Text mb={'xs'} fz={'sm'}>Joker Spoilers</Text>
                        <Tooltip label="Cards that give jokers, are replaced with the joker the card would give."
                            refProp="rootRef">
                            <Switch
                                size={'md'}
                                checked={showCardSpoilers}
                                thumbIcon={showCardSpoilers ? (<IconJoker size={12} color={'black'} />) : (
                                    <IconPlayCard size={12} color={'black'} />)}
                                onChange={() => setShowCardSpoilers(!showCardSpoilers)}
                            />
                        </Tooltip>
                    </Box>
                    <Box id="setting-quick-reroll">
                        <Text mb={'xs'} fz={'sm'}>Quick Reroll</Text>
                        <Tooltip label="Long pressing a card in the shop queue, will reroll that card."
                            refProp="rootRef">
                            <Switch
                                size={'md'}
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
                        id="import-seeds-button"
                        onClick={openBulkSeeds}
                        color="blue"
                        variant="light"
                        size="sm"
                        fullWidth
                        leftSection={<IconUpload size={16} />}
                    >
                        Import Seeds
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

            {/* Import Seeds Modal */}
            <Modal opened={bulkSeedsOpened} onClose={closeBulkSeeds} title="Import Seeds" size="md">
                <Stack
                    gap="md"
                    onDragOver={(e) => {
                        e.preventDefault();
                        const textarea = e.currentTarget.querySelector('textarea');
                        if (textarea) {
                            textarea.style.backgroundColor = theme.colors.blue[9];
                            textarea.style.borderColor = theme.colors.blue[5];
                        }
                    }}
                    onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            const textarea = e.currentTarget.querySelector('textarea');
                            if (textarea) {
                                textarea.style.backgroundColor = theme.colors.dark[7];
                                textarea.style.borderColor = '';
                            }
                        }
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const textarea = e.currentTarget.querySelector('textarea');
                        if (textarea) {
                            textarea.style.backgroundColor = theme.colors.dark[7];
                            textarea.style.borderColor = '';
                        }
                        const files = e.dataTransfer.files;
                        if (files[0]) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                                const content = evt.target?.result as string;
                                setBulkSeedsText(content);
                            };
                            reader.readAsText(files[0]);
                        }
                    }}
                >
                    <Text size="sm" c="dimmed">
                        Supports: .TXT, .CSV (first 8 chars), or paste directly. One seed per line.
                    </Text>

                    <Paper
                        p="sm"
                        radius="sm"
                        style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: theme.colors.dark[6],
                        }}
                        component="label"
                    >
                        <Group justify="center" gap="xs">
                            <IconUpload size={16} color={theme.colors.dark[2]} />
                            <Text fw={500} size="sm">Click to browse files (.txt, .csv)</Text>
                        </Group>
                        <input
                            type="file"
                            accept=".txt,.csv"
                            onChange={(e) => {
                                const file = e.currentTarget.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                        const content = evt.target?.result as string;
                                        setBulkSeedsText(content);
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                    </Paper>

                    <Textarea
                        placeholder="Drop file anywhere or paste seeds here...&#10;&#10;KDBX2SMH&#10;3BCUYMCI&#10;11KH17QI&#10;..."
                        value={bulkSeedsText}
                        onChange={(e) => setBulkSeedsText(e.currentTarget.value)}
                        minRows={10}
                        maxRows={15}
                        autosize
                        styles={{
                            input: {
                                fontFamily: 'monospace',
                                backgroundColor: theme.colors.dark[7],
                                color: theme.colors.gray[3],
                                fontSize: '14px',
                                letterSpacing: '0.5px',
                                transition: 'background-color 0.15s, border-color 0.15s',
                            }
                        }}
                    />

                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            {bulkSeedsText.split(/\r?\n/).map((line: string) => {
                                const firstCol = line.split(',')[0].trim().replace(/^["']|["']$/g, '');
                                return firstCol;
                            }).filter((s: string) => s.length > 0 && /^[A-Z0-9]+$/i.test(s)).length} seeds detected
                        </Text>
                        <Group gap="xs">
                            <Button variant="light" onClick={closeBulkSeeds}>Cancel</Button>
                            <Button onClick={handleBulkSeedsImport} leftSection={<IconUpload size={14} />}>
                                Import Seeds
                            </Button>
                        </Group>
                    </Group>
                </Stack>
            </Modal>
        </AppShell.Navbar>
    )
}
