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
  TableStatus,
  TimeSlotStatus,
  UserRole,
  WaitlistStatus,
} from "../backend";

export const mockBackend: backendInterface = {
  addToWaitlist: async (guestId, date, partySize, requestedTime, _notes) => ({
    id: "wl-1",
    status: WaitlistStatus.waiting,
    date,
    joinedAt: BigInt(Date.now()),
    requestedTime: requestedTime ?? undefined,
    partySize,
    guestId,
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

  createExperience: async (name, description, pricePerPerson, maxCapacity) => ({
    id: "exp-1",
    name,
    description,
    pricePerPerson,
    maxCapacity,
    isActive: true,
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
  }),

  createReservationWithDetails: async (_guestName, _phone, _email, partySize, date, timeSlot, _tableId, _notes) => ({
    __kind__: "ok",
    ok: {
      id: "res-2",
      status: ReservationStatus.confirmed,
      date,
      time: timeSlot,
      partySize,
      guestId: "guest-1",
      createdAt: BigInt(Date.now()),
    },
  }),

  createTable: async (name, capacity, x, y) => ({
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

  getAvailableSlots: async (_date) => [
    { time: "12:00", status: TimeSlotStatus.available, totalSeats: BigInt(20), availableSeats: BigInt(12) },
    { time: "12:30", status: TimeSlotStatus.limited, totalSeats: BigInt(20), availableSeats: BigInt(4) },
    { time: "13:00", status: TimeSlotStatus.full, totalSeats: BigInt(20), availableSeats: BigInt(0) },
    { time: "19:00", status: TimeSlotStatus.available, totalSeats: BigInt(20), availableSeats: BigInt(18) },
    { time: "19:30", status: TimeSlotStatus.available, totalSeats: BigInt(20), availableSeats: BigInt(14) },
    { time: "20:00", status: TimeSlotStatus.limited, totalSeats: BigInt(20), availableSeats: BigInt(5) },
  ],

  getCallerUserRole: async () => UserRole.admin,

  getExtendedConfig: async () => ({
    restaurantName: "",
    timezone: "Europe/Brussels",
    currency: "EUR",
    contactPhone: "",
    contactEmail: "",
    logoUrl: undefined,
    openingHour: BigInt(12),
    closingHour: BigInt(22),
    totalSeatsPerSlot: BigInt(20),
    slotIntervalMinutes: BigInt(30),
    services: [],
    zones: [],
    tableTypes: [],
    fixedClosingDays: [],
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
      welcomeText: "",
      confirmationText: "",
      defaultLanguage: "nl",
    },
  }),

  getFloorState: async () => ({
    tables: [],
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
    todayReservationCount: BigInt(0),
    occupancyPct: BigInt(0),
    avgPartySize: BigInt(0),
    noShowCount: BigInt(0),
    todayCoversPerService: [] as Array<[string, bigint]>,
  }),

  getReservation: async (_id) => null,

  getRestaurantConfig: async () => ({
    restaurantName: "",
    openingHour: BigInt(12),
    closingHour: BigInt(22),
    totalSeatsPerSlot: BigInt(20),
    slotIntervalMinutes: BigInt(30),
  }),

  getTables: async () => [],

  getWaitlist: async (_date) => [],

  getWaitlistEntry: async (_id) => null,

  isCallerAdmin: async () => true,

  listActiveExperiences: async () => [],

  listExperiences: async () => [],

  listGuests: async () => [],

  listReservations: async (_filter) => [],

  offerWaitlistSpot: async (_id) => undefined,

  searchGuests: async (_query) => [],

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
    },
  }),

  updateReservationStatus: async (_id, _status) => undefined,

  updateRestaurantConfig: async (_restaurantName, _totalSeatsPerSlot, _openingHour, _closingHour, _slotIntervalMinutes) => undefined,

  updateServiceHours: async (_services) => ({ __kind__: "ok", ok: null }),

  updateTablePosition: async (id, x, y) => ({
    __kind__: "ok",
    ok: { id, name: "T1", capacity: BigInt(4), x, y, status: TableStatus.empty },
  }),

  deleteSeasonalPeriod: async (_id) => ({ __kind__: "ok", ok: null }),

  getActiveSeason: async (_date) => null,

  getActiveZonesForDate: async (_date) => [],

  getSeasonalPeriods: async () => [],

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

  listTeamMembers: async () => [],

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
};
