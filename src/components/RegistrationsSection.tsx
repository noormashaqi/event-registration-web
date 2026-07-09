/**
 * Registrations Section Component
 * Displays registrations for an event and manages registration actions
 */

import React, { useState, useEffect } from 'react';
import { getEventRegistrations, registerParticipant, cancelRegistration } from '../api/services/registrations';
import { getParticipants } from '../api/services/participants';
import type { PaginatedRegistrations, RegisterParticipantRequest } from '../types/registration';
import type { PaginatedParticipants } from '../types/participant';
import { ApiError } from '../api/client';
import { ConfirmDialog } from './ui/ConfirmDialog';
import ErrorAlert from './ui/ErrorAlert';
import LoadingSpinner from './ui/LoadingSpinner';
import EmptyState from './ui/EmptyState';

interface RegistrationsSectionProps {
  eventId: number;
  eventStartTime: Date;
  registrationDeadline: Date;
  capacity: number;
  eventIsActive: boolean;
}

interface RegistrationsSectionState {
  registrations: PaginatedRegistrations | null;
  loading: boolean;
  error: ApiError | null;
  searchTerm: string;
  selectedStatus: '' | '1' | '2';
  currentPage: number;
  pageSize: number;

  showRegisterForm: boolean;
  participantSearch: string;
  availableParticipants: PaginatedParticipants | null;
  participantsLoading: boolean;
  selectedParticipantId: number | null;
  registerNotes: string;
  registerLoading: boolean;
  registerError: ApiError | null;

  cancelConfirmId: number | null;
  cancelLoading: boolean;
  cancelError: ApiError | null;
}

const RegistrationsSection: React.FC<RegistrationsSectionProps> = ({
  eventId,
  eventStartTime,
  registrationDeadline,
  capacity,
  eventIsActive,
}) => {
  const [state, setState] = useState<RegistrationsSectionState>({
    registrations: null,
    loading: true,
    error: null,
    searchTerm: '',
    selectedStatus: '',
    currentPage: 1,
    pageSize: 10,

    showRegisterForm: false,
    participantSearch: '',
    availableParticipants: null,
    participantsLoading: false,
    selectedParticipantId: null,
    registerNotes: '',
    registerLoading: false,
    registerError: null,

    cancelConfirmId: null,
    cancelLoading: false,
    cancelError: null,
  });

  const now = new Date();
  const canRegister =
    eventIsActive &&
    now < registrationDeadline &&
    now < eventStartTime &&
    (state.registrations?.totalCount || 0) < capacity;

  const registerDisabledReason = !eventIsActive
    ? 'Event is not active'
    : now >= eventStartTime
    ? 'Event has already started'
    : now >= registrationDeadline
    ? 'Registration deadline has passed'
    : (state.registrations?.totalCount || 0) >= capacity
    ? 'Event is full'
    : null;

  useEffect(() => {
    loadRegistrations();
  }, [state.currentPage, state.pageSize, state.searchTerm, state.selectedStatus]);

  async function loadRegistrations() {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const params: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      };

      if (state.searchTerm) {
        params.search = state.searchTerm;
      }
      if (state.selectedStatus !== '') {
        params.status = parseInt(state.selectedStatus);
      }

      const data = await getEventRegistrations(eventId, params);
      setState((prev) => ({ ...prev, registrations: data, loading: false }));
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to load registrations');
      setState((prev) => ({ ...prev, error, loading: false }));
    }
  }

  async function searchParticipants(searchTerm: string) {
    setState((prev) => ({ ...prev, participantSearch: searchTerm }));

    if (searchTerm.length < 2) {
      setState((prev) => ({ ...prev, availableParticipants: null }));
      return;
    }

    setState((prev) => ({ ...prev, participantsLoading: true }));

    try {
      const data = await getParticipants({ search: searchTerm, pageSize: 10 });
      setState((prev) => ({ ...prev, availableParticipants: data, participantsLoading: false }));
    } catch (err) {
      setState((prev) => ({ ...prev, participantsLoading: false }));
    }
  }

  async function handleRegister() {
    if (!state.selectedParticipantId) return;

    setState((prev) => ({ ...prev, registerLoading: true, registerError: null }));

    try {
      const request: RegisterParticipantRequest = {
        participantId: state.selectedParticipantId,
        notes: state.registerNotes || null,
      };

      await registerParticipant(eventId, request);
      closeRegisterForm();
      loadRegistrations();
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to register participant');
      setState((prev) => ({ ...prev, registerError: error, registerLoading: false }));
    }
  }

  function closeRegisterForm() {
    setState((prev) => ({
      ...prev,
      showRegisterForm: false,
      participantSearch: '',
      availableParticipants: null,
      selectedParticipantId: null,
      registerNotes: '',
      registerError: null,
    }));
  }

  function openCancelConfirm(registrationId: number) {
    setState((prev) => ({ ...prev, cancelConfirmId: registrationId, cancelError: null }));
  }

  function closeCancelConfirm() {
    setState((prev) => ({ ...prev, cancelConfirmId: null }));
  }

  async function handleCancelConfirm() {
    if (state.cancelConfirmId === null) return;

    setState((prev) => ({ ...prev, cancelLoading: true, cancelError: null }));

    try {
      await cancelRegistration(state.cancelConfirmId);
      closeCancelConfirm();
      loadRegistrations();
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to cancel registration');
      setState((prev) => ({ ...prev, cancelError: error, cancelLoading: false }));
    }
  }

  if (state.loading && !state.registrations) {
    return <LoadingSpinner />;
  }

  const registrations = state.registrations;
  const activeCount = registrations?.items.filter((r) => r.status === 1).length || 0;
  const availableSeats = capacity - activeCount;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Registrations</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Active Registrations</p>
            <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Available Seats</p>
            <p className="text-2xl font-bold text-green-600">{availableSeats}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-purple-600">
              {registrations?.items.filter((r) => r.status === 2).length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Register Button */}
      <div>
        <button
          onClick={() => setState((prev) => ({ ...prev, showRegisterForm: true }))}
          disabled={!canRegister}
          title={registerDisabledReason || undefined}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            canRegister
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Register Participant
        </button>
        {registerDisabledReason && (
          <p className="text-sm text-gray-600 mt-2 italic">
            ℹ️ {registerDisabledReason}
          </p>
        )}
      </div>

      {/* Errors */}
      {state.error && <ErrorAlert error={state.error} onRetry={loadRegistrations} />}
      {state.registerError && (
        <ErrorAlert error={state.registerError} onDismiss={() => setState((prev) => ({ ...prev, registerError: null }))} />
      )}
      {state.cancelError && (
        <ErrorAlert error={state.cancelError} onDismiss={() => setState((prev) => ({ ...prev, cancelError: null }))} />
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search (Name/Email/Phone)
            </label>
            <input
              type="text"
              value={state.searchTerm}
              onChange={(e) => setState((prev) => ({ ...prev, searchTerm: e.target.value, currentPage: 1 }))}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={state.selectedStatus}
              onChange={(e) => setState((prev) => ({ ...prev, selectedStatus: e.target.value as any, currentPage: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="2">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      {registrations && registrations.items.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Participant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Registered</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.items.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{reg.participantName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{reg.participantEmail}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{reg.participantPhone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        reg.status === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reg.statusName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(reg.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {reg.status === 1 && (
                      <button
                        onClick={() => openCancelConfirm(reg.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No registrations found" />
      )}

      {/* Pagination */}
      {registrations && registrations.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          {Array.from({ length: registrations.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setState((prev) => ({ ...prev, currentPage: page }))}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                page === state.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Register Form Modal */}
      {state.showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Register Participant</h3>

            {/* Participant Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Participant
              </label>
              <input
                type="text"
                value={state.participantSearch}
                onChange={(e) => searchParticipants(e.target.value)}
                placeholder="Type name, email, or phone..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Participant Dropdown */}
            {state.availableParticipants && state.availableParticipants.items.length > 0 && (
              <div className="mb-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                {state.availableParticipants.items.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        selectedParticipantId: p.id,
                        participantSearch: p.fullName,
                        availableParticipants: null,
                      }))
                    }
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-0"
                  >
                    <p className="font-medium">{p.fullName}</p>
                    <p className="text-sm text-gray-600">{p.email}</p>
                  </button>
                ))}
              </div>
            )}

            {state.selectedParticipantId && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">✓ Participant selected</p>
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={state.registerNotes}
                onChange={(e) => setState((prev) => ({ ...prev, registerNotes: e.target.value }))}
                placeholder="Add any notes..."
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeRegisterForm}
                disabled={state.registerLoading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={!state.selectedParticipantId || state.registerLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {state.registerLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
      {state.cancelConfirmId !== null && (
        <ConfirmDialog
          open={state.cancelConfirmId !== null}
          title="Cancel Registration"
          message="Are you sure you want to cancel this registration?"
          confirmText="Cancel Registration"
          loading={state.cancelLoading}
          onConfirm={handleCancelConfirm}
          onCancel={closeCancelConfirm}
        />
      )}
    </div>
  );
};

export default RegistrationsSection;