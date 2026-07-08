/**
 * Participants management page
 * Displays paginated participant table with search and filtering
 */

import React, { useState, useEffect } from 'react';
import { getParticipants, deleteParticipant } from '../api/services/participants';
import type { PaginatedParticipants } from '../types/participant';
import { ApiError } from '../api/client';
import ParticipantForm from '../components/participants/ParticipantForm';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

interface ParticipantsPageState {
  participants: PaginatedParticipants | null;
  loading: boolean;
  error: ApiError | null;
  searchTerm: string;
  selectedIsActive: boolean | '';
  currentPage: number;
  pageSize: number;
  showForm: boolean;
  formMode: 'create' | 'edit';
  selectedParticipantId: number | null;
  deleteConfirmId: number | null;
  deleteLoading: boolean;
  deleteError: ApiError | null;
  submitError: ApiError | null;
}

const ParticipantsPage: React.FC = () => {
  const [state, setState] = useState<ParticipantsPageState>({
    participants: null,
    loading: true,
    error: null,
    searchTerm: '',
    selectedIsActive: '',
    currentPage: 1,
    pageSize: 10,
    showForm: false,
    formMode: 'create',
    selectedParticipantId: null,
    deleteConfirmId: null,
    deleteLoading: false,
    deleteError: null,
    submitError: null,
  });

  // Load participants on mount and when filters change
  useEffect(() => {
    loadParticipants();
  }, [state.currentPage, state.pageSize, state.searchTerm, state.selectedIsActive]);

  async function loadParticipants() {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const params: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      };

      if (state.searchTerm) {
        params.search = state.searchTerm;
      }
      if (state.selectedIsActive !== '') {
        params.isActive = state.selectedIsActive as boolean;
      }

      const data = await getParticipants(params);
      setState((prev) => ({ ...prev, participants: data, loading: false }));
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to load participants');
      setState((prev) => ({ ...prev, error, loading: false }));
    }
  }

  function handleSearch(value: string) {
    setState((prev) => ({ ...prev, searchTerm: value, currentPage: 1 }));
  }

  function handleIsActiveChange(value: string) {
    setState((prev) => ({
      ...prev,
      selectedIsActive: value === '' ? '' : value === 'true',
      currentPage: 1,
    }));
  }

  function handlePageChange(page: number) {
    setState((prev) => ({ ...prev, currentPage: page }));
  }

  function openCreateForm() {
    setState((prev) => ({
      ...prev,
      showForm: true,
      formMode: 'create',
      selectedParticipantId: null,
      submitError: null,
    }));
  }

  function openEditForm(participantId: number) {
    setState((prev) => ({
      ...prev,
      showForm: true,
      formMode: 'edit',
      selectedParticipantId: participantId,
      submitError: null,
    }));
  }

  function closeForm() {
    setState((prev) => ({
      ...prev,
      showForm: false,
      selectedParticipantId: null,
      submitError: null,
    }));
  }

  function handleFormSuccess() {
    closeForm();
    setState((prev) => ({ ...prev, currentPage: 1 }));
    loadParticipants();
  }

  function handleFormError(error: ApiError) {
    setState((prev) => ({ ...prev, submitError: error }));
  }

  function openDeleteConfirm(participantId: number) {
    setState((prev) => ({ ...prev, deleteConfirmId: participantId, deleteError: null }));
  }

  function closeDeleteConfirm() {
    setState((prev) => ({ ...prev, deleteConfirmId: null }));
  }

  async function handleDeleteConfirm() {
    if (state.deleteConfirmId === null) return;

    setState((prev) => ({ ...prev, deleteLoading: true, deleteError: null }));

    try {
      await deleteParticipant(state.deleteConfirmId);
      closeDeleteConfirm();
      setState((prev) => ({ ...prev, currentPage: 1 }));
      loadParticipants();
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to delete participant');
      setState((prev) => ({ ...prev, deleteError: error, deleteLoading: false }));
    }
  }

  if (state.loading && !state.participants) {
    return <LoadingSpinner />;
  }

  if (state.error && !state.participants) {
    return <ErrorAlert error={state.error} onRetry={loadParticipants} />;
  }

  const participants = state.participants;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Participants</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Participant
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search (Name/Email/Phone)
            </label>
            <input
              type="text"
              value={state.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Active State Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
  value={state.selectedIsActive === '' ? '' : String(state.selectedIsActive)}
  onChange={(e) => handleIsActiveChange(e.target.value)}
  className="..."
>
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alerts */}
      {state.submitError && (
        <ErrorAlert error={state.submitError} onDismiss={() => setState((prev) => ({ ...prev, submitError: null }))} />
      )}
      {state.deleteError && (
        <ErrorAlert error={state.deleteError} onDismiss={() => setState((prev) => ({ ...prev, deleteError: null }))} />
      )}

      {/* Participants Table */}
      {participants && participants.items.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date of Birth</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participants.items.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{participant.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{participant.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{participant.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {participant.dateOfBirth ? new Date(participant.dateOfBirth).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        participant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {participant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => openEditForm(participant.id)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(participant.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No participants found" />
      )}

      {/* Pagination */}
      {participants && participants.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          {Array.from({ length: participants.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
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

      {/* Participant Form Modal */}
      {state.showForm && (
        <ParticipantForm
          mode={state.formMode}
          participantId={state.selectedParticipantId}
          onClose={closeForm}
          onSuccess={handleFormSuccess}
          onError={handleFormError}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {state.deleteConfirmId !== null && (
        <ConfirmDialog
          open={state.deleteConfirmId !== null}
          title="Delete Participant"
          message="Are you sure you want to delete this participant? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteConfirm}
          loading={state.deleteLoading}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ParticipantsPage;