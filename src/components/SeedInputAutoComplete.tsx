import * as React from "react";
import { useCallback, useState } from "react";
import {
    Anchor,
    Autocomplete,
    Box,
    Button,
    Group,
    Modal,
    Select,
    Stack,
    Text,
    Textarea
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconChevronDown,
    IconUpload
} from "@tabler/icons-react";
import { SeedsWithLegendary, popularSeeds } from "../modules/const.ts";
import { useCardStore } from "../modules/state/store.ts";
import { DeckBackIcon, StakeChipIcon } from "./Rendering/deckStakeIcons.tsx";

const decks = [
    "Red Deck", "Blue Deck", "Yellow Deck", "Green Deck", "Black Deck",
    "Magic Deck", "Nebula Deck", "Ghost Deck", "Abandoned Deck",
    "Checkered Deck", "Zodiac Deck", "Painted Deck", "Anaglyph Deck",
    "Plasma Deck", "Erratic Deck"
];

const stakes = [
    "White Stake", "Red Stake", "Green Stake", "Black Stake",
    "Blue Stake", "Purple Stake", "Orange Stake", "Gold Stake"
];

export function QuickAnalyze() {
    const seed = useCardStore(state => state.engineState.seed);
    const setSeed = useCardStore(state => state.setSeed);
    const deck = useCardStore(state => state.engineState.deck);
    const setDeck = useCardStore(state => state.setDeck);
    const stake = useCardStore(state => state.engineState.stake);
    const setStake = useCardStore(state => state.setStake);
    const setStart = useCardStore(state => state.setStart);

    // Ensure we have a valid deck/stake selected initially if store is empty
    React.useEffect(() => {
        if (!deck && decks.length > 0) {
            setDeck(decks[7]); // Default to Ghost Deck as in screenshot
        }
        if (!stake && stakes.length > 0) {
            setStake(stakes[0]); // Default to White Stake
        }
    }, [deck, setDeck, stake, setStake]);

    return (
        <Stack gap="xs" w="100%" px="sm" mb="md">
            <Box p="xl" style={{
                backgroundColor: '#1A1B1E',
                borderRadius: '12px',
                border: '1px solid #2C2E33',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
                <Text size="lg" fw={600} c="white" mb="md">Analyze Seed</Text>

                <Group gap={0} wrap="nowrap">
                    <Autocomplete
                        style={{ flex: 1 }}
                        placeholder="Enter Seed"
                        size="md"
                        data={[
                            { group: 'Popular Seeds', items: popularSeeds },
                            { group: 'Legendary Seeds', items: SeedsWithLegendary }
                        ]}
                        value={seed}
                        onChange={setSeed}
                        onOptionSubmit={(val) => {
                            setSeed(val);
                            setStart(true);
                        }}
                        styles={{
                            input: {
                                backgroundColor: '#141517',
                                border: '1px solid #373A40',
                                borderRight: 'none',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                height: 52,
                                color: '#fff',
                                fontSize: '1.1rem',
                                '&:focus': {
                                    borderColor: '#373A40'
                                }
                            }
                        }}
                    />

                    <Select
                        data={decks}
                        value={deck}
                        onChange={(val) => val && setDeck(val)}
                        size="md"
                        leftSection={deck ? (
                            <Box style={{ transform: 'scale(2.2)', marginLeft: '14px', marginRight: '6px' }}>
                                <DeckBackIcon deckName={deck} />
                            </Box>
                        ) : null}
                        rightSection={<IconChevronDown size={18} opacity={0.5} />}
                        renderOption={({ option }) => (
                            <Group gap="sm" wrap="nowrap">
                                <Box style={{ transform: 'scale(1.8)', display: 'flex', alignItems: 'center' }}>
                                    <DeckBackIcon deckName={option.value} />
                                </Box>
                                <Text size="sm">{option.label}</Text>
                            </Group>
                        )}
                        styles={{
                            input: {
                                backgroundColor: '#141517',
                                border: '1px solid #373A40',
                                borderRight: 'none',
                                borderRadius: 0,
                                height: 52,
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '1.1rem',
                                paddingRight: 45,
                                paddingLeft: 65,
                                width: 220,
                                '&:focus': {
                                    borderColor: '#373A40'
                                }
                            },
                        }}
                        comboboxProps={{ withinPortal: true }}
                    />

                    <Select
                        data={stakes}
                        value={stake}
                        onChange={(val) => val && setStake(val)}
                        size="md"
                        leftSection={stake ? (
                            <Box style={{ transform: 'scale(2)', marginLeft: '14px', marginRight: '6px' }}>
                                <StakeChipIcon stakeName={stake} />
                            </Box>
                        ) : null}
                        rightSection={<IconChevronDown size={18} opacity={0.5} />}
                        renderOption={({ option }) => (
                            <Group gap="sm" wrap="nowrap">
                                <Box style={{ transform: 'scale(1.5)', display: 'flex', alignItems: 'center' }}>
                                    <StakeChipIcon stakeName={option.value} />
                                </Box>
                                <Text size="sm">{option.label}</Text>
                            </Group>
                        )}
                        styles={{
                            input: {
                                backgroundColor: '#141517',
                                border: '1px solid #373A40',
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                height: 52,
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '1.1rem',
                                paddingRight: 45,
                                paddingLeft: 55,
                                width: 210,
                                '&:focus': {
                                    borderColor: '#373A40'
                                }
                            },
                        }}
                        comboboxProps={{ withinPortal: true }}
                    />

                    <Button
                        ml="lg"
                        size="md"
                        h={52}
                        px={32}
                        onClick={() => setStart(seed.length >= 5)}
                        styles={{
                            root: {
                                backgroundColor: '#1C7ED6',
                                '&:hover': {
                                    backgroundColor: '#1971C2'
                                },
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                boxShadow: '0 4px 15px rgba(28, 126, 214, 0.4)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            },
                            label: {
                                letterSpacing: '0.5px'
                            }
                        }}
                    >
                        ANALYZE SEED
                    </Button>
                </Group>
            </Box>

            <Group justify="flex-end" px="sm" mt={4}>
                <Text size="sm" c="dimmed">
                    Want to search for seeds instead? Try{' '}
                    <Anchor href="https://github.com/pifreak/MotelyJAML" target="_blank" c="blue.5" underline="hover">
                        MotelyJAML
                    </Anchor>
                    {' '}by pifreak
                </Text>
            </Group>
        </Stack>
    );
}

export default function SeedInputAutoComplete({ seed, setSeed, onBulkImport }: { seed: string, setSeed: (seed: string) => void, onBulkImport?: (seeds: Array<string>) => void }) {
    const setStart = useCardStore(state => state.setStart);
    const [bulkOpened, { open: openBulk, close: closeBulk }] = useDisclosure(false);
    const [bulkText, setBulkText] = useState('');

    const handleBulkImport = useCallback(() => {
        const parsed = bulkText
            .split(/[\n,\s]+/)
            .map(s => s.trim().toUpperCase())
            .filter(s => s.length > 0 && /^[A-Z0-9]+$/.test(s));
        if (parsed.length > 0) {
            if (onBulkImport) {
                onBulkImport(parsed);
            } else {
                setSeed(parsed[0]);
            }
            closeBulk();
            setBulkText('');
        }
    }, [bulkText, closeBulk, onBulkImport, setSeed]);

    const handleChange = useCallback((value: string) => {
        if (value === '📋 Seed List...') {
            openBulk();
        } else {
            setSeed(value);
        }
    }, [setSeed, openBulk]);

    return (
        <>
            <Autocomplete
                flex={1}
                label={'Seed'}
                placeholder={'Enter Seed'}
                value={seed}
                onChange={handleChange}
                onOptionSubmit={(val) => {
                    if (val === '📋 Seed List...') {
                        openBulk();
                    } else {
                        setSeed(val);
                        setStart(true);
                    }
                }}
                size="sm"
                data={[
                    { group: 'Actions', items: ['📋 Seed List...'] },
                    { group: 'Popular Seeds', items: popularSeeds },
                    { group: 'Generated Seeds With Legendary Jokers', items: SeedsWithLegendary }
                ]}
                comboboxProps={{ withinPortal: true }}
                maxDropdownHeight={300}
                styles={{
                    input: {
                        minWidth: 0,
                        height: 'calc(var(--input-height-sm) + 4px)',
                        fontSize: 'var(--mantine-font-size-sm)'
                    },
                    label: { fontSize: 'var(--mantine-font-size-sm)' },
                    option: { fontSize: 'var(--mantine-font-size-sm)' }
                }}
            />

            <Modal opened={bulkOpened} onClose={closeBulk} title="Bulk Import Seeds" size="md">
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Paste seeds or drop a .txt/.csv file (one per line, comma-separated, or space-separated)
                    </Text>
                    <Textarea
                        placeholder="KDBX2SMH&#10;3BCUYMCI&#10;11KH17QI&#10;..."
                        value={bulkText}
                        onChange={(e) => setBulkText(e.currentTarget.value)}
                        minRows={8}
                        maxRows={15}
                        autosize
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files[0]) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                    const content = evt.target?.result as string;
                                    setBulkText(content);
                                };
                                reader.readAsText(files[0]);
                            }
                        }}
                    />
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            {bulkText.split(/[\n,\s]+/).filter(s => s.trim().length > 0).length} seeds detected
                        </Text>
                        <Group gap="xs">
                            <Button variant="light" onClick={closeBulk}>Cancel</Button>
                            <Button onClick={handleBulkImport} leftSection={<IconUpload size={14} />}>
                                Import Seeds
                            </Button>
                        </Group>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
