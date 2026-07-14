/**
 * Participant Form component
 * Used for creating and editing participants
 */

import React, { useState, useEffect } from 'react';
import { participantsService, ApiError } from '../../api';
import type { ParticipantRequest } from '../../types/participant';

interface ParticipantFormProps {
  mode: 'create' | 'edit';
  participantId: number | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  mode,
  participantId,
  onClose,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === 'edit');

  // Load participant data if editing
  useEffect(() => {
    if (mode === 'edit' && participantId) {
      loadParticipantData();
    } else {
      setInitialLoading(false);
    }
  }, [mode, participantId]);

  async function loadParticipantData() {
    try {
      if (!participantId) return;
      const participant = await participantsService.getById(participantId);
      setFormData({
        fullName: participant.fullName,
        email: participant.email,
        phone: participant.phone,
        dateOfBirth: participant.dateOfBirth ? participant.dateOfBirth.split('T')[0] : '',
        isActive: participant.isActive,
      });
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to load participant');
      onError(error);
      onClose();
    } finally {
      setInitialLoading(false);
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 150) {
      newErrors.fullName = 'Full name must not exceed 150 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must not exceed 255 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (formData.phone.length > 30) {
      newErrors.phone = 'Phone must not exceed 30 characters';
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      if (birthDate > new Date()) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const request: ParticipantRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth || null,
        isActive: formData.isActive,
      };

      if (mode === 'create') {
        await participantsService.create(request);
      } else if (participantId) {
        await participantsService.update(participantId, request);
      }

      onSuccess();
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, 'Failed to save participant');
      onError(error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field: keyof FormData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Add Participant' : 'Edit Participant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              maxLength={150}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              maxLength={255}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              maxLength={30}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Active State */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
              Active
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;