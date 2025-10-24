import React, { useEffect, useState } from "react";
import {
    Button,
    Text,
    Input,
    Combobox,
    Option,
    makeStyles,
    tokens,
    Card,
    Badge,
    Spinner,
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
} from "@fluentui/react-components";
import {
    DeleteRegular,
    AddRegular,
    CheckmarkCircleRegular,
    ErrorCircleRegular,
} from "@fluentui/react-icons";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import type {
    GeneratedComponentProps,
    ReadableTableRow,
    cr17f_technician1,
    cr17f_workcenter1,
    cr17f_activity1,
    WritableTableRow
} from "./RuntimeTypes";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL,
        padding: tokens.spacingHorizontalXL,
        maxWidth: "1600px",
        margin: "0 auto",
        height: "100vh",
        backgroundColor: tokens.colorNeutralBackground1,
        overflow: "hidden",
    },
    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: tokens.spacingVerticalM,
        flexWrap: "wrap",
        gap: tokens.spacingVerticalM,
    },
    header: {
        fontSize: tokens.fontSizeHero800,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorBrandForeground1,
    },
    statsRow: {
        display: "flex",
        gap: tokens.spacingHorizontalM,
        flexWrap: "wrap",
    },
    statCard: {
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
        minWidth: "140px",
        textAlign: "center",
    },
    statLabel: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        marginBottom: tokens.spacingVerticalXXS,
    },
    statValue: {
        fontSize: tokens.fontSizeHero900,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorBrandForeground1,
    },
    entryCard: {
        marginBottom: tokens.spacingVerticalM,
        padding: tokens.spacingVerticalL,
        backgroundColor: tokens.colorNeutralBackground1,
    },
    entryHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: tokens.spacingVerticalL,
        paddingBottom: tokens.spacingVerticalS,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    entryNumber: {
        fontSize: tokens.fontSizeBase500,
        fontWeight: tokens.fontWeightSemibold,
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 120px 180px 180px",
        gap: tokens.spacingHorizontalM,
        alignItems: "start",
    },
    formField: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXS,
    },
    label: {
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground2,
        marginBottom: tokens.spacingVerticalXXS,
    },
    required: {
        color: tokens.colorPaletteRedForeground1,
    },
    scrollArea: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
        paddingRight: tokens.spacingHorizontalS,
        minHeight: 0,
    },
    actionBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: tokens.spacingVerticalL,
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
        marginTop: "auto",
        flexShrink: 0,
    },
    errorText: {
        color: tokens.colorPaletteRedForeground1,
        fontSize: tokens.fontSizeBase200,
        marginTop: tokens.spacingVerticalXXS,
    },
    validBorder: {
        borderLeft: `4px solid ${tokens.colorPaletteGreenBorder2}`,
    },
    invalidBorder: {
        borderLeft: `4px solid ${tokens.colorPaletteRedBorder2}`,
    },
});

interface EntryRow {
    id: string;
    technicianId: string;
    workCenterId: string;
    activityId: string;
    quantity: string;
    startTime: Date | null;
    endTime: Date | null;
}

interface ComboboxInputState {
    [rowId: string]: {
        technician: string;
        workCenter: string;
        activity: string;
    };
}

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({ dataApi }) => {
    const styles = useStyles();

    const [technicians, setTechnicians] = useState<ReadableTableRow<cr17f_technician1>[]>([]);
    const [workCenters, setWorkCenters] = useState<ReadableTableRow<cr17f_workcenter1>[]>([]);
    const [activities, setActivities] = useState<ReadableTableRow<cr17f_activity1>[]>([]);
    const [rows, setRows] = useState<EntryRow[]>([
        {
            id: "1",
            technicianId: "",
            workCenterId: "",
            activityId: "",
            quantity: "",
            startTime: new Date(),
            endTime: new Date(),
        },
    ]);
    const [inputValues, setInputValues] = useState<ComboboxInputState>({
        "1": { technician: "", workCenter: "", activity: "" }
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [techResult, wcResult, actResult] = await Promise.all([
                    dataApi.queryTable("cr17f_technician1", {
                        select: ["cr17f_technicianname", "cr17f_technician1id"]
                    }),
                    dataApi.queryTable("cr17f_workcenter1", {
                        select: ["cr17f_workcentername", "cr17f_workcenter1id"]
                    }),
                    dataApi.queryTable("cr17f_activity1", {
                        select: ["cr17f_activityname", "cr17f_activity1id"]
                    }),
                ]);

                setTechnicians(techResult.rows || []);
                setWorkCenters(wcResult.rows || []);
                setActivities(actResult.rows || []);
            } catch (error) {
                setErrorMessage("Failed to load data. Please refresh the page.");
                console.error("Data loading error:", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [dataApi]);

    const isRowValid = (row: EntryRow): boolean => {
        return !!(
            row.technicianId &&
            row.workCenterId &&
            row.activityId &&
            row.quantity &&
            parseFloat(row.quantity) > 0 &&
            row.startTime &&
            row.endTime &&
            row.startTime < row.endTime
        );
    };

    const handleRowChange = (id: string, field: keyof EntryRow, value: any) => {
        setRows(prevRows => prevRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
        // Clear messages when user makes changes
        if (successMessage) setSuccessMessage(null);
        if (errorMessage) setErrorMessage(null);
    };

    const handleComboboxInputChange = (rowId: string, field: 'technician' | 'workCenter' | 'activity', value: string) => {
        setInputValues(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: value
            }
        }));
    };

    const addRow = () => {
        const newId = (Math.max(...rows.map(r => parseInt(r.id))) + 1).toString();
        setRows([
            ...rows,
            {
                id: newId,
                technicianId: "",
                workCenterId: "",
                activityId: "",
                quantity: "",
                startTime: new Date(),
                endTime: new Date(),
            }
        ]);
        setInputValues(prev => ({
            ...prev,
            [newId]: { technician: "", workCenter: "", activity: "" }
        }));
    };

    const removeRow = (id: string) => {
        if (rows.length === 1) {
            setErrorMessage("At least one entry is required");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }
        setRows(prevRows => prevRows.filter(row => row.id !== id));
        setInputValues(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const handleSubmit = async () => {
        setSuccessMessage(null);
        setErrorMessage(null);

        const validRows = rows.filter(row => isRowValid(row));

        if (validRows.length === 0) {
            setErrorMessage("Please complete at least one entry before submitting");
            return;
        }

        setLoading(true);

        try {
            const results = await Promise.allSettled(
                validRows.map(async (row) => {
                    const techName = technicians.find(t => t.cr17f_technician1id === row.technicianId)?.cr17f_technicianname || "Unknown";
                    const payload: WritableTableRow<any> = {
                        cr17f_timeentryname: `${techName} - ${new Date().toLocaleDateString()}`,
                        _cr17f_technicianname_value: row.technicianId,
                        _cr17f_workcentername_value: row.workCenterId,
                        _cr17f_activityname_value: row.activityId,
                        cr17f_clockintime: row.startTime,
                        cr17f_clockouttime: row.endTime,
                        cr17f_durationhours: parseFloat(row.quantity),
                    };
                    return await dataApi.createRow("cr17f_techniciantimeentry", payload);
                })
            );

            const successCount = results.filter(r => r.status === 'fulfilled').length;
            const failCount = results.filter(r => r.status === 'rejected').length;

            if (failCount === 0) {
                setSuccessMessage(`Successfully submitted ${successCount} ${successCount === 1 ? 'entry' : 'entries'}!`);
                // Reset to single empty row
                const resetRow = {
                    id: "1",
                    technicianId: "",
                    workCenterId: "",
                    activityId: "",
                    quantity: "",
                    startTime: new Date(),
                    endTime: new Date(),
                };
                setRows([resetRow]);
                setInputValues({
                    "1": { technician: "", workCenter: "", activity: "" }
                });
            } else {
                setErrorMessage(`Submitted ${successCount} entries, but ${failCount} failed. Please try again.`);
            }
        } catch (error) {
            console.error("Submit error:", error);
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getValidEntriesCount = () => {
        return rows.filter(row => isRowValid(row)).length;
    };

    const getTotalQuantity = () => {
        return rows.reduce((sum, row) => {
            const qty = parseFloat(row.quantity);
            return sum + (isNaN(qty) ? 0 : qty);
        }, 0);
    };

    if (initialLoading) {
        return (
            <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="large" label="Loading data..." />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <Text className={styles.header}>
                    Log Production Output
                </Text>
                <div className={styles.statsRow}>
                    <Card className={styles.statCard}>
                        <Text className={styles.statLabel}>Total Entries</Text>
                        <Text className={styles.statValue}>{rows.length}</Text>
                    </Card>
                    <Card className={styles.statCard}>
                        <Text className={styles.statLabel}>Valid Entries</Text>
                        <Text className={styles.statValue}>{getValidEntriesCount()}</Text>
                    </Card>
                    <Card className={styles.statCard}>
                        <Text className={styles.statLabel}>Total Quantity</Text>
                        <Text className={styles.statValue}>{getTotalQuantity()}</Text>
                    </Card>
                </div>
            </div>

            {successMessage && (
                <MessageBar intent="success">
                    <MessageBarBody>
                        <MessageBarTitle>Success</MessageBarTitle>
                        {successMessage}
                    </MessageBarBody>
                </MessageBar>
            )}

            {errorMessage && (
                <MessageBar intent="error">
                    <MessageBarBody>
                        <MessageBarTitle>Error</MessageBarTitle>
                        {errorMessage}
                    </MessageBarBody>
                </MessageBar>
            )}

            <div className={styles.scrollArea}>
                {rows.map((row, index) => {
                    const isValid = isRowValid(row);
                    const hasAnyData = row.technicianId || row.workCenterId || row.activityId || row.quantity;
                    const selectedTechnician = technicians.find(t => t.cr17f_technician1id === row.technicianId);
                    const selectedWorkCenter = workCenters.find(w => w.cr17f_workcenter1id === row.workCenterId);
                    const selectedActivity = activities.find(a => a.cr17f_activity1id === row.activityId);

                    return (
                        <Card
                            key={row.id}
                            className={`${styles.entryCard} ${hasAnyData && isValid ? styles.validBorder : hasAnyData ? styles.invalidBorder : ''}`}
                        >
                            <div className={styles.entryHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
                                    <Text className={styles.entryNumber}>Entry #{index + 1}</Text>
                                    {isValid && (
                                        <Badge
                                            appearance="filled"
                                            color="success"
                                            icon={<CheckmarkCircleRegular />}
                                        >
                                            Complete
                                        </Badge>
                                    )}
                                    {hasAnyData && !isValid && (
                                        <Badge
                                            appearance="filled"
                                            color="danger"
                                            icon={<ErrorCircleRegular />}
                                        >
                                            Incomplete
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    icon={<DeleteRegular />}
                                    appearance="subtle"
                                    onClick={() => removeRow(row.id)}
                                    disabled={rows.length === 1}
                                    aria-label="Delete entry"
                                />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formField}>
                                    <Text className={styles.label}>
                                        Technician <span className={styles.required}>*</span>
                                    </Text>
                                    <Combobox
                                        placeholder="Select technician"
                                        value={inputValues[row.id]?.technician ?? selectedTechnician?.cr17f_technicianname ?? ""}
                                        onChange={(e) => {
                                            handleComboboxInputChange(row.id, 'technician', e.target.value);
                                        }}
                                        onOptionSelect={(_, data) => {
                                            if (data.optionValue) {
                                                handleRowChange(row.id, "technicianId", data.optionValue);
                                                const selected = technicians.find(t => t.cr17f_technician1id === data.optionValue);
                                                if (selected) {
                                                    handleComboboxInputChange(row.id, 'technician', selected.cr17f_technicianname || "");
                                                }
                                            }
                                        }}
                                    >
                                        {technicians.map(t => (
                                            <Option key={t.cr17f_technician1id} value={t.cr17f_technician1id} text={t.cr17f_technicianname}>
                                                {t.cr17f_technicianname}
                                            </Option>
                                        ))}
                                    </Combobox>
                                </div>

                                <div className={styles.formField}>
                                    <Text className={styles.label}>
                                        Work Center <span className={styles.required}>*</span>
                                    </Text>
                                    <Combobox
                                        placeholder="Select work center"
                                        value={inputValues[row.id]?.workCenter ?? selectedWorkCenter?.cr17f_workcentername ?? ""}
                                        onChange={(e) => {
                                            handleComboboxInputChange(row.id, 'workCenter', e.target.value);
                                        }}
                                        onOptionSelect={(_, data) => {
                                            if (data.optionValue) {
                                                handleRowChange(row.id, "workCenterId", data.optionValue);
                                                const selected = workCenters.find(w => w.cr17f_workcenter1id === data.optionValue);
                                                if (selected) {
                                                    handleComboboxInputChange(row.id, 'workCenter', selected.cr17f_workcentername || "");
                                                }
                                            }
                                        }}
                                    >
                                        {workCenters.map(w => (
                                            <Option key={w.cr17f_workcenter1id} value={w.cr17f_workcenter1id} text={w.cr17f_workcentername}>
                                                {w.cr17f_workcentername}
                                            </Option>
                                        ))}
                                    </Combobox>
                                </div>

                                <div className={styles.formField}>
                                    <Text className={styles.label}>
                                        Activity <span className={styles.required}>*</span>
                                    </Text>
                                    <Combobox
                                        placeholder="Select activity"
                                        value={inputValues[row.id]?.activity ?? selectedActivity?.cr17f_activityname ?? ""}
                                        onChange={(e) => {
                                            handleComboboxInputChange(row.id, 'activity', e.target.value);
                                        }}
                                        onOptionSelect={(_, data) => {
                                            if (data.optionValue) {
                                                handleRowChange(row.id, "activityId", data.optionValue);
                                                const selected = activities.find(a => a.cr17f_activity1id === data.optionValue);
                                                if (selected) {
                                                    handleComboboxInputChange(row.id, 'activity', selected.cr17f_activityname || "");
                                                }
                                            }
                                        }}
                                    >
                                        {activities.map(a => (
                                            <Option key={a.cr17f_activity1id} value={a.cr17f_activity1id} text={a.cr17f_activityname}>
                                                {a.cr17f_activityname}
                                            </Option>
                                        ))}
                                    </Combobox>
                                </div>

                                <div className={styles.formField}>
                                    <Text className={styles.label}>
                                        Quantity <span className={styles.required}>*</span>
                                    </Text>
                                    <Input
                                        type="number"
                                        placeholder="Enter qty"
                                        value={row.quantity}
                                        onChange={(_, data) => handleRowChange(row.id, "quantity", data.value)}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <Text className={styles.label}>
                                        Start Date <span className={styles.required}>*</span>
                                    </Text>
                                    <DatePicker
                                        placeholder="Select date"
                                        value={row.startTime || undefined}
                                        onSelectDate={(date) => handleRowChange(row.id, "startTime", date || null)}
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <Text className={styles.label}>
                                        End Date <span className={styles.required}>*</span>
                                    </Text>
                                    <DatePicker
                                        placeholder="Select date"
                                        value={row.endTime || undefined}
                                        onSelectDate={(date) => handleRowChange(row.id, "endTime", date || null)}
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className={styles.actionBar}>
                <Button
                    icon={<AddRegular />}
                    onClick={addRow}
                    appearance="secondary"
                >
                    Add Entry
                </Button>
                <Button
                    appearance="primary"
                    onClick={handleSubmit}
                    disabled={loading || getValidEntriesCount() === 0}
                    icon={loading ? <Spinner size="tiny" /> : undefined}
                >
                    {loading ? "Submitting..." : `Submit ${getValidEntriesCount()} ${getValidEntriesCount() === 1 ? 'Entry' : 'Entries'}`}
                </Button>
            </div>
        </div>
    );
};

export default GeneratedComponent;
