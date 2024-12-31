import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Lock,
  Check,
  X
} from "lucide-react";
import axios from 'axios';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    clientProfile: {
      investmentExperience: "",
      investmentGoal: "",
      riskTolerance: ""
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editableDetails, setEditableDetails] = useState({...userDetails});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clients/getClientInformation/2401'); // Replace '1' with the actual client ID
        const data = response.data;
        setUserDetails({
          firstName: data.first_name,
          lastName: data.surname,
          email: data.email_address,
          phone: data.phone_number,
          address: {
            street: data.residential_address.street,
            city: data.residential_address.city,
            state: data.residential_address.country,
            zipCode: data.residential_address.postcode
          },
          clientProfile: {
            investmentExperience: data.client_profile.investment_experience,
            investmentGoal: data.client_profile.investment_goal,
            riskTolerance: data.client_profile.risk_tolerance
          }
        });
        setEditableDetails({
          firstName: data.first_name,
          lastName: data.surname,
          email: data.email_address,
          phone: data.phone_number,
          address: {
            street: data.residential_address.street,
            city: data.residential_address.city,
            state: data.residential_address.country,
            zipCode: data.residential_address.postcode
          },
          clientProfile: {
            investmentExperience: data.client_profile.investment_experience,
            investmentGoal: data.client_profile.investment_goal,
            riskTolerance: data.client_profile.risk_tolerance
          }
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDetailChange = (field, value) => {
    setEditableDetails(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {...prev, [field]: value};
    });
  };

  const saveDetails = () => {
    setUserDetails(editableDetails);
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitPasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Dummy API call simulation
    alert("Password changed successfully!");
    setIsPasswordModalOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-[#00836f]">
                User Profile
              </h1>
              <p className="text-gray-500 mt-2">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-[#00836f] text-white
                  rounded-xl hover:bg-[#006a59]
                  transition-all duration-300
                "
              >
                <Edit2 size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditableDetails(userDetails);
                    setIsEditing(false);
                  }}
                  className="
                    px-4 py-2 bg-gray-100 text-gray-700
                    rounded-xl hover:bg-gray-200
                    transition-all duration-300
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={saveDetails}
                  className="
                    flex items-center gap-2 px-4 py-2
                    bg-[#00836f] text-white rounded-xl
                    hover:scale-105 transition-all duration-300
                  "
                >
                  <Check size={18} /> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="mr-4 text-[#00836f]" />
                  {isEditing ? (
                    <div className="flex gap-2 w-full">
                      <input
                        value={editableDetails.firstName}
                        onChange={(e) => handleDetailChange('firstName', e.target.value)}
                        className="w-1/2 px-3 py-2 border rounded-lg"
                        placeholder="First Name"
                      />
                      <input
                        value={editableDetails.lastName}
                        onChange={(e) => handleDetailChange('lastName', e.target.value)}
                        className="w-1/2 px-3 py-2 border rounded-lg"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <span>{userDetails.firstName} {userDetails.lastName}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <Mail className="mr-4 text-[#00836f]" />
                  {isEditing ? (
                    <input
                      value={editableDetails.email}
                      onChange={(e) => handleDetailChange('email', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Email"
                    />
                  ) : (
                    <span>{userDetails.email}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <Phone className="mr-4 text-[#00836f]" />
                  {isEditing ? (
                    <input
                      value={editableDetails.phone}
                      onChange={(e) => handleDetailChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <span>{userDetails.phone}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Address
              </h2>
              <div className="flex items-center">
                <MapPin className="mr-4 text-[#00836f]" />
                {isEditing ? (
                  <div className="space-y-2 w-full">
                    <input
                      value={editableDetails.address.street}
                      onChange={(e) => handleDetailChange('address.street', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Street Address"
                    />
                    <div className="flex gap-2">
                      <input
                        value={editableDetails.address.city}
                        onChange={(e) => handleDetailChange('address.city', e.target.value)}
                        className="w-1/3 px-3 py-2 border rounded-lg"
                        placeholder="City"
                      />
                      <input
                        value={editableDetails.address.state}
                        onChange={(e) => handleDetailChange('address.state', e.target.value)}
                        className="w-1/3 px-3 py-2 border rounded-lg"
                        placeholder="State"
                      />
                      <input
                        value={editableDetails.address.zipCode}
                        onChange={(e) => handleDetailChange('address.zipCode', e.target.value)}
                        className="w-1/3 px-3 py-2 border rounded-lg"
                        placeholder="Zip"
                      />
                    </div>
                  </div>
                ) : (
                  <span>
                    {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state} {userDetails.address.zipCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="p-8 border-t border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
              <p className="text-gray-500">Manage your account security</p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="
                flex items-center gap-2 px-4 py-2
                bg-red-50 text-red-600
                rounded-xl hover:bg-red-100
                transition-all duration-300
              "
            >
              <Lock size={18} /> Change Password
            </button>
          </div>
        </div>

        {/* Password Change Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00836f]"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00836f]"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00836f]"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitPasswordChange}
                    className="
                      px-4 py-2
                      bg-[#00836f] text-white rounded-lg
                      hover:scale-105 transition-all duration-300
                    "
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
