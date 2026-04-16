import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DayOfWeek = bigint;
export type Timestamp = bigint;
export interface IntegrationSettings {
    mollieEnabled: boolean;
    calendarSyncEnabled: boolean;
    stripePublicKey: string;
    stripeEnabled: boolean;
    apiKey: string;
    posSystem?: string;
}
export type ExperienceId = string;
export interface KPIs {
    avgPartySize: bigint;
    occupancyPct: bigint;
    todayCoversPerService: Array<[string, bigint]>;
    todayReservationCount: bigint;
    noShowCount: bigint;
}
export interface ZoneCapacity {
    zoneName: string;
    maxGuests: bigint;
}
export type WaitlistId = string;
export interface GuestFormSettings {
    requireAllergies: boolean;
    requireDietPreferences: boolean;
    requirePhone: boolean;
    customQuestions: Array<CustomQuestion>;
}
export interface TableAssignment {
    assignedAt: Timestamp;
    seatCount: bigint;
    tableId: TableId;
    guestName: string;
    reservationId: ReservationId;
}
export interface BrandingSettings {
    confirmationText: string;
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
    defaultLanguage: string;
    welcomeText: string;
}
export interface RestaurantExtendedConfig {
    timezone: string;
    integrations: IntegrationSettings;
    notifications: NotificationSettings;
    openingHour: bigint;
    guestForm: GuestFormSettings;
    fixedClosingDays: Array<DayOfWeek>;
    logoUrl?: string;
    zones: Array<ZoneCapacity>;
    tableTypes: Array<TableType>;
    reservationRules: ReservationRules;
    currency: string;
    restaurantName: string;
    closingHour: bigint;
    contactEmail: string;
    occupancySettings?: OccupancySettings;
    branding: BrandingSettings;
    exceptionalClosingDays: Array<ClosingDay>;
    services: Array<ServiceHours>;
    totalSeatsPerSlot: bigint;
    slotIntervalMinutes: bigint;
    contactPhone: string;
}
export interface TimeSlot {
    status: TimeSlotStatus;
    time: string;
    totalSeats: bigint;
    availableSeats: bigint;
}
export interface FloorState {
    tables: Array<Table>;
    updatedAt: Timestamp;
}
export interface ReservationSummary {
    date: string;
    time: string;
    tableId: string;
    partySize: bigint;
}
export interface ReservationRules {
    maxStayMinutesDinner: bigint;
    maxPartySize: bigint;
    maxStayMinutesLunch: bigint;
    advanceBookingDays: bigint;
    noShowFeeEur: bigint;
    minPartySize: bigint;
    depositAmountEur: bigint;
    depositRequiredAbovePartySize: bigint;
    depositRequired: boolean;
    cancellationHoursBeforeFree: bigint;
}
export interface NotificationSettings {
    sendReminderEmail: boolean;
    waitlistAutoActivate: boolean;
    sendCancellationEmail: boolean;
    reminderHoursBefore: Array<bigint>;
    sendConfirmationEmail: boolean;
}
export interface ReservationFilter {
    status?: ReservationStatus;
    date?: string;
    guestId?: GuestId;
}
export interface TableType {
    count: bigint;
    typeName: string;
    capacity: bigint;
}
export type ReservationId = string;
export interface Reservation {
    id: ReservationId;
    status: ReservationStatus;
    experienceId?: ExperienceId;
    date: string;
    specialRequests?: string;
    createdAt: Timestamp;
    time: string;
    stripePaymentIntentId?: string;
    partySize: bigint;
    guestId: GuestId;
}
export interface CustomQuestion {
    id: string;
    labelText: string;
    questionType: Variant_text_dropdown;
    required: boolean;
    options: Array<string>;
}
export interface ClosingDay {
    date: string;
    serviceId?: string;
    reason: string;
}
export interface AISeatingSuggestion {
    suggestionId: string;
    date: string;
    createdAt: bigint;
    reasoning: string;
    zonePreference?: string;
    partySize: bigint;
    confidence: number;
    suggestedTableIds: Array<string>;
}
export interface SuggestionAccuracyStats {
    periodDays: bigint;
    acceptedCount: bigint;
    acceptanceRatePct: number;
    totalSuggestions: bigint;
    rejectedCount: bigint;
}
export interface WaitlistEntry {
    id: WaitlistId;
    status: WaitlistStatus;
    date: string;
    joinedAt: Timestamp;
    notifiedAt?: Timestamp;
    notes?: string;
    requestedTime?: string;
    partySize: bigint;
    guestId: GuestId;
}
export interface Table {
    x: bigint;
    y: bigint;
    id: TableId;
    status: TableStatus;
    name: string;
    seatCount?: bigint;
    guestName?: string;
    groupId?: string;
    capacity: bigint;
    reservationId?: ReservationId;
}
export interface Guest {
    id: GuestId;
    reservationIds: Array<ReservationId>;
    name: string;
    createdAt: Timestamp;
    tags: Array<string>;
    email: string;
    phone?: string;
}
export interface Experience {
    id: ExperienceId;
    maxCapacity: bigint;
    name: string;
    pricePerPerson: bigint;
    description: string;
    isActive: boolean;
}
export interface TeamMember {
    id: string;
    name: string;
    createdAt: bigint;
    role: string;
    email: string;
    principalId: string;
}
export type GuestId = string;
export type TableId = string;
export interface ServiceHours {
    id: string;
    closeTime: string;
    maxCapacity: bigint;
    name: string;
    openTime: string;
    enabledDays: Array<DayOfWeek>;
}
export interface OccupancySettings {
    globalCeilingPercent: bigint;
    maxGuestsPerReservationMax: bigint;
    maxGuestsPerReservationMin: bigint;
}
export interface SeasonalPeriod {
    id: string;
    dateTo: string;
    autoActivate: boolean;
    name: string;
    capacityOverride?: bigint;
    activatedZones: Array<string>;
    isActive: boolean;
    dateFrom: string;
}
export enum ReservationStatus {
    cancelled = "cancelled",
    late = "late",
    seated = "seated",
    waitlist = "waitlist",
    departed = "departed",
    confirmed = "confirmed",
    not_arrived = "not_arrived"
}
export enum TableStatus {
    occupied = "occupied",
    reserved = "reserved",
    empty = "empty",
    unavailable = "unavailable"
}
export enum TimeSlotStatus {
    full = "full",
    available = "available",
    limited = "limited"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_text_dropdown {
    text = "text",
    dropdown = "dropdown"
}
export enum WaitlistStatus {
    expired = "expired",
    confirmed = "confirmed",
    offered = "offered",
    waiting = "waiting"
}
export interface backendInterface {
    addTeamMember(principalId: string, name: string, email: string, role: string): Promise<{
        __kind__: "ok";
        ok: TeamMember;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addToWaitlist(guestId: GuestId, date: string, partySize: bigint, requestedTime: string | null, notes: string | null): Promise<WaitlistEntry>;
    askAI(prompt: string, context: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignReservationToTable(tableId: TableId, reservationId: ReservationId): Promise<{
        __kind__: "ok";
        ok: TableAssignment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignReservationToTableWithDetails(tableId: TableId, reservationId: ReservationId, guestName: string, seatCount: bigint): Promise<{
        __kind__: "ok";
        ok: TableAssignment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    autoAssignTable(reservationId: ReservationId, partySize: bigint): Promise<{
        __kind__: "ok";
        ok: Table;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelReservation(id: ReservationId): Promise<void>;
    createExperience(name: string, description: string, pricePerPerson: bigint, maxCapacity: bigint): Promise<Experience>;
    createGuest(name: string, email: string, phone: string | null): Promise<Guest>;
    createReservation(guestId: GuestId, date: string, time: string, partySize: bigint, experienceId: ExperienceId | null, stripePaymentIntentId: string | null, specialRequests: string | null): Promise<Reservation>;
    createReservationWithDetails(guestName: string, phone: string, email: string, partySize: bigint, date: string, timeSlot: string, tableId: string | null, notes: string | null): Promise<{
        __kind__: "ok";
        ok: Reservation;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTable(name: string, capacity: bigint, x: bigint, y: bigint): Promise<{
        __kind__: "ok";
        ok: Table;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteSeasonalPeriod(id: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTable(id: TableId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    findBestTable(partySize: bigint, excludeTableIds: Array<string>): Promise<Table | null>;
    findBestTableForReservation(partySize: bigint): Promise<Table | null>;
    getAISuggestions(guestId: GuestId | null, reservationContext: string): Promise<{
        __kind__: "ok";
        ok: Array<string>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getActiveSeason(date: string): Promise<SeasonalPeriod | null>;
    getActiveZonesForDate(date: string): Promise<Array<string>>;
    getAvailableSlots(date: string): Promise<Array<TimeSlot>>;
    getCallerUserRole(): Promise<UserRole>;
    getExtendedConfig(): Promise<RestaurantExtendedConfig>;
    getFloorState(): Promise<FloorState>;
    getGuest(id: GuestId): Promise<Guest | null>;
    getKPIs(): Promise<KPIs>;
    getReservation(id: ReservationId): Promise<Reservation | null>;
    getRestaurantConfig(): Promise<{
        openingHour: bigint;
        restaurantName: string;
        closingHour: bigint;
        totalSeatsPerSlot: bigint;
        slotIntervalMinutes: bigint;
    }>;
    getSeasonalPeriods(): Promise<Array<SeasonalPeriod>>;
    getSuggestionAccuracyStats(days: bigint): Promise<SuggestionAccuracyStats>;
    getTables(): Promise<Array<Table>>;
    getWaitlist(date: string): Promise<Array<WaitlistEntry>>;
    getWaitlistEntry(id: WaitlistId): Promise<WaitlistEntry | null>;
    groupTables(tableIds: Array<string>, groupId: string): Promise<{
        __kind__: "ok";
        ok: Array<Table>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    hasOwner(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listActiveExperiences(): Promise<Array<Experience>>;
    listExperiences(): Promise<Array<Experience>>;
    listGuests(): Promise<Array<Guest>>;
    listReservations(filter: ReservationFilter): Promise<Array<Reservation>>;
    listTeamMembers(): Promise<Array<TeamMember>>;
    offerWaitlistSpot(id: WaitlistId): Promise<void>;
    recordSuggestionFeedback(suggestionId: string, accepted: boolean, rejectionReason: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeTeamMember(memberId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeWaitlistEntry(id: WaitlistId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    reofferWaitlistSpot(id: WaitlistId): Promise<{
        __kind__: "ok";
        ok: WaitlistEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveSeasonalPeriod(period: SeasonalPeriod): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchGuests(searchQuery: string): Promise<Array<Guest>>;
    setOwner(owner: Principal): Promise<void>;
    setTableStatus(tableId: TableId, status: TableStatus): Promise<{
        __kind__: "ok";
        ok: Table;
    } | {
        __kind__: "err";
        err: string;
    }>;
    suggestTable(partySize: bigint, zonePreference: string | null, date: string, time: string, existingReservations: Array<ReservationSummary>): Promise<{
        __kind__: "ok";
        ok: AISeatingSuggestion;
    } | {
        __kind__: "err";
        err: string;
    }>;
    toggleSeasonalPeriod(id: string, active: boolean): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unassignTable(tableId: TableId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    ungroupTables(groupId: string): Promise<{
        __kind__: "ok";
        ok: Array<Table>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateBrandingSettings(branding: BrandingSettings): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCapacitySettings(zones: Array<ZoneCapacity>, tableTypes: Array<TableType>, occupancySettings: OccupancySettings | null, totalSeatsPerSlot: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateExceptionalClosingDays(fixedClosingDays: Array<DayOfWeek>, exceptionalClosingDays: Array<ClosingDay>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateExperience(experience: Experience): Promise<void>;
    updateGeneralInfo(restaurantName: string, currency: string, timezone: string, contactPhone: string, contactEmail: string, logoUrl: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGuestFormSettings(guestForm: GuestFormSettings): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGuestTags(id: GuestId, tags: Array<string>): Promise<void>;
    updateIntegrationSettings(integrations: IntegrationSettings): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNotificationSettings(notifications: NotificationSettings): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateReservation(id: ReservationId, date: string, time: string, partySize: bigint, specialRequests: string | null): Promise<{
        __kind__: "ok";
        ok: Reservation;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateReservationRules(reservationRules: ReservationRules): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateReservationStatus(id: ReservationId, status: ReservationStatus): Promise<void>;
    updateRestaurantConfig(restaurantName: string, totalSeatsPerSlot: bigint, openingHour: bigint, closingHour: bigint, slotIntervalMinutes: bigint): Promise<void>;
    updateServiceHours(services: Array<ServiceHours>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTablePosition(id: TableId, x: bigint, y: bigint): Promise<{
        __kind__: "ok";
        ok: Table;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTeamMemberRole(memberId: string, newRole: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWaitlistEntry(id: WaitlistId, partySize: bigint, notes: string | null): Promise<{
        __kind__: "ok";
        ok: WaitlistEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
