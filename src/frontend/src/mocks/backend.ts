/**
 * Emergency offline fallback mock.
 *
 * This file is ONLY used when the real backend actor is unreachable (e.g.
 * during local development with no local replica running). It is NEVER
 * imported in production paths — all hooks use `useActor(createActor)` and
 * return empty arrays when the actor is unavailable.
 *
 * To use this fallback during development, explicitly import it in the
 * component or hook you want to test, guarded by an `import.meta.env.DEV` check.
 */

import type { backendInterface } from "../backend";
import {
  ReservationStatus,
  ReviewRequestDelay,
  TableStatus,
  TimeSlotStatus,
  UserRole,
  WaitlistStatus,
} from "../backend";

export const mockBackend: backendInterface = {
  addToWaitlist: async (guestId, date, partySize, requestedTime, _notes) => ({
    __kind__: "ok" as const,
    ok: {
      id: "wl-1",
      status: WaitlistStatus.waiting,
      date,
      joinedAt: BigInt(Date.now()),
      requestedTime: requestedTime ?? undefined,
      partySize,
      guestId,
    },
  }),

  askAI: async (_prompt, _context) => ({
    __kind__: "ok",
    ok: "Ik adviseer tafel 4 voor 2 gasten bij het raam.",
  }),

  assignCallerUserRole: async (_user, _role) => undefined,

  assignReservationToTable: async (tableId, reservationId) => ({
    __kind__: "ok",
    ok: {
      assignedAt: BigInt(Date.now()),
      seatCount: BigInt(4),
      tableId,
      guestName: "Jan Janssen",
      reservationId,
    },
  }),

  assignReservationToTableWithDetails: async (tableId, reservationId, guestName, seatCount) => ({
    __kind__: "ok",
    ok: {
      assignedAt: BigInt(Date.now()),
      seatCount,
      tableId,
      guestName,
      reservationId,
    },
  }),

  cancelReservation: async (_id) => undefined,

  createExperience: async (name, description, pricePerPerson, maxCapacity, required) => ({
    id: "exp-1",
    name,
    description,
    pricePerPerson,
    maxCapacity,
    isActive: true,
    required: required ?? false,
  }),

  createGuest: async (name, email, phone) => ({
    id: "guest-1",
    name,
    email,
    phone: phone ?? undefined,
    reservationIds: [],
    tags: [],
    createdAt: BigInt(Date.now()),
  }),

  createReservation: async (guestId, date, time, partySize, experienceId, stripePaymentIntentId, specialRequests) => ({
    id: "res-1",
    status: ReservationStatus.confirmed,
    date,
    time,
    partySize,
    guestId,
    experienceId: experienceId ?? undefined,
    stripePaymentIntentId: stripePaymentIntentId ?? undefined,
    specialRequests: specialRequests ?? undefined,
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    changes: [],
  }),

  createReservationWithDetails: async (_guestName, _phone, _email, partySize, date, timeSlot, _tableId, _notes, _experienceId) => ({
    __kind__: "ok",
    ok: {
      id: "res-2",
      status: ReservationStatus.confirmed,
      date,
      time: timeSlot,
      partySize,
      guestId: "guest-1",
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      changes: [],
    },
  }),

  createTable: async (name, capacity, x, y, _zone) => ({
    __kind__: "ok",
    ok: {
      id: "table-new",
      name,
      capacity,
      x,
      y,
      status: TableStatus.empty,
    },
  }),

  deleteTable: async (_id) => ({ __kind__: "ok", ok: null }),

  getAISuggestions: async (_guestId, _reservationContext) => ({
    __kind__: "ok",
    ok: ["Tafel 3 bij het raam is beschikbaar", "Tafel 7 in de stille hoek"],
  }),

  getAvailableSlots: async (_date) => ({
    fixedClosingDays: [] as Array<bigint>,
    slots: [
      { time: "12:00", status: TimeSlotStatus.available, totalSeats: BigInt(20), availableSeats: BigInt(12) },
      { time: "12:30", status: TimeSlotStatus.limited, totalSeats: BigInt(20), availableSeats: BigInt(4) },
      { time: "13:00", status: TimeSlotStatus.full, totalSeats: BigInt(20), availableSeats: BigInt(0) },
      { time: "19:00", status: TimeSlotStatus.available, totalSeats: BigInt(20), availableSeats: BigInt(18) },
      { time: "19:30", status: TimeSlotStatus.available, totalSeats: BigInt(20), availableSeats: BigInt(14) },
      { time: "20:00", status: TimeSlotStatus.limited, totalSeats: BigInt(20), availableSeats: BigInt(5) },
    ],
  }),

  getCallerUserRole: async () => UserRole.admin,

  getExtendedConfig: async () => ({
    __kind__: "ok" as const,
    ok: {
    restaurantName: "ZenReserve Restaurant",
    timezone: "Europe/Brussels",
    currency: "EUR",
    contactPhone: "+32 9 123 45 67",
    contactEmail: "info@zenreserve.nl",
    logoUrl: undefined,
    openingHour: BigInt(12),
    closingHour: BigInt(22),
    totalSeatsPerSlot: BigInt(20),
    slotIntervalMinutes: BigInt(30),
    services: [
      {
        id: "lunch",
        closeTime: "15:00",
        maxCapacity: BigInt(40),
        name: "Lunch",
        openTime: "12:00",
        enabledDays: [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)] as Array<bigint>,
      },
      {
        id: "dinner",
        closeTime: "22:00",
        maxCapacity: BigInt(60),
        name: "Diner",
        openTime: "18:00",
        enabledDays: [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)] as Array<bigint>,
      },
    ],
    zones: [
      { zoneName: "Terras", maxGuests: BigInt(30) },
      { zoneName: "Zaal", maxGuests: BigInt(50) },
    ],
    zoneDefs: [
      { id: "Terras", name: "Terras", color: "#22C55E", maxGuests: BigInt(30) },
      { id: "Zaal", name: "Zaal", color: "#3B82F6", maxGuests: BigInt(50) },
    ],
    tableTypes: [
      { count: BigInt(5), typeName: "2-persoons", capacity: BigInt(2) },
      { count: BigInt(8), typeName: "4-persoons", capacity: BigInt(4) },
    ],
    fixedClosingDays: [BigInt(5), BigInt(6)] as Array<bigint>,
    exceptionalClosingDays: [],
    occupancySettings: {
      globalCeilingPercent: BigInt(85),
      maxGuestsPerReservationMin: BigInt(1),
      maxGuestsPerReservationMax: BigInt(10),
    },
    reservationRules: {
      advanceBookingDays: BigInt(90),
      cancellationHoursBeforeFree: BigInt(24),
      depositRequired: false,
      depositAmountEur: BigInt(25),
      depositRequiredAbovePartySize: BigInt(6),
      noShowFeeEur: BigInt(15),
      minPartySize: BigInt(1),
      maxPartySize: BigInt(20),
      maxStayMinutesLunch: BigInt(90),
      maxStayMinutesDinner: BigInt(120),
    },
    guestForm: {
      requirePhone: true,
      requireAllergies: false,
      requireDietPreferences: false,
      showBabiesChildren: true,
      customQuestions: [],
    },
    notifications: {
      sendConfirmationEmail: true,
      sendReminderEmail: true,
      reminderHoursBefore: [BigInt(24)],
      sendCancellationEmail: true,
      waitlistAutoActivate: true,
    },
    integrations: {
      stripeEnabled: false,
      stripePublicKey: "",
      mollieEnabled: false,
      calendarSyncEnabled: false,
      apiKey: "",
      posSystem: undefined,
    },
    branding: {
      primaryColor: "#22C55E",
      accentColor: "#3B82F6",
      logoUrl: undefined,
      welcomeText: "Welkom bij ZenReserve",
      confirmationText: "Bedankt voor uw reservering!",
      defaultLanguage: "nl",
    },
    },
  }),

  getFloorState: async () => ({
    tables: [
      { x: BigInt(80), y: BigInt(80), id: "t-1", status: TableStatus.empty, name: "T1", capacity: BigInt(2) },
      { x: BigInt(200), y: BigInt(80), id: "t-2", status: TableStatus.reserved, name: "T2", capacity: BigInt(4), guestName: "De Smedt", reservationId: "r-1" },
      { x: BigInt(320), y: BigInt(80), id: "t-3", status: TableStatus.occupied, name: "T3", capacity: BigInt(4), guestName: "Willems" },
      { x: BigInt(80), y: BigInt(200), id: "t-4", status: TableStatus.empty, name: "T4", capacity: BigInt(6) },
      { x: BigInt(200), y: BigInt(200), id: "t-5", status: TableStatus.empty, name: "T5", capacity: BigInt(2) },
    ],
    updatedAt: BigInt(Date.now()),
  }),

  getGuest: async (id) => ({
    id,
    name: "Onbekende gast",
    email: "",
    reservationIds: [],
    tags: [],
    createdAt: BigInt(Date.now()),
  }),

  getKPIs: async () => ({
    todayReservationCount: BigInt(18),
    occupancyPct: BigInt(72),
    avgPartySize: BigInt(3),
    noShowCount: BigInt(1),
    todayCoversPerService: [["Lunch", BigInt(24)], ["Diner", BigInt(48)]] as Array<[string, bigint]>,
    waitlistCount: BigInt(3),
  }),

  getReservation: async (_id) => null,

  getRestaurantConfig: async () => ({
    restaurantName: "",
    openingHour: BigInt(12),
    closingHour: BigInt(22),
    totalSeatsPerSlot: BigInt(20),
    slotIntervalMinutes: BigInt(30),
  }),

  getTables: async () => [
    { x: BigInt(80), y: BigInt(80), id: "t-1", status: TableStatus.empty, name: "Tafel 1", capacity: BigInt(2) },
    { x: BigInt(200), y: BigInt(80), id: "t-2", status: TableStatus.reserved, name: "Tafel 2", capacity: BigInt(4), guestName: "De Smedt" },
    { x: BigInt(320), y: BigInt(80), id: "t-3", status: TableStatus.occupied, name: "Tafel 3", capacity: BigInt(4), guestName: "Willems" },
  ],

  getWaitlist: async (_date) => [
    {
      id: "wl-1",
      status: WaitlistStatus.waiting,
      date: "2026-04-17",
      joinedAt: BigInt(Date.now() - 3600000),
      partySize: BigInt(3),
      guestId: "g-1",
      requestedTime: "19:00",
      notes: "Graag een raamtafel",
    },
    {
      id: "wl-2",
      status: WaitlistStatus.offered,
      date: "2026-04-17",
      joinedAt: BigInt(Date.now() - 7200000),
      partySize: BigInt(2),
      guestId: "g-2",
    },
    {
      id: "wl-3",
      status: WaitlistStatus.waiting,
      date: "2026-04-17",
      joinedAt: BigInt(Date.now() - 1800000),
      partySize: BigInt(4),
      guestId: "g-3",
    },
  ],

  getWaitlistEntry: async (_id) => null,

  isCallerAdmin: async () => true,

  listActiveExperiences: async () => [
    {
      id: "exp-1",
      maxCapacity: BigInt(20),
      name: "Chef's Table",
      pricePerPerson: BigInt(75),
      description: "Een exclusieve culinaire ervaring met 5 gangen.",
      isActive: true,
      required: false,
    },
  ],

  listExperiences: async () => [
    {
      id: "exp-1",
      maxCapacity: BigInt(20),
      name: "Chef's Table",
      pricePerPerson: BigInt(75),
      description: "Een exclusieve culinaire ervaring met 5 gangen.",
      isActive: true,
      required: false,
    },
    {
      id: "exp-2",
      maxCapacity: BigInt(10),
      name: "Wijnproeverij",
      pricePerPerson: BigInt(45),
      description: "Proef de beste wijnen uit onze kelder.",
      isActive: false,
      required: false,
    },
  ],

  listGuests: async () => [
    {
      id: "g-1",
      reservationIds: ["r-1", "r-2"] as Array<string>,
      name: "Maria Peeters",
      createdAt: BigInt(Date.now() - 86400000 * 30),
      tags: ["vip"],
      email: "maria@example.com",
      phone: "+32 470 12 34 56",
    },
    {
      id: "g-2",
      reservationIds: ["r-3"] as Array<string>,
      name: "Jan De Smedt",
      createdAt: BigInt(Date.now() - 86400000 * 14),
      tags: [] as Array<string>,
      email: "jan.desmedt@example.com",
    },
    {
      id: "g-3",
      reservationIds: [] as Array<string>,
      name: "Sophie Willems",
      createdAt: BigInt(Date.now() - 86400000 * 7),
      tags: ["allergieën"] as Array<string>,
      email: "sophie.w@example.com",
      phone: "+32 485 99 88 77",
    },
  ],

  listReservations: async (_filter) => ({
    __kind__: "ok" as const,
    ok: [
      {
        id: "r-1",
        status: ReservationStatus.confirmed,
        date: new Date().toISOString().split("T")[0],
        createdAt: BigInt(Date.now() - 86400000),
        updatedAt: BigInt(Date.now() - 86400000),
        changes: [],
        time: "19:00",
        partySize: BigInt(2),
        guestId: "g-1",
      },
      {
        id: "r-2",
        status: ReservationStatus.seated,
        date: new Date().toISOString().split("T")[0],
        createdAt: BigInt(Date.now() - 43200000),
        updatedAt: BigInt(Date.now() - 43200000),
        changes: [],
        time: "12:30",
        partySize: BigInt(4),
        guestId: "g-2",
      },
      {
        id: "r-3",
        status: ReservationStatus.departed,
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        createdAt: BigInt(Date.now() - 172800000),
        updatedAt: BigInt(Date.now() - 172800000),
        changes: [],
        time: "20:00",
        partySize: BigInt(3),
        guestId: "g-3",
      },
    ],
  }),

  offerWaitlistSpot: async (_id) => undefined,

  searchGuests: async (_query, _limit, _offset) => ({ total: 0n, guests: [] }),

  setTableStatus: async (tableId, status) => ({
    __kind__: "ok",
    ok: { id: tableId, name: "T1", capacity: BigInt(4), x: BigInt(80), y: BigInt(80), status },
  }),

  unassignTable: async (_tableId) => ({ __kind__: "ok", ok: null }),

  updateCapacitySettings: async (_zones, _tableTypes, _occupancySettings, _totalSeatsPerSlot) => ({
    __kind__: "ok",
    ok: null,
  }),

  updateExceptionalClosingDays: async (_fixedClosingDays, _exceptionalClosingDays) => ({
    __kind__: "ok",
    ok: null,
  }),

  updateExperience: async (_experience) => undefined,

  updateGeneralInfo: async (_restaurantName, _currency, _timezone, _contactPhone, _contactEmail, _logoUrl) => ({
    __kind__: "ok",
    ok: null,
  }),

  updateGuestTags: async (_id, _tags) => undefined,

  updateReservation: async (id, date, time, partySize, specialRequests) => ({
    __kind__: "ok",
    ok: {
      id,
      status: ReservationStatus.confirmed,
      date,
      time,
      partySize,
      guestId: "guest-1",
      specialRequests: specialRequests ?? undefined,
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      changes: [],
    },
  }),

  updateReservationStatus: async (_id, _status) => undefined,

  updateRestaurantConfig: async (_restaurantName, _totalSeatsPerSlot, _openingHour, _closingHour, _slotIntervalMinutes) => undefined,

  updateServiceHours: async (_services) => ({ __kind__: "ok", ok: null }),

  updateTablePosition: async (id, x, y) => ({
    __kind__: "ok",
    ok: { id, name: "T1", capacity: BigInt(4), x, y, status: TableStatus.empty },
  }),

  updateTableCapacity: async (tableId, newCapacity) => ({
    __kind__: "ok",
    ok: { id: tableId, name: "T1", capacity: newCapacity, x: BigInt(80), y: BigInt(80), status: TableStatus.empty },
  }),

  updateTableZone: async (tableId, _zone) => ({
    __kind__: "ok",
    ok: { id: tableId, name: "T1", capacity: BigInt(4), x: BigInt(80), y: BigInt(80), status: TableStatus.empty },
  }),

  deleteSeasonalPeriod: async (_id) => ({ __kind__: "ok", ok: null }),

  getActiveSeason: async (_date) => null,

  getActiveZonesForDate: async (_date) => [],

  getSeasonalPeriods: async () => [
    {
      id: "s-1",
      dateTo: "2026-09-01",
      autoActivate: true,
      name: "Zomer 2026",
      capacityOverride: BigInt(80),
      activatedZones: ["Terras"],
      isActive: true,
      dateFrom: "2026-06-01",
    },
  ],

  getSuggestionAccuracyStats: async (_days) => ({
    periodDays: BigInt(30),
    totalSuggestions: BigInt(0),
    acceptedCount: BigInt(0),
    rejectedCount: BigInt(0),
    acceptanceRatePct: 0,
  }),

  recordSuggestionFeedback: async (_suggestionId, _accepted, _rejectionReason) => ({
    __kind__: "ok",
    ok: null,
  }),

  saveSeasonalPeriod: async (_period) => ({ __kind__: "ok", ok: null }),

  suggestTable: async (_partySize, _zonePreference, _date, _time, _existingReservations) => ({
    __kind__: "ok",
    ok: {
      suggestionId: "sug-1",
      date: new Date().toISOString().split("T")[0],
      createdAt: BigInt(Date.now()),
      reasoning: "Geen tafels beschikbaar in de offline modus.",
      zonePreference: undefined,
      partySize: _partySize,
      confidence: 0,
      suggestedTableIds: [],
    },
  }),

  toggleSeasonalPeriod: async (_id, _active) => ({ __kind__: "ok", ok: null }),

  addTeamMember: async (_principalId, name, email, role) => ({
    __kind__: "ok",
    ok: {
      id: Date.now().toString(),
      principalId: _principalId,
      name,
      email,
      role,
      createdAt: BigInt(Date.now()),
    },
  }),

  listTeamMembers: async () => [
    {
      id: "tm-1",
      name: "Jan Janssen",
      createdAt: BigInt(Date.now() - 86400000 * 60),
      role: "admin",
      email: "jan@zenreserve.nl",
      principalId: "abc-def-ghi",
    },
    {
      id: "tm-2",
      name: "Lien Maes",
      createdAt: BigInt(Date.now() - 86400000 * 30),
      role: "user",
      email: "lien@zenreserve.nl",
      principalId: "jkl-mno-pqr",
    },
  ],

  removeTeamMember: async (_memberId) => ({ __kind__: "ok", ok: null }),

  updateTeamMemberRole: async (_memberId, _newRole) => ({ __kind__: "ok", ok: null }),

  updateBrandingSettings: async (_branding) => ({ __kind__: "ok", ok: null }),

  updateGuestFormSettings: async (_guestForm) => ({ __kind__: "ok", ok: null }),

  updateIntegrationSettings: async (_integrations) => ({ __kind__: "ok", ok: null }),

  updateNotificationSettings: async (_notifications) => ({ __kind__: "ok", ok: null }),

  updateReservationRules: async (_reservationRules) => ({ __kind__: "ok", ok: null }),

  autoAssignTable: async (_reservationId, _partySize) => ({
    __kind__: "ok",
    ok: { id: "t1", name: "T1", capacity: BigInt(2), x: BigInt(80), y: BigInt(80), status: TableStatus.empty },
  }),

  findBestTable: async (_partySize, _excludeTableIds) => null,

  findBestTableForReservation: async (_partySize) => null,

  groupTables: async (_tableIds, groupId) => ({
    __kind__: "ok",
    ok: [],
  }),

  ungroupTables: async (_groupId) => ({
    __kind__: "ok",
    ok: [],
  }),

  removeWaitlistEntry: async (_id) => ({ __kind__: "ok", ok: null }),

  reofferWaitlistSpot: async (id) => ({
    __kind__: "ok",
    ok: {
      id,
      status: WaitlistStatus.waiting,
      date: new Date().toISOString().split("T")[0],
      joinedAt: BigInt(Date.now()),
      partySize: BigInt(0),
      guestId: "",
    },
  }),

  updateWaitlistEntry: async (id, partySize, _notes) => ({
    __kind__: "ok",
    ok: {
      id,
      status: WaitlistStatus.waiting,
      date: new Date().toISOString().split("T")[0],
      joinedAt: BigInt(Date.now()),
      partySize,
      guestId: "",
    },
  }),

  _initializeAccessControl: async () => undefined,

  hasOwner: async () => false,

  setOwner: async (_owner) => undefined,

  getEmailTemplates: async () => [],

  resetEmailTemplate: async (_templateType) => ({ __kind__: "ok", ok: null }),

  saveEmailTemplate: async (_template) => ({ __kind__: "ok", ok: null }),

  saveEmailTemplates: async (_templates) => ({ __kind__: "ok", ok: null }),

  syncTablesFromSettings: async () => ({ __kind__: "ok", ok: BigInt(0) }),

  applyHouseStyleToAll: async (_accentColor, _backgroundColor, _logoUrl) => ({
    __kind__: "ok",
    ok: null,
  }),

  getReviewRequestSettings: async () => ({
    enabled: true,
    delay: ReviewRequestDelay.hour24,
    message: "Bedankt voor uw bezoek! We hopen u snel weer te zien. Laat een recensie achter:",
  }),

  saveReviewRequestSettings: async (_enabled, _delay, _message) => ({
    __kind__: "ok",
    ok: null,
  }),

  recordReviewRequestSent: async (_reservationId) => ({
    __kind__: "ok",
    ok: null,
  }),

  shouldSendReviewRequest: async (_reservationId) => false,

  getAuditLog: async () => ({ __kind__: "ok" as const, ok: [] }),

  getAuditLogPaginated: async (_offset, _limit) => ({
    __kind__: "ok" as const,
    ok: { total: BigInt(0), entries: [] },
  }),

  logAuditEntry: async (_callerText, _page, _action, _summary, _oldValue, _newValue) => {
    // no-op mock
  },

  createTableGroupDefinition: async (name, tableIds, description) => ({
    __kind__: "ok" as const,
    ok: { id: "tgd-1", name, tableIds, description, totalCapacity: BigInt(0) },
  }),

  deleteTableGroupDefinition: async (_id) => ({ __kind__: "ok" as const, ok: null }),

  getReservationChanges: async (_id) => ({ __kind__: "ok" as const, ok: [] }),

  getTableGroupDefinitions: async () => ({ __kind__: "ok" as const, ok: [] }),

  updateTableGroupDefinition: async (id, name, tableIds, description) => ({
    __kind__: "ok" as const,
    ok: { id, name, tableIds, description, totalCapacity: BigInt(0) },
  }),

  addZone: async (name, color, maxGuests) => ({
    __kind__: "ok" as const,
    ok: { id: name, name, color, maxGuests },
  }),

  deleteZone: async (_id) => ({ __kind__: "ok" as const, ok: true }),

  getZones: async () => ({
    __kind__: "ok" as const,
    ok: [
      { id: "Terras", name: "Terras", color: "#22C55E", maxGuests: BigInt(30) },
      { id: "Zaal", name: "Zaal", color: "#3B82F6", maxGuests: BigInt(50) },
    ],
  }),

  updateZone: async (id, name, color, maxGuests) => ({
    __kind__: "ok" as const,
    ok: { id, name, color, maxGuests },
  }),

  updateZoneBoundaries: async (_id, _boundaries) => ({ __kind__: "ok" as const, ok: true }),
};
