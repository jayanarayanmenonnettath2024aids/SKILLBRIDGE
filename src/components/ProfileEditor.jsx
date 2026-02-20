import React, { useState, useEffect, useCallback } from 'react';
import { updateProfile, getProfile } from '../services/api';

const ProfileEditor = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        education: [],
        skills: {},
        experience: [],
        achievements: [],
        interests: []
    });
    const [status, setStatus] = useState('');

    const loadProfile = useCallback(async () => {
        const data = await getProfile();
        if (data) setProfile(data);
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Saving...');
        try {
            await updateProfile(profile);
            setStatus('Profile saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch {
            setStatus('Error saving profile.');
        }
    };

    return (
        <div className="profile-editor p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (JSON)</label>
                    <textarea
                        name="skills"
                        value={JSON.stringify(profile.skills, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setProfile(prev => ({ ...prev, skills: parsed }));
                            } catch {
                                // Allow typing invalid JSON temporarily
                            }
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border h-32 font-mono"
                        placeholder='{"frontend": ["React"], "backend": ["Python"]}'
                    />
                    <p className="text-xs text-gray-500">Enter skills as valid JSON.</p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Profile
                    </button>
                </div>
                {status && <p className="text-center text-sm font-medium text-green-600">{status}</p>}
            </form>
        </div>
    );
};

export default ProfileEditor;
