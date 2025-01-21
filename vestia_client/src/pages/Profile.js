import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Lock,
  Check,
  X,
  Settings,
  DollarSign,
  Shield,
  LogOut
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
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/clients/getClientInformation/${userId}`);
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
            ...data,
            residential_address: data.residential_address,
            client_profile: data.client_profile
          });

        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    } else {
      console.error('User ID not found');
    }
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
    // Here you would typically save to the server after validation
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#00836f] text-white p-8 flex-shrink-0">
        <nav className="space-y-4">
          <a href="/profile" className="flex items-center text-lg hover:text-gray-300">
            <Settings size={20} className="mr-3" /> Profile & Settings
          </a>
          <a href="/bank-accounts" className="flex items-center text-lg hover:text-gray-300">
            <DollarSign size={20} className="mr-3" /> Bank Accounts
          </a>
          <a href="/security" className="flex items-center text-lg hover:text-gray-300">
            <Shield size={20} className="mr-3" /> Security
          </a>
          <a href="/logout" className="flex items-center text-lg hover:text-gray-300">
            <LogOut size={20} className="mr-3" /> Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#00836f]">Profile Settings</h1>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#00836f] text-white rounded-2xl hover:bg-[#006a59] transition-colors">
                <Edit2 size={18} className="inline mr-2" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditableDetails(userDetails);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={saveDetails}
                  className="px-4 py-2 bg-[#00836f] text-white rounded-2xl hover:bg-[#006a59] transition-colors">
                  <Check size={18} className="inline mr-2" /> Save
                </button>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Info</h2>
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
                {/* ... (other fields like email, phone) */}
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
              <div className="flex items-center">
                <MapPin className="mr-4 text-[#00836f]" />
                {isEditing ? (
                  <div className="space-y-2 w-full">
                    {/* Address inputs */}
                  </div>
                ) : (
                  <span>
                    {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state} {userDetails.address.zipCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Investment Profile */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Investment details here */}
            </div>
          </div>

          {/* Security Section */}
          <div className="flex justify-between items-center border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors">
              <Lock size={18} className="inline mr-2" /> Change Password
            </button>
          </div>
        </div>

        {/* Password Change Modal */}
        {/* ... (code for modal remains unchanged) */}
      </main>
    </div>
  );
};

export default Profile;