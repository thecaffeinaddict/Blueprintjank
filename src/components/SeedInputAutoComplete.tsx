import React, { useCallback, useState } from "react";
import { Autocomplete, Button, Group, Modal, Stack, Text, Textarea, useMantineTheme } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconUpload, IconChevronDown } from "@tabler/icons-react";
import { SeedsWithLegendary, popularSeeds } from "../modules/const.ts";
import { useCardStore } from "../modules/state/store.ts";
import { DeckSprite, DECK_MAP, STAKE_MAP } from "./DeckSprite";


export function QuickAnalyze() {
    const seed = useCardStore(state => state.engineState.seed);
    const setSeed = useCardStore(state => state.setSeed);
    const deck = useCardStore(state => state.engineState.deck);
    const setDeck = useCardStore(state => state.setDeck);
    const setStart = useCardStore(state => state.setStart);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [showDeckSelector, setShowDeckSelector] = useState(false);
    const [stake, setStake] = useState('White Stake');

    // We need to sync the internal deck/stake state with the store if needed, 
    // but looking at valid props, 'deck' is in the store. 'stake' might be new for this view?
    // The previous code only set 'deck'. I will assume 'stake' is local for now or needs a store update if used elsewhere.
    // However, the user explicitly asked for the chip.

    // Helper to get clean names for the sprite
    const getDeckSpriteName = (d: string) => d.replace(' Deck', '');
    const getStakeSpriteName = (s: string) => s.replace(' Stake', '');

    const deckSelectStandalone = (
        <Group gap={0} wrap="nowrap" align="flex-end">
            {/* SPLIT BUTTON */}
            <div className="relative flex items-end">
                <Button
                    variant="filled"
                    color="dark"
                    className="rounded-r-none border-r border-white/10 px-2 h-[42px] hover:bg-white/10"
                    onClick={() => setShowDeckSelector(!showDeckSelector)}
                >
                    <Group gap="xs">
                        <div className="relative w-[30px] h-[40px] pointer-events-none transform scale-90 origin-center">
                            <DeckSprite deck={getDeckSpriteName(deck)} stake={getStakeSpriteName(stake)} size={30} />
                        </div>
                        <Stack gap={0} align="flex-start" className="hidden sm:flex">
                            <Text size="xs" fw={700} tt="uppercase" c="blue.3" lh={1}>{getDeckSpriteName(deck)}</Text>
                            <Text size="xs" fz="0.6rem" tt="uppercase" c="dimmed" lh={1}>{getStakeSpriteName(stake)}</Text>
                        </Stack>
                    </Group>
                </Button>
                <Button
                    variant="filled"
                    color="dark"
                    className="rounded-l-none px-1 h-[42px] hover:bg-white/10"
                    onClick={() => setShowDeckSelector(!showDeckSelector)}
                >
                    <IconChevronDown size={14} />
                </Button>

                {/* DROPDOWN - Custom implementation to match the V2 vibe */}
                {showDeckSelector && (
                    <div className="absolute top-full left-0 mt-2 z-[100] bg-[#1A1B1E] border border-white/10 rounded-lg shadow-xl p-4 w-[320px]">
                        {/* Decks Grid */}
                        <Stack gap="xs" mb="md">
                            <Text size="xs" fw={700} c="blue.4" tt="uppercase">Deck Architecture</Text>
                            <div className="grid grid-cols-5 gap-2">
                                {Object.keys(DECK_MAP).map(d => {
                                    const fullDeckName = d.charAt(0).toUpperCase() + d.slice(1) + " Deck";
                                    return (
                                        <button
                                            key={d}
                                            onClick={() => { setDeck(fullDeckName); setShowDeckSelector(false); }}
                                            className={`
                                                relative aspect-[2/3] rounded overflow-hidden border transition-all
                                                ${deck === fullDeckName ? 'border-yellow-400 ring-1 ring-yellow-400 opacity-100 placeholder:opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'}
                                            `}
                                            title={fullDeckName}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center transform scale-[0.85]">
                                                <DeckSprite deck={d} size={40} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Stack>

                        {/* Stakes Grid */}
                        <Stack gap="xs">
                            <Text size="xs" fw={700} c="red.4" tt="uppercase">Stake Difficulty</Text>
                            <div className="grid grid-cols-4 gap-2">
                                {Object.keys(STAKE_MAP).map(s => {
                                    const fullStakeName = s.charAt(0).toUpperCase() + s.slice(1) + " Stake";
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => { setStake(fullStakeName); setShowDeckSelector(false); }}
                                            className={`
                                                relative h-10 rounded border transition-all flex items-center justify-center bg-black/20
                                                ${stake === fullStakeName ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/10 hover:border-white/30'}
                                            `}
                                            title={fullStakeName}
                                        >
                                            <div className="transform scale-75 pointer-events-none">
                                                <DeckSprite deck={getDeckSpriteName(deck)} stake={s} size={30} className="!w-[30px] !h-[40px] overflow-hidden" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Stack>
                    </div>
                )}
            </div>
        </Group >
    );

    return (
        <Stack gap="sm" w="100%">
            {isMobile ? (
                <>
                    <Autocomplete
                        label="Analyze Seed"
                        placeholder="Enter Seed"
                        data={[
                            {
                                group: 'Popular Seeds',
                                items: popularSeeds
                            }, {
                                group: 'Generated Seeds With Legendary Jokers',
                                items: SeedsWithLegendary

                            }
                        ]}
                        value={seed}
                        onChange={(e) => setSeed(e)}
                        onOptionSubmit={(val) => {
                            setSeed(val);
                            setStart(true);
                        }}
                    />
                    {deckSelectStandalone}
                </>
            ) : (
                <div className="flex gap-2 items-end w-full">
                    <Autocomplete
                        className="flex-1"
                        label="Analyze Seed"
                        placeholder="Enter Seed"
                        data={[
                            {
                                group: 'Popular Seeds',
                                items: popularSeeds
                            }, {
                                group: 'Generated Seeds With Legendary Jokers',
                                items: SeedsWithLegendary

                            }
                        ]}
                        value={seed}
                        onChange={(e) => setSeed(e)}
                        onOptionSubmit={(val) => {
                            setSeed(val);
                            setStart(true);
                        }}
                        styles={{
                            input: {
                                minWidth: 0,
                            },
                            section: {
                                borderLeft: '1px solid var(--mantine-color-default-border)',
                            }
                        }}
                    />
                    {deckSelectStandalone}
                </div>
            )}
            <Button
                fullWidth
                onClick={() => setStart(seed.length >= 5)}
                size={isMobile ? 'sm' : 'md'}
            >
                Analyze Seed
            </Button>
        </Stack>
    );

}

export default function SeedInputAutoComplete({ seed, setSeed, onBulkImport }: { seed: string, setSeed: (seed: string) => void, onBulkImport?: (seeds: Array<string>) => void }) {
    const setStart = useCardStore(state => state.setStart);
    const theme = useMantineTheme();
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
                // Default: just set the first seed
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
                    {
                        group: 'Actions',
                        items: ['📋 Seed List...']
                    },
                    {
                        group: 'Popular Seeds',
                        items: popularSeeds
                    }, {
                        group: 'Generated Seeds With Legendary Jokers',
                        items: SeedsWithLegendary

                    }
                ]}
                comboboxProps={{
                    withinPortal: true
                }}
                maxDropdownHeight={300}
                styles={{
                    input: {
                        minWidth: 0,
                        height: 'calc(var(--input-height-sm) + 4px)',
                        fontSize: 'var(--mantine-font-size-sm)'
                    },
                    label: {
                        fontSize: 'var(--mantine-font-size-sm)'
                    },
                    option: {
                        fontSize: 'var(--mantine-font-size-sm)'
                    }
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
                        styles={{
                            input: {
                                fontFamily: 'monospace',
                                backgroundColor: theme.colors.dark[7],
                                color: theme.colors.gray[3],
                                fontSize: '14px',
                                letterSpacing: '0.5px'
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
