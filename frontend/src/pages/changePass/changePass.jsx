// ChangePassword.jsx

import React, { useContext, useState } from 'react';
import './changePass.scss';
import { AuthContext } from '../../context/AuthContext';
import { changePassword, getUserInfoByEmail } from '../../service/UserService';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const userData = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Dynamically update state based on input name
        switch (name) {
            case 'currentPassword':
                setCurrentPassword(value);
                break;
            case 'newPassword':
                setNewPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Validation
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match!');
            return;
        }
        
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long!');
            return;
        }
        
        setLoading(true);
        
        try {
            const userMail = userData.currentUser.sub;
            const user = await getUserInfoByEmail(userMail);
            
            const data = {
                currentPassword,
                newPassword,
                token: ""
            };
            
            await changePassword(data);
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data || 'Failed to change password. Please check your current password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: "90vh", display: 'flex', justifyItems: "center", alignItems: "center", backgroundColor: '#f8f9fa' }}>
            <div className="change-password-container" >
                <h2>🔐 Change Password</h2>
                
                {error && (
                    <div style={{
                        padding: '12px 16px',
                        marginBottom: '20px',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '8px',
                        border: '1px solid #fcc',
                        fontSize: '14px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
                
                {success && (
                    <div style={{
                        padding: '12px 16px',
                        marginBottom: '20px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '8px',
                        border: '1px solid #c3e6cb',
                        fontSize: '14px'
                    }}>
                        ✅ {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? '🔄 Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
